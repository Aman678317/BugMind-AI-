import logging
import asyncio
from typing import List, Dict, Any
from .investigation import InvestigationService

logger = logging.getLogger(__name__)

class AnomalyDetectorService:
    """
    Analyzes incoming eBPF timeseries data for statistical anomalies.
    If an anomaly is detected, it formats a synthetic bug report and 
    programmatically triggers the InvestigationService.
    """
    
    def __init__(self):
        # In a real implementation, we would maintain a rolling window of metrics in Redis.
        # For the prototype, we rely on the simulator sending a massive spike in a single payload.
        self.cpu_threshold = 95.0
        
    async def analyze_metrics(self, agent_id: str, host: str, metrics: List[Any]):
        """
        Scans a batch of metrics for threshold violations.
        """
        for metric in metrics:
            if metric.metric_name == "system.cpu.utilization":
                if metric.value >= self.cpu_threshold:
                    logger.warning(f"ANOMALY DETECTED: CPU at {metric.value}% on {host} (Agent: {agent_id})")
                    await self._trigger_investigation(metric, host)
                    # Trigger once per batch to avoid flooding
                    break

    async def _trigger_investigation(self, metric: Any, host: str):
        """
        Translates a raw metric anomaly into a synthetic bug report and triggers V2 investigation.
        """
        synthetic_report = (
            f"Automated Anomaly Alert: Sustained CPU spike detected on host {host}. "
            f"Metric {metric.metric_name} reached {metric.value:.2f}%. "
            f"Process labels: {metric.labels}. "
            f"Please investigate the root cause of this resource exhaustion."
        )
        
        logger.info(f"AnomalyDetector: Formatting synthetic bug report...")
        logger.info(f"AnomalyDetector: Triggering InvestigationService...")
        
        # Fire and forget the investigation so we don't block the ingestion queue
        asyncio.create_task(self._run_investigation(synthetic_report))
        
    async def _run_investigation(self, report: str):
        try:
            inv_service = InvestigationService()
            # For the prototype, we pass a dummy project ID
            result = await inv_service.start_investigation(
                project_id="demo-project",
                bug_report=report
            )
            logger.info(f"Investigation Auto-Triggered Successfully. ID: {result['id']}")
        except Exception as e:
            logger.error(f"Failed to auto-trigger investigation: {e}")
