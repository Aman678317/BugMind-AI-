from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid
from ..services.validation import ValidationService

router = APIRouter(prefix="/patch-plans/{plan_id}/validation-runs", tags=["validation"])

class ValidationRunResponse(BaseModel):
    id: str
    patch_plan_id: str
    attempt_number: int
    build_status: str
    test_results: Dict[str, Any]
    performance_delta: Dict[str, Any]
    result: str
    build_log: str

@router.get("", response_model=List[ValidationRunResponse])
async def list_validation_runs(plan_id: str):
    """
    Mock endpoint to fetch validation runs for a specific patch plan.
    """
    # For now, just generate a mocked failing run to simulate a regression
    service = ValidationService()
    mock_result = await service.execute_validation(plan_id, "mock_fail_diff", "typescript", attempt_number=1)
    return [ValidationRunResponse(**mock_result)]

@router.post("/{run_id}/retry", response_model=ValidationRunResponse)
async def retry_validation(plan_id: str, run_id: str):
    """
    Endpoint to manually trigger a re-run of a failed validation sandbox.
    """
    service = ValidationService()
    # Simulate the second attempt passing because the AI revised the code (diff without 'mock_fail')
    mock_result = await service.execute_validation(plan_id, "mock_success_diff", "typescript", attempt_number=2)
    return ValidationRunResponse(**mock_result)
