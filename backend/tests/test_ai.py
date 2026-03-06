"""Tests for AI API endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Board, BoardList, Card
from app.core.security import get_password_hash

client = TestClient(app)


def get_auth_token():
    """Get auth token."""
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "aitest@example.com").first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()
    
    client.post("/api/v1/auth/register", json={
        "email": "aitest@example.com",
        "username": "aitest",
        "password": "testpass123"
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "aitest@example.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]


@pytest.fixture(autouse=True)
def cleanup():
    """Clean up after tests."""
    yield
    db = SessionLocal()
    db.query(Card).delete()
    db.query(BoardList).delete()
    db.query(Board).delete()
    user = db.query(User).filter(User.email == "aitest@example.com").first()
    if user:
        db.delete(user)
    db.commit()
    db.close()


def test_ai_list_boards():
    """Test AI list boards endpoint."""
    token = get_auth_token()
    
    # Create a board
    client.post(
        "/api/v1/boards",
        json={"name": "AI Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # List via AI endpoint
    response = client.get(
        "/api/v1/ai/boards",
        headers={"X-API-Key": "fake-key"}  # This should fail without valid key
    )
    # Without valid API key, should get 401
    assert response.status_code in [401, 403]


def test_ai_get_board():
    """Test AI get board endpoint."""
    token = get_auth_token()
    
    # Create board
    board_response = client.post(
        "/api/v1/boards",
        json={"name": "AI Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = board_response.json()["id"]
    
    # Try without API key - should fail
    response = client.get(
        f"/api/v1/ai/boards/{board_id}",
        headers={"X-API-Key": "invalid"}
    )
    assert response.status_code in [401, 403]


def test_api_key_not_found():
    """Test API key with invalid key."""
    response = client.get(
        "/api/v1/ai/boards",
        headers={"X-API-Key": "flume_nonexistent"}
    )
    assert response.status_code == 401


def test_api_key_missing():
    """Test API calls without API key."""
    # Should require authentication
    response = client.get("/api/v1/ai/boards")
    assert response.status_code == 401
