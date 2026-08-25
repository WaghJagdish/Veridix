from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Project(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Target(Base):
    __tablename__ = "targets"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False) # openai/anthropic/gemini/groq/custom
    model = Column(String, nullable=False)
    endpoint = Column(String, nullable=True)
    api_key_encrypted = Column(String, nullable=True)
    system_prompt = Column(String, nullable=True)
    app_description = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Scan(Base):
    __tablename__ = "scans"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    target_id = Column(String, ForeignKey("targets.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="pending") # pending/running/completed/failed
    preset = Column(String)
    languages = Column(JSON)
    categories = Column(JSON)
    judge_provider = Column(String)
    judge_model = Column(String)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    total_tests = Column(Integer, default=0)
    tests_completed = Column(Integer, default=0)
    tests_failed = Column(Integer, default=0)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class TestCase(Base):
    __tablename__ = "test_cases"
    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    semantic_intent = Column(String)
    attack_category = Column(String)
    attack_strategy = Column(String)
    base_prompt_en = Column(String)
    owasp_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    variants = relationship("LanguageVariant", back_populates="test_case")

class LanguageVariant(Base):
    __tablename__ = "language_variants"
    id = Column(String, primary_key=True, default=generate_uuid)
    test_case_id = Column(String, ForeignKey("test_cases.id"), nullable=False)
    language = Column(String)
    generated_prompt = Column(String)
    generation_method = Column(String)
    attack_metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    test_case = relationship("TestCase", back_populates="variants")

class ModelResponse(Base):
    __tablename__ = "model_responses"
    id = Column(String, primary_key=True, default=generate_uuid)
    variant_id = Column(String, ForeignKey("language_variants.id"), nullable=False)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    raw_response = Column(String)
    latency_ms = Column(Integer)
    status = Column(String)
    token_usage = Column(JSON)
    error_message = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(String, primary_key=True, default=generate_uuid)
    response_id = Column(String, ForeignKey("model_responses.id"), nullable=False)
    variant_id = Column(String, ForeignKey("language_variants.id"), nullable=False)
    verdict = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    refusal_quality = Column(Float)
    policy_adherence = Column(Float)
    category = Column(String)
    reasoning = Column(String)
    evidence = Column(String)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

class DriftEvent(Base):
    __tablename__ = "drift_events"
    id = Column(String, primary_key=True, default=generate_uuid)
    test_case_id = Column(String, ForeignKey("test_cases.id"), nullable=False)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    drift_score = Column(Float)
    drift_level = Column(String)
    anchor_language = Column(String)
    per_language_scores = Column(JSON)
    explanation = Column(String)
    contributing_factors = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Finding(Base):
    __tablename__ = "findings"
    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    test_case_id = Column(String, ForeignKey("test_cases.id"), nullable=False)
    drift_event_id = Column(String, ForeignKey("drift_events.id"), nullable=True)
    finding_ref = Column(String)
    title = Column(String)
    category = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    language = Column(String)
    attack_type = Column(String)
    attack_strategy = Column(String)
    owasp_ref = Column(String, nullable=True)
    prompt = Column(String)
    model_response = Column(String)
    evaluator_reasoning = Column(String)
    remediation = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, default=generate_uuid)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    pdf_path = Column(String, nullable=True)
    html_content = Column(String)
