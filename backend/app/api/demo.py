from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.demo.demo_dataset import seed_demo_data

router = APIRouter(prefix="/demo", tags=["Demo"])

@router.post("/seed")
def seed_demo(db: Session = Depends(get_db)):
    seed_demo_data(db)
    return {"status": "success", "message": "Demo data seeded"}
