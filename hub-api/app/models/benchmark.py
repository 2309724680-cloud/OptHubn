import uuid
from datetime import datetime
from sqlalchemy import String, Text, DateTime, Enum, ForeignKey, Numeric, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.database import Base


class BenchmarkRun(Base):
    __tablename__ = "benchmark_runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    solution_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("inference_solutions.id"), nullable=False)
    device_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    project_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)

    status: Mapped[str] = mapped_column(
        Enum("pending", "running", "completed", "failed", name="run_status"),
        default="pending", nullable=False
    )
    trigger: Mapped[str] = mapped_column(
        Enum("manual", "auto", "scheduled", name="run_trigger"),
        default="manual", nullable=False
    )
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    test_config: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    environment: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    timeout_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_retries: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    cluster_node_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    solution: Mapped["InferenceSolution"] = relationship(back_populates="benchmark_runs", lazy="raise")
    result: Mapped["BenchmarkResult | None"] = relationship(back_populates="run", uselist=False, cascade="all, delete-orphan", lazy="raise")


class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("benchmark_runs.id", ondelete="CASCADE"), nullable=False)

    # 延迟
    latency_p50_ms: Mapped[float | None] = mapped_column(Numeric(10, 3), nullable=True)
    latency_p95_ms: Mapped[float | None] = mapped_column(Numeric(10, 3), nullable=True)
    latency_p99_ms: Mapped[float | None] = mapped_column(Numeric(10, 3), nullable=True)

    # 通用指标
    throughput: Mapped[float | None] = mapped_column(Numeric(12, 3), nullable=True)
    memory_peak_mb: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    power_mw: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)

    # LLM 专项
    ttft_ms: Mapped[float | None] = mapped_column(Numeric(10, 3), nullable=True)
    tps: Mapped[float | None] = mapped_column(Numeric(10, 3), nullable=True)

    # 稳定性
    cv: Mapped[float | None] = mapped_column(Numeric(8, 4), nullable=True)
    stability: Mapped[str] = mapped_column(
        Enum("normal", "unstable", name="data_stability"),
        default="normal", nullable=False
    )
    sample_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    test_duration_s: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    confidence: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)
    raw_sample_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # 精度（灵活 KV）
    accuracy: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    raw_log_path: Mapped[str | None] = mapped_column(Text, nullable=True)

    # 聚合标记
    task_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    result_status: Mapped[str] = mapped_column(String(16), default="valid", nullable=False)
    is_aggregated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    run: Mapped["BenchmarkRun"] = relationship(back_populates="result")


# 避免循环导入
from app.models.solution import InferenceSolution  # noqa: E402, F401
