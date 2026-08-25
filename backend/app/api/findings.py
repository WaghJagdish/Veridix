"""
VERIDIX Findings API — Complete implementation with enriched detail endpoint.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.db_models import Finding, DriftEvent, TestCase, LanguageVariant, ModelResponse, Evaluation
from app.schemas.schemas import FindingResponse, LanguageVariantDetail, EvaluationDetail

router = APIRouter(prefix="/scans", tags=["Findings"])
router_single = APIRouter(prefix="/findings", tags=["Findings"])


@router.get("/{scan_id}/findings", response_model=List[FindingResponse])
def list_findings(
    scan_id: str,
    severity: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Finding).filter(Finding.scan_id == scan_id)
    if severity:
        q = q.filter(Finding.severity == severity)
    if language:
        q = q.filter(Finding.language == language)
    if category:
        q = q.filter(Finding.category == category)

    findings = q.order_by(
        Finding.severity.in_(["critical", "high", "medium", "low"]),
        Finding.created_at.desc(),
    ).all()

    result = []
    for f in findings:
        resp = _build_finding_response(f, db, include_variants=False)
        result.append(resp)
    return result


@router_single.get("/{finding_id}", response_model=FindingResponse)
def get_finding(finding_id: str, db: Session = Depends(get_db)):
    f = db.query(Finding).filter(Finding.id == finding_id).first()
    if not f:
        raise HTTPException(404, "Finding not found")
    return _build_finding_response(f, db, include_variants=True)


def _build_finding_response(f: Finding, db: Session, include_variants: bool = True) -> FindingResponse:
    # Get drift event
    drift = None
    if f.drift_event_id:
        drift = db.query(DriftEvent).filter(DriftEvent.id == f.drift_event_id).first()

    # Get language variants with evaluations for the test case
    variant_details = []
    if include_variants and f.test_case_id:
        variants = db.query(LanguageVariant).filter(LanguageVariant.test_case_id == f.test_case_id).all()
        for v in variants:
            resp = db.query(ModelResponse).filter(ModelResponse.variant_id == v.id).first()
            ev = db.query(Evaluation).filter(Evaluation.variant_id == v.id).first()

            eval_detail = None
            if ev:
                eval_detail = EvaluationDetail(
                    verdict=ev.verdict or "unknown",
                    severity=ev.severity or "none",
                    confidence=ev.confidence or 0.0,
                    refusal_quality=ev.refusal_quality or 0.0,
                    policy_adherence=ev.policy_adherence or 0.0,
                    reasoning=ev.reasoning or "",
                    evidence=ev.evidence or "",
                )

            variant_details.append(LanguageVariantDetail(
                language=v.language,
                prompt=v.generated_prompt,
                response=resp.raw_response if resp else None,
                latency_ms=resp.latency_ms if resp else None,
                status=resp.status if resp else None,
                evaluation=eval_detail,
            ))

    return FindingResponse(
        id=f.id,
        scan_id=f.scan_id,
        test_case_id=f.test_case_id,
        drift_event_id=f.drift_event_id,
        finding_ref=f.finding_ref or "",
        title=f.title or "",
        category=f.category or "",
        severity=f.severity or "low",
        confidence=f.confidence or 0.0,
        language=f.language or "en",
        attack_type=f.attack_type or "",
        attack_strategy=f.attack_strategy,
        owasp_ref=f.owasp_ref,
        prompt=f.prompt or "",
        model_response=f.model_response or "",
        evaluator_reasoning=f.evaluator_reasoning or "",
        remediation=f.remediation or "",
        created_at=f.created_at,
        drift_score=drift.drift_score if drift else None,
        drift_level=drift.drift_level if drift else None,
        drift_explanation=drift.explanation if drift else None,
        contributing_factors=drift.contributing_factors if drift else None,
        language_variants=variant_details if include_variants else None,
    )
