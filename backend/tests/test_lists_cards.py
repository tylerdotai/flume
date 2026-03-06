"""Tests for lists and cards endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Board, BoardList, Card
from app.core.security import get_password_hash

client = TestClient(app)


def get_auth_token():
    """Get auth token for test user."""
    # Clean up any existing user
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "listtest@example.com").first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()
    
    client.post("/api/v1/auth/register", json={
        "email": "listtest@example.com",
        "username": "listtest",
        "password": "testpass123"
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "listtest@example.com",
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
    user = db.query(User).filter(User.email == "listtest@example.com").first()
    if user:
        db.delete(user)
    db.commit()
    db.close()


def test_create_and_get_list():
    """Test creating and getting a list."""
    token = get_auth_token()
    
    # Create board
    board_response = client.post(
        "/api/v1/boards",
        json={"name": "Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert board_response.status_code == 201
    board_id = board_response.json()["id"]
    
    # Create list
    list_response = client.post(
        f"/api/v1/boards/{board_id}/lists",
        json={"name": "To Do"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert list_response.status_code == 201
    list_data = list_response.json()
    assert list_data["name"] == "To Do"
    list_id = list_data["id"]
    
    # Get lists
    get_response = client.get(
        f"/api/v1/boards/{board_id}/lists",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 200
    lists = get_response.json()
    assert len(lists) == 1
    assert lists[0]["name"] == "To Do"


def test_update_and_delete_list():
    """Test updating and deleting a list."""
    token = get_auth_token()
    
    # Create board and list
    board_response = client.post(
        "/api/v1/boards",
        json={"name": "Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = board_response.json()["id"]
    
    list_response = client.post(
        f"/api/v1/boards/{board_id}/lists",
        json={"name": "Original"},
        headers={"Authorization": f"Bearer {token}"}
    )
    list_id = list_response.json()["id"]
    
    # Update list
    update_response = client.patch(
        f"/api/v1/lists/{list_id}",
        json={"name": "Updated"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["name"] == "Updated"
    
    # Delete list
    delete_response = client.delete(
        f"/api/v1/lists/{list_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 204


def test_create_and_get_card():
    """Test creating and getting a card."""
    token = get_auth_token()
    
    # Create board and list
    board_response = client.post(
        "/api/v1/boards",
        json={"name": "Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = board_response.json()["id"]
    
    list_response = client.post(
        f"/api/v1/boards/{board_id}/lists",
        json={"name": "To Do"},
        headers={"Authorization": f"Bearer {token}"}
    )
    list_id = list_response.json()["id"]
    
    # Create card
    card_response = client.post(
        f"/api/v1/lists/{list_id}/cards",
        json={
            "title": "Test Card",
            "description": "Test description",
            "priority": "high"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert card_response.status_code == 201
    card_data = card_response.json()
    assert card_data["title"] == "Test Card"
    assert card_data["priority"] == "high"
    
    # Get cards
    get_response = client.get(
        f"/api/v1/lists/{list_id}/cards",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_response.status_code == 200
    cards = get_response.json()
    assert len(cards) == 1
    assert cards[0]["title"] == "Test Card"


def test_update_and_delete_card():
    """Test updating and deleting a card."""
    token = get_auth_token()
    
    # Create board, list, card
    board_response = client.post(
        "/api/v1/boards",
        json={"name": "Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = board_response.json()["id"]
    
    list_response = client.post(
        f"/api/v1/boards/{board_id}/lists",
        json={"name": "To Do"},
        headers={"Authorization": f"Bearer {token}"}
    )
    list_id = list_response.json()["id"]
    
    card_response = client.post(
        f"/api/v1/lists/{list_id}/cards",
        json={"title": "Original"},
        headers={"Authorization": f"Bearer {token}"}
    )
    card_id = card_response.json()["id"]
    
    # Update card
    update_response = client.patch(
        f"/api/v1/cards/{card_id}",
        json={"title": "Updated", "priority": "low"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated"
    assert data["priority"] == "low"
    
    # Delete card
    delete_response = client.delete(
        f"/api/v1/cards/{card_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert delete_response.status_code == 204
