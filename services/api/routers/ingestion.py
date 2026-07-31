from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
import asyncio
from typing import Optional, Dict

router = APIRouter(prefix="/projects/{project_id}/ingestion-jobs", tags=["ingestion"])

class IngestionReport(BaseModel):
    files_scanned: int
    files_skipped: int
    skip_reasons: Dict[str, str]
    detected_stack: Dict[str, list]

class IngestionJobResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    status: str
    report: Optional[IngestionReport] = None

@router.get("/{job_id}", response_model=IngestionJobResponse)
async def get_ingestion_job_status(project_id: uuid.UUID, job_id: uuid.UUID):
    """
    Returns the current status of an ingestion job.
    In a real app, this queries the PostgreSQL database.
    We'll stub a progression based on time to simulate the Celery worker for UI testing.
    """
    # STUB LOGIC for frontend progress visualization
    # We will just return a completed state with a mock report
    from ..services.ingestion import IngestionService
    
    # Normally we'd fetch from DB. 
    # Here we mock the service run to get the payload:
    svc = IngestionService(str(job_id), "/tmp/mock")
    svc._simulate_scan()
    report = svc.generate_report()
    
    return IngestionJobResponse(
        id=job_id,
        project_id=project_id,
        status="analyzing", # We'll return analyzing as it's the final stage of Sprint 2 (Sprint 3 does analyzing)
        report=IngestionReport(**report)
    )
