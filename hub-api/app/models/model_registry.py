import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base, ArrayAsJSON


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_name: Mapped[str] = mapped_column(String(200), nullable=False)
    model_version: Mapped[str] = mapped_column(String(20), default="1.0.0", nullable=False)
    task_type: Mapped[str] = mapped_column(
        Enum("classification", "detection", "llm", "asr", "segmentation", name="model_task_type"),
        nullable=False
    )
    framework: Mapped[str | None] = mapped_column(String(64), nullable=True)
    tags: Mapped[list] = mapped_column(ArrayAsJSON(), default=list, nullable=False)
    original_file_path: Mapped[str] = mapped_column(Text, nullable=False)
    input_spec: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
