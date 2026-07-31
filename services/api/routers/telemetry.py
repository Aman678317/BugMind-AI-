from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import uuid
from ..services.agents.runtime_agent import RuntimeAgent

router = APIRouter(prefix="/projects/{project_id}/telemetry", tags=["telemetry"])

class TelemetryErrorPayload(BaseModel):
    raw_trace: str
    environment: str = "production"
    timestamp: Optional[str] = None

class TelemetryResponse(BaseModel):
    status: str
    parsed_hints: dict

@router.post("/error", response_model=TelemetryResponse)
async def ingest_error(project_id: uuid.UUID, payload: TelemetryErrorPayload):
    """
    Webhook endpoint to receive raw stack traces from APM/Logging integrations.
    Passes the trace to the RuntimeAgent for parsing.
    """
    agent = RuntimeAgent()
    parsed_data = await agent.parse_trace(payload.raw_trace)
    
    # In a real app, this parsed data would trigger a new InvestigationSession
    # and kick off the autonomous loop.
    
    return TelemetryResponse(
        status="ingested",
        parsed_hints=parsed_data
    )
