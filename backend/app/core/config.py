"""Application configuration."""
import os
import json
from typing import Union, List
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""

    # App
    APP_NAME: str = "Flume"
    DEBUG: bool = True
    BASE_URL: str = os.getenv("BASE_URL", "https://flume.sh")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE-ME-IN-PRODUCTION")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database - uses SQLite locally, PostgreSQL on Render/Supabase
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./flume.db")

    # CORS - allow all for development, restrict in production
    BACKEND_CORS_ORIGINS: str = "*"
    
    # Email (optional - for password reset & verification)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "Flume <onboarding@resend.dev>")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")

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
    
    @property
    def email_enabled(self) -> bool:
        """Check if email is configured."""
        return bool(self.RESEND_API_KEY or (self.SMTP_HOST and self.SMTP_USER))

    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings."""
    return Settings()


settings = get_settings()
