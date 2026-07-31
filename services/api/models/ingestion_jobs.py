import uuid
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from .base import Base
import enum

class IngestionStatus(str, enum.Enum):
    queued = "queued"
    extracting = "extracting"
    detecting_stack = "detecting_stack"
    analyzing = "analyzing"
    building_graph = "building_graph"
    completed = "completed"
    failed = "failed"

class IngestionJob(Base):
    __tablename__ = "ingestion_jobs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    status: Mapped[IngestionStatus] = mapped_column(Enum(IngestionStatus), default=IngestionStatus.queued)
    detected_stack: Mapped[dict] = mapped_column(JSONB, nullable=True)
    files_scanned: Mapped[int] = mapped_column(Integer, default=0)
    files_skipped: Mapped[int] = mapped_column(Integer, default=0)
    skip_reasons: Mapped[dict] = mapped_column(JSONB, nullable=True)
    cir_hash: Mapped[str] = mapped_column(String(255), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    project = relationship("Project", backref="ingestion_jobs")
