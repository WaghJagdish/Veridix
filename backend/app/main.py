from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_tables
from app.api import targets, scans, findings, reports, events, demo, copilot
from app.config import settings
import asyncio

app = FastAPI(title="VERIDIX API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    create_tables()

app.include_router(targets.router, prefix="/api")
app.include_router(scans.router, prefix="/api")
app.include_router(findings.router, prefix="/api")
app.include_router(findings.router_single, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(demo.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
