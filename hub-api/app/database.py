import json
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.sqlite import base as sqlite_base
from sqlalchemy.types import TypeDecorator, Text as SAText

from app.config import settings

# SQLite 兼容：把 PostgreSQL 特有类型映射为 TEXT/JSON
sqlite_base.SQLiteTypeCompiler.visit_ARRAY = lambda self, type_, **kw: "TEXT"
sqlite_base.SQLiteTypeCompiler.visit_JSONB = lambda self, type_, **kw: "TEXT"
sqlite_base.SQLiteTypeCompiler.visit_UUID = lambda self, type_, **kw: "VARCHAR(32)"

_connect_args = {}
if settings.database_url.startswith("sqlite"):
    _connect_args = {"check_same_thread": False}

engine = create_async_engine(
    settings.database_url,
    echo=False,
    connect_args=_connect_args,
)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


# ——— SQLite ARRAY 兼容 ———

class ArrayAsJSON(TypeDecorator):
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
