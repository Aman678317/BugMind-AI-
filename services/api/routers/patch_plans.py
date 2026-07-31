from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import uuid

from ..services.agents.patch_planner import PatchPlannerAgent

router = APIRouter(prefix="/investigations/{investigation_id}/patch-plan", tags=["patch_plans"])

class PatchPlanResponse(BaseModel):
    id: str
    investigation_id: str
    plan_strategy: str
    target_files: List[str]
    status: str

class PatchPlanStatusUpdate(BaseModel):
    status: str # 'approved' or 'rejected'

@router.post("", response_model=PatchPlanResponse)
async def generate_patch_plan(investigation_id: str):
    """
    Triggers the PatchPlannerAgent to draft a plan based on an investigation.
    """
    planner = PatchPlannerAgent()
    
    # Mocking the root cause report input
    mock_root_cause = {
        "problem_summary": "Payment API fails intermittently under load.",
        "affected_files": ["src/payments/service.ts"]
    }
    
    plan_data = await planner.draft_plan(mock_root_cause)
    
    return PatchPlanResponse(
        id=str(uuid.uuid4()),
        investigation_id=investigation_id,
        plan_strategy=plan_data.get("plan_strategy", "Fallback strategy"),
        target_files=plan_data.get("target_files", []),
        status="pending_review"
    )

@router.get("", response_model=PatchPlanResponse)
async def get_patch_plan(investigation_id: str):
    """
    Retrieves the generated patch plan for review.
    """
    # Mocking a fetch
    return PatchPlanResponse(
        id=str(uuid.uuid4()),
        investigation_id=investigation_id,
        plan_strategy="### Step 1: Implement Retry Logic\nAdd a wrapper around the `processPayment` function in `src/payments/service.ts` to implement exponential backoff.\n\n### Step 2: Update Unit Tests\nUpdate `src/payments/retry.test.ts` to mock network failures and ensure the backoff is respected.",
        target_files=["src/payments/service.ts", "src/payments/retry.test.ts"],
        status="pending_review"
    )

@router.patch("/status", response_model=PatchPlanResponse)
async def update_patch_plan_status(investigation_id: str, update: PatchPlanStatusUpdate):
    """
    Updates the status of the plan. If approved, orchestrates the CodeGenAgent and Validation sandbox.
    """
    if update.status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    if update.status == "approved":
        from ..agents.code_gen import CodeGenAgent
        from ...validation import ValidationService
        import asyncio
        
        # 1. Generate the Code (Diff)
        codegen = CodeGenAgent()
        mock_plan_context = {"strategy": "Mock strategy"}
        mock_source = {"src/payments/service.ts": "mock code"}
        
        diff = await codegen.generate_patch(mock_plan_context, mock_source)
        
        # 2. Trigger Validation Sandbox (Fire and forget, or background task)
        # For the prototype, we'll kick it off in the background so the API returns quickly
        async def run_validation():
            validator = ValidationService()
            # Pass 'mock_fail' in the diff string to simulate the failure/retry loop if desired,
            # but since the prompt returns a mock diff with 'mock_fail' in it, it will trigger the regression.
            await validator.execute_validation("plan-1", diff, "typescript")
            
        asyncio.create_task(run_validation())
        
    return PatchPlanResponse(
        id=str(uuid.uuid4()),
        investigation_id=investigation_id,
        plan_strategy="### Step 1: Implement Retry Logic...",
        target_files=["src/payments/service.ts"],
        status=update.status
    )
