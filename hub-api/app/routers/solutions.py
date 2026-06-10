import uuid
import math
from typing import Optional, Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.dialects.postgresql import array

from app.database import get_db
from app.models.solution import InferenceSolution
from app.schemas.solution import (
    SolutionCreate, SolutionUpdate, SolutionResponse, SolutionListResponse
)

router = APIRouter(prefix="/api/v1/solutions", tags=["solutions"])

DEMO_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def _to_response(s: InferenceSolution) -> SolutionResponse:
    return SolutionResponse.model_validate(s)


@router.get("", response_model=SolutionListResponse)
async def list_solutions(
    status: Optional[str] = None,
    model_id: Optional[uuid.UUID] = None,
    device_id: Optional[uuid.UUID] = None,
    search: Optional[str] = None,
    sort_by: Literal["created_at", "updated_at", "name"] = "created_at",
    order: Literal["asc", "desc"] = "desc",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    q = select(InferenceSolution)

    if status:
        q = q.where(InferenceSolution.status == status)
    if model_id:
        q = q.where(InferenceSolution.model_id == model_id)
    if device_id:
        q = q.where(InferenceSolution.device_id == device_id)
    if search:
        q = q.where(or_(
            InferenceSolution.name.ilike(f"%{search}%"),
            InferenceSolution.description.ilike(f"%{search}%"),
        ))

    col = getattr(InferenceSolution, sort_by)
    q = q.order_by(col.asc() if order == "asc" else col.desc())

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    items = (await db.execute(q.offset((page - 1) * page_size).limit(page_size))).scalars().all()

    return SolutionListResponse(
        items=[_to_response(s) for s in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size),
    )


@router.post("", response_model=SolutionResponse, status_code=201)
async def create_solution(body: SolutionCreate, db: AsyncSession = Depends(get_db)):
    solution = InferenceSolution(
        name=body.name,
        description=body.description,
        model_id=body.model_id,
        device_id=body.device_id,
        precision=body.precision,
        visibility=body.visibility,
        project_id=body.project_id,
        conversion=body.conversion.model_dump(),
        runtime=body.runtime.model_dump(),
        input_config=body.input_config,
        tags=body.tags,
        created_by=DEMO_USER_ID,
    )
    db.add(solution)
    await db.commit()
    await db.refresh(solution)
    return _to_response(solution)


@router.get("/{solution_id}", response_model=SolutionResponse)
async def get_solution(solution_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")
    return _to_response(s)


@router.patch("/{solution_id}", response_model=SolutionResponse)
async def update_solution(solution_id: uuid.UUID, body: SolutionUpdate, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")
    if s.status == "archived":
        raise HTTPException(400, "已归档方案不可修改")

    for field, val in body.model_dump(exclude_none=True).items():
        if field in ("conversion", "runtime", "input_config"):
            setattr(s, field, val if isinstance(val, dict) else val.model_dump())
        else:
            setattr(s, field, val)

    await db.commit()
    await db.refresh(s)
    return _to_response(s)


@router.delete("/{solution_id}", status_code=204)
async def archive_solution(solution_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")
    s.status = "archived"
    await db.commit()


@router.post("/{solution_id}/publish", response_model=SolutionResponse)
async def publish_solution(solution_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")
    if s.status != "draft":
        raise HTTPException(400, f"只有 draft 状态可以发布，当前状态: {s.status}")
    s.status = "published"
    await db.commit()
    await db.refresh(s)
    return _to_response(s)


@router.post("/{solution_id}/clone", response_model=SolutionResponse, status_code=201)
async def clone_solution(solution_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    s = await db.get(InferenceSolution, solution_id)
    if not s:
        raise HTTPException(404, "方案不存在")
    clone = InferenceSolution(
        name=f"{s.name} (副本)",
        description=s.description,
        model_id=s.model_id,
        device_id=s.device_id,
        precision=s.precision,
        conversion=s.conversion,
        runtime=s.runtime,
        input_config=s.input_config,
        tags=s.tags,
        created_by=DEMO_USER_ID,
    )
    db.add(clone)
    await db.commit()
    await db.refresh(clone)
    return _to_response(clone)
