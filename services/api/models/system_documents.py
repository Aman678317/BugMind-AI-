import uuid
import enum
from datetime import datetime
from sqlalchemy import String, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class DocTypeEnum(str, enum.Enum):
    summary = "summary"
    structure = "structure"
    architecture = "architecture"

class DocStatusEnum(str, enum.Enum):
    draft = "draft"
    published = "published"
    outdated = "outdated"

class SystemDocument(Base):
    __tablename__ = "system_documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    doc_type: Mapped[DocTypeEnum] = mapped_column(Enum(DocTypeEnum), nullable=False)
    status: Mapped[DocStatusEnum] = mapped_column(Enum(DocStatusEnum), default=DocStatusEnum.draft)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project")
