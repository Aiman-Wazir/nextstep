# backend/tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_recommendations_endpoint():
    payload = {
        "skills": {
            "python": 4,
            "machine_learning": 4,
            "tensorflow": 2
        },
        "interests": ["Artificial Intelligence", "Machine Learning"],
        "education": "Computer Science",
        "experience_level": 2
    }
    response = client.post("/api/v1/recommend", json=payload)
    assert response.status_code == 200
    assert "recommendations" in response.json()