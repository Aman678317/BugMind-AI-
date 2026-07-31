from fastapi import APIRouter, Depends, HTTPException, status
import uuid
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..models.investigation import InvestigationStatusEnum
from ..services.investigation import InvestigationService

router = APIRouter(prefix="/projects/{project_id}/investigations", tags=["investigation"])

class InvestigationStartRequest(BaseModel):
    bug_description: str

class InvestigationStepPayload(BaseModel):
    action_type: str
    details: dict
    created_at: datetime

class InvestigationResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    bug_description: str
    status: InvestigationStatusEnum
    severity: Optional[str] = None
    problem_summary: Optional[str] = None
    root_cause_hypothesis: Optional[str] = None
    confidence_score: Optional[int] = None
    affected_files: List[str] = []
    alternative_hypotheses: List[dict] = []
    recommended_fix: Optional[str] = None
    evidence: List[dict] = []
    steps: List[InvestigationStepPayload] = []

@router.post("", response_model=InvestigationResponse)
async def start_investigation(project_id: uuid.UUID, req: InvestigationStartRequest):
    """
    Starts an autonomous bug investigation loop.
    In a real app, this would spawn a Celery task and return the running session immediately.
    For this demo, we'll await the mocked loop and return the completed session.
    """
    service = InvestigationService(str(project_id))
    session = await service.run_investigation(req.bug_description)
    
    steps = [
        InvestigationStepPayload(
            action_type=step.action_type,
            details=step.details,
            created_at=step.created_at or datetime.utcnow()
        ) for step in session.steps
    ]
    
    return InvestigationResponse(
        id=session.id,
        project_id=session.project_id,
        bug_description=session.bug_description,
        status=session.status,
        severity=getattr(session, 'severity', None),
        problem_summary=getattr(session, 'problem_summary', None),
        root_cause_hypothesis=session.root_cause_hypothesis,
        confidence_score=session.confidence_score,
        affected_files=getattr(session, 'affected_files', []),
        alternative_hypotheses=getattr(session, 'alternative_hypotheses', []),
        recommended_fix=getattr(session, 'recommended_fix', None),
        evidence=getattr(session, 'rich_evidence', []),
        steps=steps
    )

@router.get("/{investigation_id}", response_model=InvestigationResponse)
async def get_investigation(project_id: uuid.UUID, investigation_id: uuid.UUID):
    """Polls the status of an ongoing investigation."""
    # Stub: Normally query DB
    raise HTTPException(status_code=404, detail="Not implemented in stub")
