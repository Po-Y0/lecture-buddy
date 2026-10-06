from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    database_url: str = (
        "postgresql+psycopg://lecture_buddy:lecture_buddy@localhost:5432/lecture_buddy"
    )
    session_cookie_name: str = "lecture_buddy_session"
    session_cookie_secure: bool = False
    session_idle_timeout_seconds: int = Field(default=30 * 60, ge=60)
    upload_dir: str = "./data/uploads"
    max_upload_bytes: int = Field(default=20 * 1024 * 1024, gt=0)
    web_origin: str = "http://localhost:5173"
    openai_api_key: str | None = None
    openai_base_url: str | None = None
    openai_model: str = "gpt-4o-mini"
    ai_timeout_seconds: float = Field(default=45, gt=0, le=180)
    max_ai_input_characters: int = Field(default=60_000, ge=1_000)


@lru_cache
def get_settings() -> Settings:
    return Settings()
