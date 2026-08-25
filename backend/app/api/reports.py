from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import Scan, Report
from app.reporting.pdf_generator import generate_pdf_report
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/scans/{scan_id}")
def create_report(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan: raise HTTPException(404, "Not found")
    
    pdf_path = generate_pdf_report(scan, db)
    report = Report(scan_id=scan.id, pdf_path=pdf_path, html_content="")
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"id": report.id, "pdf_path": pdf_path}

@router.get("/{id}/download")
def download_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report or not os.path.exists(report.pdf_path):
        raise HTTPException(404, "Report not found")
    return FileResponse(report.pdf_path, filename=f"VERIDIX_Report_{id}.pdf")
