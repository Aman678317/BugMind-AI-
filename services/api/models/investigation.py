import uuid
import enum
from datetime import datetime
from sqlalchemy import String, ForeignKey, Text, Enum, DateTime, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class InvestigationStatusEnum(str, enum.Enum):
    running = "running"
    completed = "completed"
    failed = "failed"

class InvestigationSession(Base):
    __tablename__ = "investigation_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    bug_description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[InvestigationStatusEnum] = mapped_column(Enum(InvestigationStatusEnum), default=InvestigationStatusEnum.running)
    root_cause_hypothesis: Mapped[str] = mapped_column(Text, nullable=True)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=True) # 0-100
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project")
    steps = relationship("InvestigationStep", back_populates="session", cascade="all, delete-orphan", order_by="InvestigationStep.created_at")

class InvestigationStep(Base):
    __tablename__ = "investigation_steps"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("investigation_sessions.id"), nullable=False)
    action_type: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. search, read_file, analyze
    details: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session = relationship("InvestigationSession", back_populates="steps")
