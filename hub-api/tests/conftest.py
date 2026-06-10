import json
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.sqlite import base as sqlite_base

from app.database import Base, get_db
from main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# Tell SQLite how to render PostgreSQL-specific DDL types
sqlite_base.SQLiteTypeCompiler.visit_ARRAY = lambda self, type_, **kw: "TEXT"
sqlite_base.SQLiteTypeCompiler.visit_JSONB = lambda self, type_, **kw: "TEXT"
sqlite_base.SQLiteTypeCompiler.visit_UUID = lambda self, type_, **kw: "VARCHAR(32)"

# Patch ARRAY bind/result processors so lists are stored as JSON strings
_orig_array_bind = postgresql.ARRAY._resolve_for_literal
postgresql.ARRAY.bind_processor = lambda self, dialect: (
    (lambda value: json.dumps(value) if isinstance(value, list) else value)
    if dialect.name == "sqlite" else None
)
postgresql.ARRAY.result_processor = lambda self, dialect, coltype: (
    (lambda value: json.loads(value) if isinstance(value, str) else (value or []))
    if dialect.name == "sqlite"
    else postgresql.ARRAY.result_processor.__wrapped__(self, dialect, coltype)
    if hasattr(postgresql.ARRAY.result_processor, "__wrapped__")
    else None
)

# Simpler approach: patch SQLAlchemy's ARRAY to coerce values at bind time
_real_ARRAY_bind = postgresql.ARRAY.bind_expression.__func__ if hasattr(postgresql.ARRAY.bind_expression, '__func__') else None

# Use TypeDecorator wrapper instead of patching internals
from sqlalchemy.types import TypeDecorator, Text as SAText

class ArrayAsJSON(TypeDecorator):
    """Stores a Python list as a JSON string in SQLite; passes through for PostgreSQL."""
    impl = SAText
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(postgresql.ARRAY(postgresql.VARCHAR))
        return dialect.type_descriptor(SAText())

    def process_bind_param(self, value, dialect):
        if dialect.name == "postgresql":
            return value
        if value is None:
            return None
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        if dialect.name == "postgresql":
            return value
        if value is None:
            return []
        return json.loads(value) if isinstance(value, str) else value

# Monkey-patch ARRAY columns to use ArrayAsJSON for SQLite compatibility
from app.models import solution as solution_module
_tags_col = solution_module.InferenceSolution.__table__.c.get("tags")
if _tags_col is not None:
    _tags_col.type = ArrayAsJSON()

from app.models import comparison as comparison_module
_sids_col = comparison_module.Comparison.__table__.c.get("solution_ids")
if _sids_col is not None:
    _sids_col.type = ArrayAsJSON()
_mets_col = comparison_module.Comparison.__table__.c.get("metrics_selected")
if _mets_col is not None:
    _mets_col.type = ArrayAsJSON()

from app.models import device as device_module
_prec_col = device_module.Device.__table__.c.get("supported_precisions")
if _prec_col is not None:
    _prec_col.type = ArrayAsJSON()

from app.models import model_registry as model_reg_module
_mtags_col = model_reg_module.ModelRegistry.__table__.c.get("tags")
if _mtags_col is not None:
    _mtags_col.type = ArrayAsJSON()


@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False,
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    await engine.dispose()


@pytest.fixture(scope="function")
async def test_db(test_engine):
    TestSessionLocal = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
        for table in reversed(Base.metadata.sorted_tables):
            await session.execute(table.delete())
        await session.commit()


@pytest.fixture(scope="function")
async def client(test_db):
    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
