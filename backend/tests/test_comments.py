"""Tests for comments endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Board, BoardList, Card, Comment

client = TestClient(app)


def get_auth_token():
    """Get auth token."""
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "commentstest@example.com").first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()
    
    client.post("/api/v1/auth/register", json={
        "email": "commentstest@example.com",
        "username": "commentstest",
        "password": "testpass123"
    })
    response = client.post("/api/v1/auth/login", json={
        "email": "commentstest@example.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]


@pytest.fixture(autouse=True)
def cleanup():
    """Clean up after tests."""
    yield
    db = SessionLocal()
    db.query(Comment).delete()
    db.query(Card).delete()
    db.query(BoardList).delete()
    db.query(Board).delete()
    user = db.query(User).filter(User.email == "commentstest@example.com").first()
    if user:
        db.delete(user)
    db.commit()
    db.close()


def test_create_and_get_comment():
    """Test creating and getting comments."""
    token = get_auth_token()
    
    # Create board
    board_resp = client.post(
        "/api/v1/boards",
        json={"name": "Test Board"},
        headers={"Authorization": f"Bearer {token}"}
    )
    board_id = board_resp.json()["id"]
    
    # Create list
    list_resp = client.post(
        f"/api/v1/boards/{board_id}/lists",
        json={"name": "To Do"},
        headers={"Authorization": f"Bearer {token}"}
    )
    list_id = list_resp.json()["id"]
    
    # Create card
    card_resp = client.post(
        f"/api/v1/lists/{list_id}/cards",
        json={"title": "Test Card"},
        headers={"Authorization": f"Bearer {token}"}
    )
    card_id = card_resp.json()["id"]
    
    # Create comment
    comment_resp = client.post(
        f"/api/v1/cards/{card_id}/comments",
        json={"content": "This is a test comment"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert comment_resp.status_code == 201
    
    # Get comments
    get_resp = client.get(
        f"/api/v1/cards/{card_id}/comments",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert get_resp.status_code == 200
    comments = get_resp.json()
    assert len(comments) >= 1
    assert comments[0]["content"] == "This is a test comment"
