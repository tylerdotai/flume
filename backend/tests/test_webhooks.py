"""Tests for webhook endpoints."""
import os
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User
from app.core.security import get_password_hash
import json

client = TestClient(app)


def get_token():
    """Get auth token."""
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
    db.close()
    
    resp = client.post("/api/v1/auth/login", json={
        "email": "webhook@test.com",
        "password": "testpass123"
    })
    return resp.json()["access_token"]


def test_list_webhooks():
    """Test listing webhooks with auth."""
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/api/v1/webhooks", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_webhook_unauthorized():
    """Test unauthorized access."""
    resp = client.get("/api/v1/webhooks")
    assert resp.status_code == 401
