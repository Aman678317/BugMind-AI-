import uuid
from datetime import datetime
from sqlalchemy import String, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base
import enum

class DataBoundaryEnum(str, enum.Enum):
    hosted = "hosted"
    self_hosted = "self_hosted"

class PlanTierEnum(str, enum.Enum):
    starter = "starter"
    team = "team"
    enterprise = "enterprise"

class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    data_boundary: Mapped[DataBoundaryEnum] = mapped_column(Enum(DataBoundaryEnum), default=DataBoundaryEnum.hosted)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    plan_tier: Mapped[PlanTierEnum] = mapped_column(Enum(PlanTierEnum), default=PlanTierEnum.starter)

    users = relationship("User", back_populates="organization")
    projects = relationship("Project", back_populates="organization")
