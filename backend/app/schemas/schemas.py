"""
VERIDIX — Complete Pydantic Schemas for all API requests and responses.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ──────────────────────────────────────────────────────────────────────────────
# TARGET
# ──────────────────────────────────────────────────────────────────────────────

class TargetCreate(BaseModel):
    name: str
    provider: str  # openai / anthropic / gemini / groq / custom
    model: str
    endpoint: Optional[str] = None
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None
    app_description: Optional[str] = None


class TargetResponse(BaseModel):
    id: str
    name: str
    provider: str
    model: str
    endpoint: Optional[str] = None
    api_key_masked: Optional[str] = None
    system_prompt: Optional[str] = None
    app_description: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TargetVerifyResponse(BaseModel):
    success: bool
    message: str
    latency_ms: Optional[int] = None


# ──────────────────────────────────────────────────────────────────────────────
# SCAN
# ──────────────────────────────────────────────────────────────────────────────

class ScanCreate(BaseModel):
    target_id: str
    name: str
    preset: str = "indic"
    languages: List[str] = ["en", "hi", "hinglish"]
    categories: List[str] = ["harmful_content", "jailbreak", "cultural_sensitivity", "bias"]
    judge_provider: str = "groq"
    judge_model: str = "openai/gpt-oss-120b"
    judge_api_key: Optional[str] = None
    judge_endpoint: Optional[str] = None
    is_demo: bool = False


class ScanResponse(BaseModel):
    id: str
    target_id: str
    project_id: Optional[str] = None
    name: str
    status: str
    preset: Optional[str] = None
    languages: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    judge_provider: Optional[str] = None
    judge_model: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_tests: int = 0
    tests_completed: int = 0
    tests_failed: int = 0
    is_demo: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────────────────────────────────────
# SCAN SUMMARY (computed from DB queries)
# ──────────────────────────────────────────────────────────────────────────────

class HeatmapCell(BaseModel):
    language: str
    category: str
    score: float  # 0-100
    test_count: int


class ScanSummary(BaseModel):
    scan_id: str
    overall_safety_score: float        # 0-100
    safety_drift_score: float          # 0-100 (higher = more drift)
    jailbreak_resistance: float        # 0-100
    refusal_quality: float             # 0-100
    policy_adherence: float            # 0-100
    language_consistency: float        # 0-100

    # Counts
    total_tests: int
    safe_tests: int
    borderline_tests: int
    unsafe_tests: int
    error_tests: int

    # Findings
    critical_findings: int
    high_findings: int
    medium_findings: int
    low_findings: int
    total_findings: int

    # Drift
    drift_events: int
    critical_drift: int
    high_drift: int
    medium_drift: int
    low_drift: int
    no_drift: int

    # Per-language safety scores
    language_scores: Dict[str, float]

    # Per-category safety scores
    category_scores: Dict[str, float]

    # Heatmap data (language × category)
    heatmap_data: List[HeatmapCell]


# ──────────────────────────────────────────────────────────────────────────────
# TEST CASE
# ──────────────────────────────────────────────────────────────────────────────

class EvaluationDetail(BaseModel):
    verdict: str
    severity: str
    confidence: float
    refusal_quality: float
    policy_adherence: float
    reasoning: str
    evidence: str

    class Config:
        from_attributes = True


class LanguageVariantDetail(BaseModel):
    language: str
    prompt: str
    response: Optional[str] = None
    latency_ms: Optional[int] = None
    status: Optional[str] = None
    evaluation: Optional[EvaluationDetail] = None


class TestCaseDetail(BaseModel):
    id: str
    semantic_intent: str
    attack_category: str
    attack_strategy: Optional[str] = None
    base_prompt_en: str
    owasp_ref: Optional[str] = None
    drift_score: Optional[float] = None
    drift_level: Optional[str] = None
    variants: List[LanguageVariantDetail] = []


# ──────────────────────────────────────────────────────────────────────────────
# FINDING
# ──────────────────────────────────────────────────────────────────────────────

class FindingResponse(BaseModel):
    id: str
    scan_id: str
    test_case_id: str
    drift_event_id: Optional[str] = None
    finding_ref: str
    title: str
    category: str
    severity: str
    confidence: float
    language: str
    attack_type: str
    attack_strategy: Optional[str] = None
    owasp_ref: Optional[str] = None
    prompt: str
    model_response: str
    evaluator_reasoning: str
    remediation: str
    created_at: datetime

    # Enriched (populated in detail endpoint)
    drift_score: Optional[float] = None
    drift_level: Optional[str] = None
    drift_explanation: Optional[str] = None
    contributing_factors: Optional[List[str]] = None
    language_variants: Optional[List[LanguageVariantDetail]] = None

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────────────────────────────────────
# REPORT
# ──────────────────────────────────────────────────────────────────────────────

class ReportResponse(BaseModel):
    id: str
    scan_id: str
    generated_at: datetime
    pdf_path: Optional[str] = None
    download_url: Optional[str] = None

    class Config:
        from_attributes = True


# ──────────────────────────────────────────────────────────────────────────────
# DEMO
# ──────────────────────────────────────────────────────────────────────────────

class DemoStatusResponse(BaseModel):
    seeded: bool
    scan_id: Optional[str] = None
    project_id: Optional[str] = None
    target_id: Optional[str] = None


class DemoSeedResponse(BaseModel):
    success: bool
    message: str
    scan_id: Optional[str] = None
    project_id: Optional[str] = None
    target_id: Optional[str] = None
