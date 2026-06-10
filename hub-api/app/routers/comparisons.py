import uuid
import math
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.comparison import Comparison
from app.models.benchmark import BenchmarkRun, BenchmarkResult
from app.models.solution import InferenceSolution
from app.schemas.comparison import (
    ComparisonCreate, ComparisonUpdate, ComparisonResponse,
    ShareConfig, ComparisonData, SolutionMetrics, MetricValue,
)

router = APIRouter(prefix="/api/v1", tags=["comparisons"])

DEMO_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")

# 指标字段映射：metric_key → BenchmarkResult 列名，以及"越小越好"标记
METRIC_MAP: dict[str, tuple[str, bool]] = {
    "latency_p50_ms":  ("latency_p50_ms",  True),   # 越小越好
    "latency_p95_ms":  ("latency_p95_ms",  True),
    "latency_p99_ms":  ("latency_p99_ms",  True),
    "throughput":      ("throughput",       False),  # 越大越好
    "memory_peak_mb":  ("memory_peak_mb",  True),
    "power_mw":        ("power_mw",        True),
    "ttft_ms":         ("ttft_ms",         True),
    "tps":             ("tps",             False),
}


def _nanoid() -> str:
    import secrets, string
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(21))


@router.post("/comparisons", response_model=ComparisonResponse, status_code=201)
async def create_comparison(body: ComparisonCreate, db: AsyncSession = Depends(get_db)):
    cmp = Comparison(
        name=body.name,
        description=body.description,
        solution_ids=[str(s) for s in body.solution_ids],
        baseline_id=body.baseline_id,
        metrics_selected=body.metrics_selected,
        run_snapshot={str(k): str(v) for k, v in body.run_snapshot.items()},
        notes=body.notes,
        created_by=DEMO_USER_ID,
    )
    db.add(cmp)
    await db.commit()
    await db.refresh(cmp)
    return ComparisonResponse.model_validate(cmp)


@router.get("/comparisons", response_model=list[ComparisonResponse])
async def list_comparisons(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(
        select(Comparison).order_by(Comparison.created_at.desc())
    )).scalars().all()
    return [ComparisonResponse.model_validate(r) for r in rows]


@router.get("/comparisons/{cmp_id}", response_model=ComparisonResponse)
async def get_comparison(cmp_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")
    return ComparisonResponse.model_validate(cmp)


@router.patch("/comparisons/{cmp_id}", response_model=ComparisonResponse)
async def update_comparison(cmp_id: uuid.UUID, body: ComparisonUpdate, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")
    for field, val in body.model_dump(exclude_none=True).items():
        setattr(cmp, field, val)
    await db.commit()
    await db.refresh(cmp)
    return ComparisonResponse.model_validate(cmp)


@router.delete("/comparisons/{cmp_id}", status_code=204)
async def delete_comparison(cmp_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")
    await db.delete(cmp)
    await db.commit()


@router.get("/comparisons/{cmp_id}/data", response_model=ComparisonData)
async def get_comparison_data(cmp_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")

    solution_metrics: list[SolutionMetrics] = []
    raw_values: dict[str, dict[str, Optional[float]]] = {}  # metric_key → {sol_id: value}

    for sol_id_str, run_id_str in cmp.run_snapshot.items():
        sol_id = uuid.UUID(sol_id_str)
        run_id = uuid.UUID(run_id_str)

        solution = await db.get(InferenceSolution, sol_id)
        run = (
            await db.execute(
                select(BenchmarkRun)
                .where(BenchmarkRun.id == run_id)
                .options(selectinload(BenchmarkRun.result))
            )
        ).scalar()
        result: Optional[BenchmarkResult] = run.result if run else None

        metrics: dict[str, MetricValue] = {}
        for metric_key in cmp.metrics_selected:
            col_name, lower_is_better = METRIC_MAP.get(metric_key, (metric_key, True))
            value = getattr(result, col_name, None) if result else None
            raw_values.setdefault(metric_key, {})[sol_id_str] = float(value) if value is not None else None
            metrics[metric_key] = MetricValue(value=value, delta=None, delta_pct=None, is_better=None)

        solution_metrics.append(SolutionMetrics(
            solution_id=sol_id,
            solution_name=solution.name if solution else sol_id_str,
            run_id=run_id,
            is_baseline=(sol_id == cmp.baseline_id),
            metrics=metrics,
        ))

    # 计算 delta / delta_pct / is_better（与 baseline 对比）
    baseline_id_str = str(cmp.baseline_id)
    for sm in solution_metrics:
        if sm.is_baseline:
            continue
        for metric_key in cmp.metrics_selected:
            _, lower_is_better = METRIC_MAP.get(metric_key, (metric_key, True))
            base_val = raw_values.get(metric_key, {}).get(baseline_id_str)
            cur_val = sm.metrics[metric_key].value
            if base_val is not None and cur_val is not None and base_val != 0:
                delta = cur_val - base_val
                delta_pct = round(delta / base_val * 100, 2)
                is_better = delta < 0 if lower_is_better else delta > 0
                sm.metrics[metric_key] = MetricValue(
                    value=cur_val, delta=round(delta, 3),
                    delta_pct=delta_pct, is_better=is_better,
                )

    # 雷达图数据（各指标归一化到 0-1）
    radar: dict[str, list[float]] = {}
    for metric_key in cmp.metrics_selected:
        _, lower_is_better = METRIC_MAP.get(metric_key, (metric_key, True))
        vals = [raw_values.get(metric_key, {}).get(str(sm.solution_id)) for sm in solution_metrics]
        valid = [v for v in vals if v is not None]
        if not valid:
            radar[metric_key] = [0.0] * len(solution_metrics)
            continue
        mn, mx = min(valid), max(valid)
        normalized = []
        for v in vals:
            if v is None:
                normalized.append(0.0)
            elif mx == mn:
                normalized.append(1.0)
            else:
                n = (v - mn) / (mx - mn)
                normalized.append(round(1 - n if lower_is_better else n, 4))
        radar[metric_key] = normalized

    # 排名
    rankings: dict[str, list[uuid.UUID]] = {}
    for metric_key in cmp.metrics_selected:
        _, lower_is_better = METRIC_MAP.get(metric_key, (metric_key, True))
        sorted_sols = sorted(
            solution_metrics,
            key=lambda sm: (
                sm.metrics[metric_key].value is None,
                sm.metrics[metric_key].value if lower_is_better
                else -(sm.metrics[metric_key].value or 0)
            )
        )
        rankings[metric_key] = [sm.solution_id for sm in sorted_sols]

    return ComparisonData(
        comparison_id=cmp.id,
        metrics_selected=cmp.metrics_selected,
        solutions=solution_metrics,
        radar=radar,
        rankings=rankings,
    )


@router.post("/comparisons/{cmp_id}/share", response_model=ComparisonResponse)
async def share_comparison(cmp_id: uuid.UUID, body: ShareConfig, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")
    cmp.shared = True
    cmp.share_token = _nanoid()
    cmp.share_expires_at = (
        datetime.utcnow() + timedelta(days=body.expires_in_days)
        if body.expires_in_days else None
    )
    await db.commit()
    await db.refresh(cmp)
    return ComparisonResponse.model_validate(cmp)


@router.delete("/comparisons/{cmp_id}/share", response_model=ComparisonResponse)
async def unshare_comparison(cmp_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cmp = await db.get(Comparison, cmp_id)
    if not cmp:
        raise HTTPException(404, "对比不存在")
    cmp.shared = False
    cmp.share_token = None
    cmp.share_expires_at = None
    await db.commit()
    await db.refresh(cmp)
    return ComparisonResponse.model_validate(cmp)


@router.get("/share/{share_token}", response_model=ComparisonData)
async def public_share(share_token: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(
        select(Comparison).where(
            Comparison.share_token == share_token,
            Comparison.shared == True,
        )
    )).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "分享链接无效或已关闭")
    if row.share_expires_at and row.share_expires_at < datetime.utcnow():
        raise HTTPException(410, "分享链接已过期")
    return await get_comparison_data(row.id, db)
