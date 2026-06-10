from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, model_validator


class ComparisonCreate(BaseModel):
    name: str
    description: str = ""
    solution_ids: list[uuid.UUID]
    baseline_id: uuid.UUID
    metrics_selected: list[str]
    run_snapshot: dict[str, uuid.UUID]
    notes: str = ""

    @field_validator("solution_ids")
    @classmethod
    def at_least_two(cls, v: list) -> list:
        assert 2 <= len(v) <= 8, "方案数量必须在 2-8 个之间"
        return v

    @model_validator(mode="after")
    def baseline_in_solutions(self) -> "ComparisonCreate":
        assert self.baseline_id in self.solution_ids, "baseline_id 必须在 solution_ids 中"
        return self


class ComparisonUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    metrics_selected: Optional[list[str]] = None
    notes: Optional[str] = None


class ShareConfig(BaseModel):
    expires_in_days: Optional[int] = None


class ComparisonResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    solution_ids: list[uuid.UUID]
    baseline_id: uuid.UUID
    metrics_selected: list[str]
    run_snapshot: dict
    notes: str
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
    shared: bool
    share_token: Optional[str]
    share_expires_at: Optional[datetime]

    model_config = {"from_attributes": True}


# 图表数据结构
class MetricValue(BaseModel):
    value: Optional[float]
    delta: Optional[float]
    delta_pct: Optional[float]
    is_better: Optional[bool]


class SolutionMetrics(BaseModel):
    solution_id: uuid.UUID
    solution_name: str
    run_id: uuid.UUID
    is_baseline: bool
    metrics: dict[str, MetricValue]


class ComparisonData(BaseModel):
    comparison_id: uuid.UUID
    metrics_selected: list[str]
    solutions: list[SolutionMetrics]
    radar: dict[str, list[float]]
    rankings: dict[str, list[uuid.UUID]]
