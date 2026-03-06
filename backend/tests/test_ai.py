"""Tests for AI endpoints with API key."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, APIKey
from app.core.security import get_password_hash
import secrets

client = TestClient(app)


def create_user_with_api_key():
    """Create a user and generate an API key."""
    db = SessionLocal()
    user = User(
        email="aitest2@example.com",
        username="aitest2",
        hashed_password=get_password_hash("testpass123")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Generate API key
    api_key = APIKey(
        name="Test Key",
        key=f"flume_{secrets.token_urlsafe(32)}",
        user_id=user.id
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    db.close()
    return user, api_key.key


@pytest.fixture(autouse=True)
def cleanup():
    """Clean up after tests."""
    yield
    db = SessionLocal()
    db.query(APIKey).delete()
    db.query(User).filter(User.email == "aitest2@example.com").delete()
    db.commit()
    db.close()


def test_ai_boards_without_key():
    """Test AI boards endpoint without API key."""
    response = client.get("/api/v1/ai/boards")
    assert response.status_code == 401


def test_ai_boards_with_invalid_key():
    """Test AI boards with invalid key."""
    response = client.get(
        "/api/v1/ai/boards",
        headers={"X-API-Key": "flume_invalid_key"}
    )
    assert response.status_code == 401


def test_ai_get_board_without_key():
    """Test AI get board without key."""
    response = client.get("/api/v1/ai/boards/1")
    assert response.status_code == 401
