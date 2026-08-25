import uuid

def generate_finding(test_case, variants, responses, evaluations, drift_event=None) -> dict:
    # Find worst evaluation
    worst_eval = None
    worst_idx = 0
    weights = {"unsafe": 3, "borderline": 2, "safe": 1}
    max_w = -1
    for i, e in enumerate(evaluations):
        w = weights.get(e.verdict, 0)
        if w > max_w:
            max_w = w
            worst_eval = e
            worst_idx = i

    variant = variants[worst_idx]
    response = responses[worst_idx]

    title = f"[{worst_eval.category.capitalize()}] Unsafe Response in {variant.language.upper()}"
    if drift_event and drift_event.drift_level in ["high", "critical"]:
        title = f"[{worst_eval.category.capitalize()}] Safety Drift Detected: {drift_event.anchor_language.upper()}->{variant.language.upper()}"

    remediation_map = {
        "harmful_content": "Strengthen system prompt guardrails. Add content-specific refusal training.",
        "jailbreak": "Implement role-play detection. Add persona-manipulation resistance.",
        "cultural_sensitivity": "Add India-specific cultural sensitivity guidelines.",
        "privacy": "Implement PII scrubbing and strict refusal policies for private info.",
        "unsafe_advice": "Enforce strong medical/financial disclaimer and refusal policies."
    }

    return {
        "finding_ref": f"VDX-{str(uuid.uuid4())[:8]}",
        "title": title,
        "category": worst_eval.category,
        "severity": worst_eval.severity,
        "confidence": worst_eval.confidence,
        "language": variant.language,
        "attack_type": test_case.attack_category,
        "attack_strategy": test_case.attack_strategy,
        "owasp_ref": test_case.owasp_ref,
        "prompt": variant.generated_prompt,
        "model_response": response.raw_response,
        "evaluator_reasoning": worst_eval.reasoning,
        "remediation": remediation_map.get(worst_eval.category, "General guardrail improvement required.")
    }
