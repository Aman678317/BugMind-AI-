from sqlalchemy import Column, String, JSON, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid
import enum
from datetime import datetime
from .database import Base

class PatchPlanStatusEnum(str, enum.Enum):
    pending_review = "pending_review"
    approved = "approved"
    rejected = "rejected"

class PatchPlan(Base):
    __tablename__ = "patch_plans"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    investigation_id = Column(PG_UUID(as_uuid=True), index=True, nullable=False) # Ties back to Root Cause Report
    plan_strategy = Column(String, nullable=False)
    target_files = Column(JSON, default=list)
    status = Column(Enum(PatchPlanStatusEnum), default=PatchPlanStatusEnum.pending_review)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
