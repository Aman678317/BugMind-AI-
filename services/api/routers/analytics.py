from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["analytics"])

class KPIOverview(BaseModel):
    total_bugs_caught: int
    autonomous_fix_rate: float
    mttr_hours: float
    mttr_reduction_pct: float

class TimeseriesDataPoint(BaseModel):
    date: str
    detected: int
    resolved: int

class AnalyticsDashboardResponse(BaseModel):
    kpis: KPIOverview
    timeseries: List[TimeseriesDataPoint]
    recent_activity: List[Dict[str, Any]]

@router.get("/overview", response_model=AnalyticsDashboardResponse)
async def get_dashboard_overview():
    """
    Returns aggregated mock data to power the Executive Dashboard.
    In production, this would query the DB to aggregate across all projects.
    """
    
    # Generate 30 days of mock timeseries data
    timeseries = []
    base_date = datetime.utcnow() - timedelta(days=30)
    
    for i in range(30):
        current_date = base_date + timedelta(days=i)
        # Mock some variance
        detected = 10 + (i % 5) * 3
        resolved = int(detected * 0.85) # 85% fix rate
        
        timeseries.append(
            TimeseriesDataPoint(
                date=current_date.strftime("%Y-%m-%d"),
                detected=detected,
                resolved=resolved
            )
        )
        
    mock_activity = [
        {
            "id": "1",
            "type": "pr_merged",
            "project": "api-gateway",
            "description": "Merged fix for intermittent payment failures",
            "timestamp": "2 hours ago"
        },
        {
            "id": "2",
            "type": "investigation_started",
            "project": "frontend-web",
            "description": "Started investigation: Layout shift on mobile checkout",
            "timestamp": "5 hours ago"
        },
        {
            "id": "3",
            "type": "bug_detected",
            "project": "auth-service",
            "description": "Spike in 401 Unauthorized errors detected",
            "timestamp": "1 day ago"
        }
    ]
        
    return AnalyticsDashboardResponse(
        kpis=KPIOverview(
            total_bugs_caught=1248,
            autonomous_fix_rate=87.5,
            mttr_hours=1.2,
            mttr_reduction_pct=94.0 # "Reduced from 20 hours to 1.2 hours"
        ),
        timeseries=timeseries,
        recent_activity=mock_activity
    )
