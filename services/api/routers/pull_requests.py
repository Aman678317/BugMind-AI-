from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from ..services.git_integration import GitIntegrationService

router = APIRouter(prefix="/validation-runs/{run_id}/pull-request", tags=["pull_requests"])

class CreatePRRequest(BaseModel):
    diff: str
    context: Dict[str, Any]

class PullRequestResponse(BaseModel):
    pr_id: str
    url: str
    title: str
    description: str
    branch: str
    status: str

@router.post("", response_model=PullRequestResponse)
async def create_pull_request(run_id: str, payload: CreatePRRequest):
    """
    Takes a validated patch and creates a formal Pull Request.
    """
    git_service = GitIntegrationService()
    
    # In a real app, the `run_id` would be used to fetch the exact diff and context 
    # from the DB. Here we accept it via payload for mocking ease.
    result = await git_service.create_pull_request(
        validation_run_id=run_id,
        diff=payload.diff,
        context=payload.context
    )
    
    return PullRequestResponse(**result)

@router.get("/preview", response_model=Dict[str, str])
async def preview_pull_request(run_id: str):
    """
    Generates the PR context (title/description) for UI preview before actual creation.
    """
    git_service = GitIntegrationService()
    
    # Mocking the context fetch
    mock_context = {
        "problem": "Payment API failure",
        "validation_passed": True
    }
    
    pr_context = await git_service.generate_pr_context(mock_context)
    return pr_context
