"""Tests for AI API endpoints."""
import os
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, APIKey, Board
from app.core.security import get_password_hash
import secrets

client = TestClient(app)


def get_or_create_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "aiuser@test.com").first()
        if not user:
            user = User(
                email="aiuser@test.com",
                username="aiuser",
                hashed_password=get_password_hash("testpass123"),
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.is_verified = True
            db.commit()
        user_id = user.id
    finally:
        db.close()
    return user_id


def get_auth_token():
    get_or_create_user()
    response = client.post("/api/v1/auth/login", json={
        "email": "aiuser@test.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]


def create_fresh_api_key():
    """Create a fresh API key for each test."""
    user_id = get_or_create_user()
    db = SessionLocal()
    key = APIKey(
        key=f"flume_{secrets.token_urlsafe(32)}",
        name="Test Key",
        user_id=user_id,
        is_active=True,
    )
    db.add(key)
    db.commit()
    db.refresh(key)
    key_value = key.key
    key_id = key.id
    db.close()
    return key_value, key_id


def test_create_api_key():
    """Test creating an API key."""
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post(
        "/api/v1/ai/keys",
        json={"name": "My New Key"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "key" in data
    assert data["key"].startswith("flume_")


def test_list_api_keys():
    """Test listing API keys with JWT."""
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/ai/keys", headers=headers)
    assert response.status_code == 200


def test_delete_api_key():
    """Test deleting API key."""
    token = get_auth_token()
    key_value, key_id = create_fresh_api_key()  # Create fresh key to delete
    headers = {"Authorization": f"Bearer {token}"}
    response = client.delete(f"/api/v1/ai/keys/{key_id}", headers=headers)
    assert response.status_code == 200


def test_list_boards_api_key():
    """Test listing boards with API key."""
    key_value, _ = create_fresh_api_key()  # Fresh key
    user_id = get_or_create_user()
    
    db = SessionLocal()
    board = Board(name="Test Board", color="#FF5A1F", owner_id=user_id)
    db.add(board)
    db.commit()
    board_id = board.id
    db.close()
    
    headers = {"X-API-Key": key_value}
    response = client.get("/api/v1/ai/boards", headers=headers)
    assert response.status_code == 200


def test_get_board():
    """Test getting a board."""
    key_value, _ = create_fresh_api_key()  # Fresh key
    user_id = get_or_create_user()
    
    db = SessionLocal()
    board = Board(name="Get Board", color="#FF5A1F", owner_id=user_id)
    db.add(board)
    db.commit()
    board_id = board.id
    db.close()
    
    headers = {"X-API-Key": key_value}
    response = client.get(f"/api/v1/ai/boards/{board_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Get Board"


def test_get_board_not_found():
    """Test getting non-existent board."""
    key_value, _ = create_fresh_api_key()  # Fresh key
    headers = {"X-API-Key": key_value}
    response = client.get("/api/v1/ai/boards/99999", headers=headers)
    assert response.status_code == 404


def test_ai_unauthorized():
    """Test accessing without auth."""
    response = client.get("/api/v1/ai/keys")
    assert response.status_code == 401


def test_ai_invalid_key():
    """Test with invalid key."""
    headers = {"X-API-Key": "invalid_key_123"}
    response = client.get("/api/v1/ai/keys", headers=headers)
    assert response.status_code == 401
