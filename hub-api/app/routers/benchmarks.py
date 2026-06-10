import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.benchmark import BenchmarkRun, BenchmarkResult
from app.models.solution import InferenceSolution
from app.schemas.benchmark import RunCreate, ResultSubmit, RunResponse, ResultResponse

router = APIRouter(tags=["benchmarks"])

DEMO_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def _run_to_response(run: BenchmarkRun) -> RunResponse:
    result = None
    try:
        result = ResultResponse.model_validate(run.result) if run.result else None
    except Exception:
        pass
    return RunResponse(
        id=run.id,
        solution_id=run.solution_id,
        device_id=run.device_id,
        project_id=run.project_id,
        status=run.status,
        trigger=run.trigger,
        priority=run.priority,
        test_config=run.test_config,
        environment=run.environment,
        timeout_minutes=run.timeout_minutes,
        error_message=run.error_message,
        started_at=run.started_at,
        finished_at=run.finished_at,
        created_at=run.created_at,
        updated_at=run.updated_at,
        result=result,
    )


@router.post("/api/v1/solutions/{solution_id}/runs", response_model=RunResponse, status_code=201)
async def create_run(solution_id: uuid.UUID, body: RunCreate, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")

    run = BenchmarkRun(
        solution_id=solution_id,
        device_id=body.device_id,
        trigger=body.trigger,
        priority=body.priority,
        test_config=body.test_config.model_dump(),
        environment=body.environment.model_dump(),
        timeout_minutes=body.timeout_minutes,
        created_by=DEMO_USER_ID,
    )
    db.add(run)
    await db.commit()
    return _run_to_response(run)


@router.get("/api/v1/solutions/{solution_id}/runs", response_model=list[RunResponse])
async def list_runs(solution_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(
        select(BenchmarkRun)
        .where(BenchmarkRun.solution_id == solution_id)
        .options(selectinload(BenchmarkRun.result))
        .order_by(BenchmarkRun.created_at.desc())
    )).scalars().all()
    return [_run_to_response(r) for r in rows]


@router.get("/api/v1/runs/{run_id}", response_model=RunResponse)
async def get_run(run_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    run = (
        await db.execute(
            select(BenchmarkRun)
            .where(BenchmarkRun.id == run_id)
            .options(selectinload(BenchmarkRun.result))
        )
    ).scalar()
    if not run:
        raise HTTPException(404, "测试任务不存在")
    return _run_to_response(run)


@router.post("/api/v1/runs/{run_id}/result", response_model=ResultResponse, status_code=201)
async def submit_result(run_id: uuid.UUID, body: ResultSubmit, db: AsyncSession = Depends(get_db)):
    run = (
        await db.execute(
            select(BenchmarkRun)
            .where(BenchmarkRun.id == run_id)
            .options(selectinload(BenchmarkRun.result))
        )
    ).scalar()
    if not run:
        raise HTTPException(404, "测试任务不存在")
    if run.result:
        raise HTTPException(409, "该任务已有结果，请勿重复提交")

    result = BenchmarkResult(
        run_id=run_id,
        latency_p50_ms=body.latency_ms.p50,
        latency_p95_ms=body.latency_ms.p95,
        latency_p99_ms=body.latency_ms.p99,
        throughput=body.throughput,
        memory_peak_mb=body.memory_peak_mb,
        power_mw=body.power_mw,
        ttft_ms=body.ttft_ms,
        tps=body.tps,
        cv=body.cv,
        stability=body.stability,
        sample_count=body.sample_count,
        test_duration_s=body.test_duration_s,
        confidence=body.confidence,
        raw_sample_data=body.raw_sample_data,
        accuracy=body.accuracy,
        task_type=body.task_type,
        result_status=body.result_status,
        is_aggregated=body.is_aggregated,
    )
    run.status = "completed"
    run.finished_at = datetime.now(timezone.utc)

    db.add(result)
    await db.commit()
    await db.refresh(result)
    return ResultResponse.model_validate(result)


@router.patch("/api/v1/runs/{run_id}/status", response_model=RunResponse)
async def update_run_status(
    run_id: uuid.UUID,
    status: str,
    error_message: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    run = (
        await db.execute(
            select(BenchmarkRun)
            .where(BenchmarkRun.id == run_id)
            .options(selectinload(BenchmarkRun.result))
        )
    ).scalar()
    if not run:
        raise HTTPException(404, "测试任务不存在")
    valid = {"pending", "running", "completed", "failed"}
    if status not in valid:
        raise HTTPException(400, f"无效状态，可选: {valid}")

    run.status = status
    if status == "running":
        run.started_at = datetime.now(timezone.utc)
    if status == "failed":
        run.finished_at = datetime.now(timezone.utc)
        run.error_message = error_message
    await db.commit()
    return _run_to_response(run)
