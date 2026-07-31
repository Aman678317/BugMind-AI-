from fastapi import APIRouter, BackgroundTasks, status
from pydantic import BaseModel
from typing import List, Any
import logging

router = APIRouter(prefix="/ebpf", tags=["ebpf_telemetry"])
logger = logging.getLogger(__name__)

class EBPFMetricPoint(BaseModel):
    timestamp: int
    metric_name: str
    value: float
    labels: dict[str, str]

class EBPFPayload(BaseModel):
    agent_id: str
    host: str
    metrics: List[EBPFMetricPoint]

def process_metrics_background(payload: EBPFPayload):
    """
    Simulates processing metrics in the background (e.g. pushing to Kafka/Redis timeseries).
    This keeps the main FastAPI thread unblocked.
    """
    # TODO (Production): Instead of simple logging, batch these metrics and insert them 
    # into a high-performance timeseries DB like TimescaleDB or pump them into a Kafka topic.
    logger.info(f"Background Task: Ingested {len(payload.metrics)} metrics from {payload.agent_id} on {payload.host}")
    
    # Just printing the first metric to show it works
    if payload.metrics:
        first = payload.metrics[0]
        logger.info(f"Sample Metric -> {first.metric_name}: {first.value} (Labels: {first.labels})")

    # Feed the Anomaly Detector
    from ..services.anomaly_detector import AnomalyDetectorService
    import asyncio
    
    detector = AnomalyDetectorService()
    # We create a task since analyze_metrics is async, but we're in a synchronous background function context.
    # FastAPI's background tasks run in a threadpool if synchronous, so we need to run the async function using asyncio.run
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(detector.analyze_metrics(payload.agent_id, payload.host, payload.metrics))
    except RuntimeError:
        asyncio.run(detector.analyze_metrics(payload.agent_id, payload.host, payload.metrics))

@router.post("/stream", status_code=status.HTTP_202_ACCEPTED)
async def ingest_ebpf_stream(payload: EBPFPayload, background_tasks: BackgroundTasks):
    """
    High-throughput endpoint for receiving raw eBPF telemetry.
    Returns 202 Accepted immediately and delegates processing to a background task.
    """
    background_tasks.add_task(process_metrics_background, payload)
    return {"status": "accepted", "queued_metrics": len(payload.metrics)}
