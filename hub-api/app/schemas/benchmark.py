from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel


class TestConfig(BaseModel):
    dataset: str
    num_samples: int = 100
    warm_up_rounds: int = 10
    test_rounds: int = 100


class EnvironmentInfo(BaseModel):
    os_version: str = ""
    driver_version: str = ""
    temperature_celsius: Optional[float] = None
    battery_level: Optional[int] = None


class RunCreate(BaseModel):
    device_id: uuid.UUID
    trigger: Literal["manual", "auto"] = "manual"
    test_config: TestConfig
    environment: EnvironmentInfo = EnvironmentInfo()
    timeout_minutes: int = 30
    priority: int = 0


class LatencyMetrics(BaseModel):
    p50: float
    p95: float
    p99: float


class ResultSubmit(BaseModel):
    latency_ms: LatencyMetrics
    throughput: Optional[float] = None
    memory_peak_mb: Optional[float] = None
    power_mw: Optional[float] = None
    ttft_ms: Optional[float] = None
    tps: Optional[float] = None
    accuracy: dict[str, float] = {}
    cv: Optional[float] = None
    stability: Literal["normal", "unstable"] = "normal"
    sample_count: Optional[int] = None
    test_duration_s: Optional[float] = None
    confidence: Optional[float] = None
    raw_sample_data: Optional[dict] = None
    task_type: Optional[str] = None
    result_status: Literal["valid", "anomaly", "dirty"] = "valid"
    is_aggregated: bool = False


class IngestPayload(BaseModel):
    api_key: str
    solution_id: uuid.UUID
    device_id: uuid.UUID
    test_config: TestConfig
    environment: EnvironmentInfo
    result: ResultSubmit


class RunResponse(BaseModel):
    id: uuid.UUID
    solution_id: uuid.UUID
    device_id: uuid.UUID
    project_id: Optional[uuid.UUID]
    status: str
    trigger: str
    priority: int
    test_config: dict
    environment: dict
    timeout_minutes: int
    error_message: Optional[str]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    result: Optional["ResultResponse"] = None

    model_config = {"from_attributes": True}


class ResultResponse(BaseModel):
    id: uuid.UUID
    run_id: uuid.UUID
    latency_p50_ms: Optional[float]
    latency_p95_ms: Optional[float]
    latency_p99_ms: Optional[float]
    throughput: Optional[float]
    memory_peak_mb: Optional[float]
    power_mw: Optional[float]
    ttft_ms: Optional[float]
    tps: Optional[float]
    cv: Optional[float]
    stability: str
    sample_count: Optional[int]
    test_duration_s: Optional[float]
    confidence: Optional[float]
    raw_sample_data: Optional[dict]
    accuracy: dict
    task_type: Optional[str]
    result_status: str
    is_aggregated: bool
    created_at: datetime

    model_config = {"from_attributes": True}
