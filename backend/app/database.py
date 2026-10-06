from collections.abc import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from backend.app.config import get_settings


class Base(DeclarativeBase):
    pass


def _create_engine(database_url: str):
    connect_args = (
        {"check_same_thread": False} if database_url.startswith("sqlite") else {}
    )
    database_engine = create_engine(
        database_url, connect_args=connect_args, pool_pre_ping=True
    )
    if database_url.startswith("sqlite"):

        @event.listens_for(database_engine, "connect")
        def enable_foreign_keys(connection, _record):
            cursor = connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    return database_engine


engine = _create_engine(get_settings().database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
