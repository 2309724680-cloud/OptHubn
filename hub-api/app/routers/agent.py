import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.device import Device
from app.models.benchmark import BenchmarkRun
from app.models.solution import InferenceSolution

router = APIRouter(prefix="/api/v1", tags=["agent"])


@router.post("/devices", status_code=201)
async def register_device(body: dict, db: AsyncSession = Depends(get_db)):
    device_id = body.get("device_id")
    hostname = body.get("hostname", "")
    agent_version = body.get("agent_version", "0.1.0")

    if not device_id:
        raise HTTPException(400, "device_id 不能为空")

    existing = await db.get(Device, uuid.UUID(device_id))
    if existing:
        existing.device_name = hostname or existing.device_name
        existing.agent_endpoint = body.get("agent_endpoint", existing.agent_endpoint)
        existing.status = "online"
        existing.updated_at = datetime.now(timezone.utc)
        await db.commit()
        return {"device_id": str(existing.id), "status": existing.status}

    device = Device(
        id=uuid.UUID(device_id),
        chip_name=body.get("chip_name", ""),
        device_name=hostname,
        agent_endpoint=body.get("agent_endpoint"),
        status="online",
    )
    db.add(device)
    await db.commit()
    return {"device_id": str(device.id), "status": device.status}


@router.post("/agent/heartbeat")
async def agent_heartbeat(body: dict, db: AsyncSession = Depends(get_db)):
    device_id = body.get("device_id")
    status = body.get("status", "online")

    device = await db.get(Device, uuid.UUID(device_id))
    if not device:
        raise HTTPException(404, "设备未注册")

    device.status = status
    device.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}


@router.get("/agent/tasks/next")
async def poll_next_task(device_id: str, db: AsyncSession = Depends(get_db)):
    device = await db.get(Device, uuid.UUID(device_id))
    if not device:
        raise HTTPException(404, "设备未注册")

    row = (
        await db.execute(
            select(BenchmarkRun)
            .where(BenchmarkRun.device_id == uuid.UUID(device_id))
            .where(BenchmarkRun.status == "pending")
            .order_by(BenchmarkRun.created_at.asc())
            .limit(1)
        )
    ).scalar()

    if not row:
        raise HTTPException(404, "无待执行任务")

    solution = await db.get(InferenceSolution, row.solution_id)
    if not solution:
        raise HTTPException(404, "关联方案不存在")

    return {
        "run_id": str(row.id),
        "solution_id": str(row.solution_id),
        "model_path": solution.conversion.get("model_path", ""),
        "precision": solution.conversion.get("precision", "fp16"),
        "inputs": solution.runtime.get("inputs", {}),
        "test_config": row.test_config,
    }
