import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, Numeric, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base, ArrayAsJSON


class Device(Base):
    __tablename__ = "device_registry"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chip_name: Mapped[str] = mapped_column(String(100), nullable=False)
    device_name: Mapped[str] = mapped_column(String(200), nullable=False)
    npu_tflops: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    supported_precisions: Mapped[list] = mapped_column(ArrayAsJSON(), default=list, nullable=False)
    agent_endpoint: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("online", "offline", "unhealthy", "maintenance", name="device_status"),
        default="offline", nullable=False
    )
    vendor: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cluster_group: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
