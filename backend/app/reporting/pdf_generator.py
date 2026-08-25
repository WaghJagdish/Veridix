import os
from sqlalchemy.orm import Session
from app.models.db_models import Scan, Finding

def generate_pdf_report(scan: Scan, db: Session) -> str:
    html = f"<h1>VERIDIX Safety Report</h1><h2>Scan: {scan.name}</h2>"
    findings = db.query(Finding).filter(Finding.scan_id == scan.id).all()
    for f in findings:
        html += f"<h3>{f.title}</h3><p>{f.remediation}</p>"
        
    os.makedirs("reports", exist_ok=True)
    pdf_path = f"reports/{scan.id}.pdf"
    
    try:
        from weasyprint import HTML
        HTML(string=html).write_pdf(pdf_path)
    except Exception:
        # fallback
        with open(pdf_path.replace(".pdf", ".html"), "w") as f:
            f.write(html)
        pdf_path = pdf_path.replace(".pdf", ".html")
        
    return pdf_path
