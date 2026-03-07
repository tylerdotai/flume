"""Tests for auth endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User
from app.core.security import get_password_hash

client = TestClient(app)


@pytest.fixture
def test_user(db):
    """Create a test user."""
    db = SessionLocal()
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpass123"),
        is_active=True,
        is_verified=True  # Required for login when email verification is enabled
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    yield user
    db.delete(user)
    db.commit()
    db.close()


def test_register_success():
    """Test user registration."""
    # Clean up first
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "newuser@example.com").first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()
    
    response = client.post("/api/v1/auth/register", json={
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["username"] == "newuser"
    assert "id" in data


def test_register_duplicate_email():
    """Test registration with duplicate email."""
    # First registration
    client.post("/api/v1/auth/register", json={
        "email": "duplicate@example.com",
        "username": "user1",
        "password": "password123"
    })
    
    # Duplicate email
    response = client.post("/api/v1/auth/register", json={
        "email": "duplicate@example.com",
        "username": "user2",
        "password": "password123"
    })
    assert response.status_code == 400


def test_login_success(test_user):
    """Test successful login."""
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(test_user):
    """Test login with wrong password."""
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401


def test_login_nonexistent_user():
    """Test login with non-existent user."""
    response = client.post("/api/v1/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123"
    })
    assert response.status_code == 401


def test_me_unauthenticated():
    """Test /me endpoint without auth."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_me_authenticated(test_user):
    """Test /me endpoint with auth."""
    # Login first
    login_response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]
    
    # Get me
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"


def test_forgot_password():
    """Test forgot password."""
    response = client.post("/api/v1/auth/forgot-password", json={
        "email": "testuser@test.com"
    })
    assert response.status_code == 200


def test_forgot_password_nonexistent():
    """Test forgot password with nonexistent user."""
    response = client.post("/api/v1/auth/forgot-password", json={
        "email": "nonexistent@test.com"
    })
    assert response.status_code == 200  # Don't reveal user exists


def test_resend_verification():
    """Test resend verification email."""
    response = client.post("/api/v1/auth/resend-verification", json={
        "email": "testuser@test.com"
    })
    assert response.status_code == 200
