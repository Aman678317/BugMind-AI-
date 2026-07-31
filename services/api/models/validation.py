from sqlalchemy import Column, String, JSON, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from datetime import datetime
from .database import Base

class BuildStatusEnum(str, enum.Enum):
    pass_ = "pass"
    fail = "fail"

class ValidationResultEnum(str, enum.Enum):
    pass_ = "pass"
    fail = "fail"
    infra_error = "infra_error"

class ValidationRun(Base):
    __tablename__ = "validation_runs"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patch_plan_id = Column(PG_UUID(as_uuid=True), index=True, nullable=False) # FK in real db
    attempt_number = Column(Integer, default=1)
    build_status = Column(Enum(BuildStatusEnum), nullable=False)
    test_results = Column(JSON, default=dict)
    performance_delta = Column(JSON, default=dict)
    diff = Column(String, nullable=True)
    result = Column(Enum(ValidationResultEnum), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
