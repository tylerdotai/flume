"""API Key authentication for AI agents."""
import secrets
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from app.db import User, APIKey
from app.db.session import get_db

# API Key header
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


def get_api_key_user(
    api_key: Optional[str] = Depends(API_KEY_HEADER),
    db: Session = Depends(get_db),
) -> User:
    """Authenticate via API key and return the user."""
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key. Use X-API-Key header.",
        )
    
    # Look up API key
    key_record = db.query(APIKey).filter(APIKey.key == api_key, APIKey.is_active == True).first()
    if not key_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key.",
        )
    
    return key_record.user


# Optional auth - returns user if either API key or JWT provided
async def get_optional_user(
    api_key: Optional[str] = Depends(API_KEY_HEADER),
    db: Session = Depends(get_db),
):
    """Get user from either API key or JWT (for AI endpoints that support both)."""
    if api_key:
        return get_api_key_user(api_key, db)
    return None
