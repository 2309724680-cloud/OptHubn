import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.benchmark import BenchmarkRun, BenchmarkResult
from app.models.solution import InferenceSolution
from app.schemas.benchmark import IngestPayload, RunResponse, ResultResponse
from app.routers.benchmarks import _run_to_response

router = APIRouter(prefix="/api/v1/ingest", tags=["ingest"])

# 合法的设备端 API Key（生产环境应存数据库）
VALID_API_KEYS = {"npukey_dev_local"}


@router.post("/result", response_model=RunResponse, status_code=201)
async def ingest_result(body: IngestPayload, db: AsyncSession = Depends(get_db)):
    if body.api_key not in VALID_API_KEYS:
        raise HTTPException(401, "无效的 API Key")

    solution = await db.get(InferenceSolution, body.solution_id)
    if not solution:
        raise HTTPException(404, "方案不存在")

    # 自动创建 Run + Result 一次性写入
    run = BenchmarkRun(
        solution_id=body.solution_id,
        device_id=body.device_id,
        trigger="auto",
        status="completed",
        test_config=body.test_config.model_dump(),
        environment=body.environment.model_dump(),
        started_at=datetime.utcnow(),
        finished_at=datetime.utcnow(),
    )
    db.add(run)
    await db.flush()  # 获取 run.id

    result = BenchmarkResult(
        run_id=run.id,
        latency_p50_ms=body.result.latency_ms.p50,
        latency_p95_ms=body.result.latency_ms.p95,
        latency_p99_ms=body.result.latency_ms.p99,
        throughput=body.result.throughput,
        memory_peak_mb=body.result.memory_peak_mb,
        power_mw=body.result.power_mw,
        ttft_ms=body.result.ttft_ms,
        tps=body.result.tps,
        cv=body.result.cv,
        stability=body.result.stability,
        sample_count=body.result.sample_count,
        test_duration_s=body.result.test_duration_s,
        confidence=body.result.confidence,
        raw_sample_data=body.result.raw_sample_data,
        accuracy=body.result.accuracy,
        task_type=body.result.task_type,
        result_status=body.result.result_status,
        is_aggregated=body.result.is_aggregated,
    )
    db.add(result)
    await db.commit()

    # Reload run with result eagerly loaded for the response
    from sqlalchemy.orm import selectinload
    run = (
        await db.execute(
            select(BenchmarkRun)
            .where(BenchmarkRun.id == run.id)
            .options(selectinload(BenchmarkRun.result))
        )
    ).scalar()
    return _run_to_response(run)
