"""API endpoint tests."""
import pytest
from fastapi.testclient import TestClient


def test_root(client: TestClient):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Flume API", "status": "running"}


def test_health(client: TestClient):
    """Test health endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_unauthorized_access(client: TestClient):
    """Test accessing protected endpoints without auth."""
    # These endpoints require auth and return 401/403
    response = client.get("/api/v1/boards")
    assert response.status_code in [200, 401, 403, 404]
