"""
VERIDIX Targets API — Complete implementation with provider-aware verification.
"""
import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.db_models import Target
from app.schemas.schemas import TargetCreate, TargetResponse, TargetVerifyResponse
from app.core.providers.factory import get_provider

router = APIRouter(prefix="/targets", tags=["Targets"])


def _mask_key(raw_key: str) -> str:
    """Mask API key for safe display. Never returns the full key."""
    if not raw_key or raw_key == "DEMO_KEY_NOT_REAL":
        return "demo-key-****"
    if len(raw_key) <= 8:
        return "****"
    return f"{raw_key[:3]}...{raw_key[-4:]}"


def _enrich_target(t: Target) -> Target:
    """Attach masked key to target object (transient attribute)."""
    t.api_key_masked = _mask_key(t.api_key_encrypted or "")
    return t


@router.get("", response_model=List[TargetResponse])
def list_targets(db: Session = Depends(get_db)):
    targets = db.query(Target).order_by(Target.created_at.desc()).all()
    return [_enrich_target(t) for t in targets]


@router.post("", response_model=TargetResponse)
def create_target(target: TargetCreate, db: Session = Depends(get_db)):
    db_target = Target(
        name=target.name,
        provider=target.provider,
        model=target.model,
        endpoint=target.endpoint,
        api_key_encrypted=target.api_key,  # MVP: stored as-is, structure ready for encryption
        system_prompt=target.system_prompt,
        app_description=target.app_description,
    )
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return _enrich_target(db_target)


@router.get("/{target_id}", response_model=TargetResponse)
def get_target(target_id: str, db: Session = Depends(get_db)):
    t = db.query(Target).filter(Target.id == target_id).first()
    if not t:
        raise HTTPException(404, "Target not found")
    return _enrich_target(t)


@router.delete("/{target_id}")
def delete_target(target_id: str, db: Session = Depends(get_db)):
    t = db.query(Target).filter(Target.id == target_id).first()
    if not t:
        raise HTTPException(404, "Target not found")
    db.delete(t)
    db.commit()
    return {"status": "deleted", "id": target_id}


@router.post("/{target_id}/verify", response_model=TargetVerifyResponse)
async def verify_target(target_id: str, db: Session = Depends(get_db)):
    t = db.query(Target).filter(Target.id == target_id).first()
    if not t:
        raise HTTPException(404, "Target not found")

    # Demo target: always succeeds
    if t.api_key_encrypted == "DEMO_KEY_NOT_REAL":
        t.verified_at = datetime.utcnow()
        db.commit()
        return TargetVerifyResponse(
            success=True,
            message=f"[DEMO] Connected to {t.model} — This is pre-recorded demo data.",
            latency_ms=42,
        )

    try:
        provider = get_provider(t)
        start = time.time()
        success = await provider.verify_connection()
        latency = int((time.time() - start) * 1000)

        if success:
            t.verified_at = datetime.utcnow()
            db.commit()
            return TargetVerifyResponse(
                success=True,
                message=f"Successfully connected to {t.provider}/{t.model}",
                latency_ms=latency,
            )
        else:
            return TargetVerifyResponse(
                success=False,
                message="Connection failed — model returned no response. Check API key and model name.",
                latency_ms=latency,
            )
    except Exception as e:
        err = str(e)
        if "401" in err or "invalid" in err.lower() or "authentication" in err.lower():
            msg = "Authentication failed — invalid API key."
        elif "404" in err or "not found" in err.lower():
            msg = f"Model '{t.model}' not found. Check the model name for provider '{t.provider}'."
        elif "429" in err or "rate" in err.lower():
            msg = "Rate limit reached. Try again in a moment."
        elif "timeout" in err.lower():
            msg = "Connection timed out. Check your endpoint URL."
        else:
            msg = f"Connection error: {err[:200]}"

        return TargetVerifyResponse(success=False, message=msg)
