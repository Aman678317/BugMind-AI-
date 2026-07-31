import uuid
from datetime import datetime
from sqlalchemy import String, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import enum

class RepoConnectionType(str, enum.Enum):
    oauth_github = "oauth_github"
    oauth_gitlab = "oauth_gitlab"
    oauth_bitbucket = "oauth_bitbucket"
    oauth_azure_devops = "oauth_azure_devops"
    zip_upload = "zip_upload"
    local_sync = "local_sync"

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    org_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("organizations.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    default_branch: Mapped[str] = mapped_column(String(255), default="main")
    repo_connection_type: Mapped[RepoConnectionType] = mapped_column(Enum(RepoConnectionType), nullable=False)
    repo_url: Mapped[str] = mapped_column(String(1024), nullable=True)
    webhook_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    organization = relationship("Organization", back_populates="projects")
