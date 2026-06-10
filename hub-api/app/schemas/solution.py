from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, field_validator


class ConversionConfig(BaseModel):
    quantization: Literal["fp32", "fp16", "int8", "int4", "mixed"] = "fp16"
    target_framework: str = ""
    model_path: str = ""
    compiler_flags: dict[str, str] = {}
    calibration_dataset: Optional[str] = None
    custom_ops: list[str] = []


class RuntimeConfig(BaseModel):
    batch_size: int = 1
    sequence_length: Optional[int] = None
    num_threads: int = 4
    power_mode: Literal["performance", "balanced", "efficiency"] = "balanced"
    memory_limit_mb: Optional[int] = None
    inputs: dict = {}


class SolutionCreate(BaseModel):
    name: str
    description: str = ""
    model_id: uuid.UUID
    device_id: uuid.UUID
    precision: Literal["fp16", "fp32", "int8", "int4"] = "fp16"
    visibility: Literal["private", "team", "public"] = "private"
    project_id: Optional[uuid.UUID] = None
    conversion: ConversionConfig
    runtime: RuntimeConfig
    input_config: dict = {}
    tags: list[str] = []


class SolutionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    precision: Optional[Literal["fp16", "fp32", "int8", "int4"]] = None
    visibility: Optional[Literal["private", "team", "public"]] = None
    project_id: Optional[uuid.UUID] = None
    conversion: Optional[ConversionConfig] = None
    runtime: Optional[RuntimeConfig] = None
    input_config: Optional[dict] = None
    tags: Optional[list[str]] = None


class SolutionResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    status: str
    version: str
    model_id: uuid.UUID
    device_id: uuid.UUID
    precision: str
    visibility: str
    project_id: Optional[uuid.UUID]
    conversion: dict
    runtime: dict
    input_config: dict
    tags: list[str]
    archive_reason: Optional[str]
    ref_count: int
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SolutionListResponse(BaseModel):
    items: list[SolutionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
