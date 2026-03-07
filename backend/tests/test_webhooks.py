"""Tests for webhook endpoints."""
import os
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Webhook
from app.core.security import get_password_hash

client = TestClient(app)


def get_or_create_user():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "webhook@test.com").first()
    if not user:
        user = User(
            email="webhook@test.com",
            username="webhookuser",
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
    db.close()
    return user_id


def get_auth_token():
    get_or_create_user()
    response = client.post("/api/v1/auth/login", json={
        "email": "webhook@test.com",
        "password": "testpass123"
    })
    return response.json()["access_token"]


def test_list_webhooks():
    """Test listing webhooks."""
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/webhooks", headers=headers)
    assert response.status_code == 200


def test_webhook_unauthorized():
    """Test accessing without auth."""
    response = client.get("/api/v1/webhooks")
    assert response.status_code == 401
