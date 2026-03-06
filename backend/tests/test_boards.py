"""Tests for boards endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Board
from app.core.security import get_password_hash

client = TestClient(app)


def get_auth_token():
    """Get auth token for test user."""
    # Register user
    client.post("/api/v1/auth/register", json={
        "email": "boardtest@example.com",
        "username": "boardtest",
        "password": "testpass123"
    })
    # Login
    response = client.post("/api/v1/auth/login", json={
        "email": "boardtest@example.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]


@pytest.fixture(autouse=True)
def cleanup():
    """Clean up after tests."""
    yield
    db = SessionLocal()
    db.query(Board).filter(Board.name.like("Test%")).delete()
    db.query(User).filter(User.email == "boardtest@example.com").delete()
    db.commit()
    db.close()


def test_create_board():
    """Test creating a board."""
    token = get_auth_token()
    
    response = client.post(
        "/api/v1/boards",
        json={"name": "Test Board", "color": "#FF0000"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Board"
    assert data["color"] == "#FF0000"


def test_list_boards():
    """Test listing boards."""
    token = get_auth_token()
    
    # Create a board first
    client.post(
        "/api/v1/boards",
        json={"name": "List Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # List boards
    response = client.get(
        "/api/v1/boards",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    boards = response.json()
    assert len(boards) >= 1
    assert any(b["name"] == "List Test Board" for b in boards)


def test_get_board():
    """Test getting a specific board."""
    token = get_auth_token()
    
    # Create a board
    create_response = client.post(
        "/api/v1/boards",
        json={"name": "Get Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = create_response.json()["id"]
    
    # Get board
    response = client.get(
        f"/api/v1/boards/{board_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Get Test Board"


def test_update_board():
    """Test updating a board."""
    token = get_auth_token()
    
    # Create a board
    create_response = client.post(
        "/api/v1/boards",
        json={"name": "Original Name"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = create_response.json()["id"]
    
    # Update board
    response = client.patch(
        f"/api/v1/boards/{board_id}",
        json={"name": "Updated Name", "color": "#00FF00"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["color"] == "#00FF00"


def test_delete_board():
    """Test deleting a board."""
    token = get_auth_token()
    
    # Create a board
    create_response = client.post(
        "/api/v1/boards",
        json={"name": "Delete Me"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = create_response.json()["id"]
    
    # Delete board
    response = client.delete(
        f"/api/v1/boards/{board_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204
    
    # Verify deleted
    get_response = client.get(
        f"/api/v1/boards/{board_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 404


def test_board_not_found():
    """Test getting non-existent board."""
    token = get_auth_token()
    
    response = client.get(
        "/api/v1/boards/99999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404


def test_create_board_unauthorized():
    """Test creating board without auth."""
    response = client.post(
        "/api/v1/boards",
        json={"name": "Unauthorized Board"}
    )
    assert response.status_code == 401
