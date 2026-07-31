from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import Optional
import uuid
from ..models.projects import RepoConnectionType

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    org_id: uuid.UUID
    repo_connection_type: RepoConnectionType
    repo_url: Optional[str] = None
    default_branch: str = "main"

class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    status: str

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate):
    """
    Creates a new project record.
    In a real implementation, this would save to the DB using SQLAlchemy.
    """
    # Stub: return a fake created project
    project_id = uuid.uuid4()
    return ProjectResponse(
        id=project_id,
        name=project.name,
        status="created"
    )

@router.post("/{project_id}/connect")
async def connect_project(project_id: uuid.UUID):
    """
    Initiates the repository connection (e.g., OAuth handshake or starting a ZIP ingestion).
    Creates an ingestion_job with status='queued'.
    """
    # Stub: we simulate the successful connection and returning an ingestion job ID
    job_id = uuid.uuid4()
    return {
        "project_id": project_id,
        "message": "Repository connection initiated. Ingestion queued.",
        "ingestion_job_id": job_id,
        "status": "queued"
    }
