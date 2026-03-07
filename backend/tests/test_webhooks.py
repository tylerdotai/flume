"""Tests for webhook endpoints."""
import os
os.environ["TESTING"] = "1"

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Webhook
from app.core.security import get_password_hash
import json

client = TestClient(app)


def setup_user():
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
    db.close()


def test_webhook_unauthorized_list():
    """Test list webhooks without auth."""
    resp = client.get("/api/v1/webhooks")
    assert resp.status_code == 401


def test_webhook_unauthorized_create():
    """Test create webhook without auth."""
    resp = client.post("/api/v1/webhooks", json={"url": "https://example.com"})
    assert resp.status_code == 401


def test_webhook_unauthorized_delete():
    """Test delete webhook without auth."""
    resp = client.delete("/api/v1/webhooks/1")
    assert resp.status_code == 401
