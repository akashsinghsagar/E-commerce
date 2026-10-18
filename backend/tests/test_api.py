import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test-laddi.db"
os.environ["JWT_SECRET_KEY"] = "test-secret"

from fastapi.testclient import TestClient

from backend.app.main import app


def test_health() -> None:
    response = TestClient(app).get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
