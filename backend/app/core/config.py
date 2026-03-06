"""Application configuration."""
import os
import json
from typing import Union, List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""

    # App
    APP_NAME: str = "Flume"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database - uses SQLite locally, PostgreSQL on Render/Supabase
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./flume.db")

    # CORS - allow all for development, restrict in production
    BACKEND_CORS_ORIGINS: str = "*"

    @property
    def cors_list(self) -> List[str]:
        """Convert CORS origins to list."""
        if self.BACKEND_CORS_ORIGINS == "*":
            return ["*"]
        try:
            # Try parsing as JSON
            return json.loads(self.BACKEND_CORS_ORIGINS)
        except (json.JSONDecodeError, TypeError):
            # If it's a single URL, wrap in list
            return [self.BACKEND_CORS_ORIGINS]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings."""
    return Settings()


settings = get_settings()
