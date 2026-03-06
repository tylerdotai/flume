"""Test fixtures for Flume backend."""
import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    """Get auth headers for testing."""
    # TODO: Create test user and return JWT token
    return {"Authorization": "Bearer test-token"}
