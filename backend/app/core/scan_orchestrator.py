"""
VERIDIX Scan Orchestrator — Manages the full attack → execute → evaluate → drift pipeline.
"""
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.db_models import (
    Scan, TestCase, LanguageVariant, ModelResponse,
    Evaluation, DriftEvent, Finding, Target
)
from app.core.providers.factory import get_provider
from app.core.intents.intent_library import INTENTS, get_intents_for_categories
from app.core.attack_generator import generate_attack_variants
from app.core.execution_engine import execute_variant
from app.core.safety_judge import evaluate_response
from app.core.drift_analyzer import calculate_drift
from app.core.finding_generator import generate_finding
from app.config import settings


def _event(stage: str, message: str, **kwargs) -> dict:
    """Build a structured SSE event dict."""
    return {
        "stage": stage,
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
        **kwargs,
    }


async def run_scan(scan_id: str, db: Session, event_queue: asyncio.Queue):
    """
    Main scan orchestration coroutine.
    Runs as a background task; emits events to SSE queue.
    """
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        await event_queue.put(_event("error", f"Scan {scan_id} not found"))
        await event_queue.put("DONE")
        return

    target = db.query(Target).filter(Target.id == scan.target_id).first()

    # Demo mode: stream pre-recorded data
    if scan.is_demo:
        from app.demo.demo_dataset import run_demo_scan
        await run_demo_scan(scan, db, event_queue)
        return

    # Live mode
    try:
        provider = get_provider(target)
    except Exception as e:
        scan.status = "failed"
        db.commit()
        await event_queue.put(_event("error", f"Failed to initialize provider: {str(e)[:200]}"))
        await event_queue.put("DONE")
        return

    scan.status = "running"
    scan.started_at = datetime.utcnow()

    # Filter intents by selected categories; cap per preset
    preset_limits = {"quick": 5, "indic": 10, "full": 20, "custom": 15}
    limit = preset_limits.get(scan.preset or "indic", 10)
    intents_to_run = get_intents_for_categories(scan.categories or [])[:limit]

    scan.total_tests = len(intents_to_run) * len(scan.languages or ["en"])
    db.commit()

    await event_queue.put(_event(
        "generating",
        f"Initializing scan: {len(intents_to_run)} intents × {len(scan.languages or ['en'])} languages = {scan.total_tests} tests",
        progress=2, total=scan.total_tests, completed=0,
    ))

    for idx, intent in enumerate(intents_to_run):
        await event_queue.put(_event(
            "generating",
            f"Generating attack variants for: {intent.description} ({intent.attack_strategy} strategy)",
            category=intent.category,
            progress=int((idx / len(intents_to_run)) * 40),
            total=scan.total_tests,
            completed=scan.tests_completed,
        ))

        tc = TestCase(
            scan_id=scan.id,
            semantic_intent=intent.description,
            attack_category=intent.category,
            attack_strategy=intent.attack_strategy,
            base_prompt_en=intent.base_prompt_en,
            owasp_ref=intent.owasp_ref,
        )
        db.add(tc)
        db.commit()

        # Generate language variants
        variants_data = await generate_attack_variants(
            intent, scan.languages or ["en"],
            use_llm=bool(settings.judge_api_key),
            judge_provider_config={"api_key": settings.judge_api_key, "model": scan.judge_model or "gpt-4o-mini"},
        )

        variants = []
        for vd in variants_data:
            v = LanguageVariant(
                test_case_id=tc.id,
                language=vd["language"],
                generated_prompt=vd["generated_prompt"],
                generation_method=vd["generation_method"],
                attack_metadata=vd.get("attack_metadata", {}),
            )
            db.add(v)
            variants.append(v)
        db.commit()

        evaluations_dict = {}
        evals = []

        # Execute and evaluate each language variant
        for v in variants:
            await event_queue.put(_event(
                "executing",
                f"Sending {v.language.upper()}-{idx+1:03d} → {target.name} ({target.model})",
                language=v.language,
                category=intent.category,
                total=scan.total_tests,
                completed=scan.tests_completed,
            ))

            resp_data = await execute_variant(v, provider, target.system_prompt)
            mr = ModelResponse(
                variant_id=v.id,
                scan_id=scan.id,
                raw_response=resp_data.get("raw_response", ""),
                latency_ms=resp_data.get("latency_ms", 0),
                status=resp_data.get("status", "error"),
                token_usage=resp_data.get("token_usage", {}),
                error_message=resp_data.get("error_message"),
            )
            db.add(mr)
            db.commit()

            await event_queue.put(_event(
                "evaluating",
                f"Evaluating {v.language.upper()}-{idx+1:03d} (latency: {mr.latency_ms}ms)",
                language=v.language,
                category=intent.category,
                total=scan.total_tests,
                completed=scan.tests_completed,
            ))

            eval_data = await evaluate_response(
                prompt=v.generated_prompt,
                response=mr.raw_response or "",
                category=intent.category,
                api_key=settings.judge_api_key or "",
                model=scan.judge_model or "gpt-4o-mini",
            )

            ev = Evaluation(
                response_id=mr.id,
                variant_id=v.id,
                verdict=eval_data.get("verdict", "borderline"),
                severity=eval_data.get("severity", "medium"),
                confidence=eval_data.get("confidence", 0.6),
                refusal_quality=eval_data.get("refusal_quality", 0.5),
                policy_adherence=eval_data.get("policy_adherence", 0.5),
                category=eval_data.get("category", intent.category),
                reasoning=eval_data.get("reasoning", ""),
                evidence=eval_data.get("evidence", ""),
            )
            db.add(ev)
            evals.append(ev)
            evaluations_dict[v.language] = ev

            scan.tests_completed += 1
            if ev.verdict != "safe":
                scan.tests_failed += 1
            db.commit()

            verdict_icon = {"safe": "✓", "borderline": "⚠", "unsafe": "✗"}.get(ev.verdict, "?")
            await event_queue.put(_event(
                "evaluating",
                f"{verdict_icon} {v.language.upper()}-{idx+1:03d}: {ev.verdict.upper()} (confidence: {ev.confidence:.2f})",
                language=v.language,
                category=intent.category,
                verdict=ev.verdict,
                progress=40 + int((scan.tests_completed / scan.total_tests) * 50),
                total=scan.total_tests,
                completed=scan.tests_completed,
            ))

        # Drift analysis
        if len(evaluations_dict) > 1:
            drift_res = calculate_drift(evaluations_dict)
            de = DriftEvent(
                test_case_id=tc.id,
                scan_id=scan.id,
                drift_score=drift_res.drift_score,
                drift_level=drift_res.drift_level,
                anchor_language=drift_res.anchor_language,
                per_language_scores=drift_res.scores,
                explanation=drift_res.explanation,
                contributing_factors=drift_res.contributing_factors,
            )
            db.add(de)
            db.commit()

            if drift_res.drift_level not in ("none", "low"):
                await event_queue.put(_event(
                    "analyzing",
                    f"🔍 Safety Drift: {intent.category} — Score: {drift_res.drift_score:.2f} [{drift_res.drift_level.upper()}]",
                    category=intent.category,
                    drift_score=drift_res.drift_score,
                    drift_level=drift_res.drift_level,
                    total=scan.total_tests,
                    completed=scan.tests_completed,
                ))

            # Generate finding for significant drift or any unsafe verdict
            if drift_res.drift_level in ("high", "critical") or any(e.verdict == "unsafe" for e in evals):
                fd = generate_finding(tc, variants, [], evals, de)
                f = Finding(
                    scan_id=scan.id,
                    test_case_id=tc.id,
                    drift_event_id=de.id,
                    **fd,
                )
                db.add(f)
                db.commit()

    scan.status = "completed"
    scan.completed_at = datetime.utcnow()
    db.commit()

    await event_queue.put(_event(
        "complete",
        f"Scan complete. {scan.tests_completed} tests, {scan.tests_failed} issues detected.",
        progress=100,
        total=scan.total_tests,
        completed=scan.tests_completed,
        summary={
            "total": scan.total_tests,
            "completed": scan.tests_completed,
            "failed": scan.tests_failed,
        },
    ))
    await event_queue.put("DONE")
