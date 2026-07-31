import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from .base import Base

class CodeEmbedding(Base):
    __tablename__ = "code_embeddings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id"), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    symbol_name: Mapped[str] = mapped_column(String(255), nullable=False)
    symbol_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. function, class
    cir_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    embedding = mapped_column(Vector(768)) # 768 dimensions for Gemini/standard LLMs

    project = relationship("Project")
