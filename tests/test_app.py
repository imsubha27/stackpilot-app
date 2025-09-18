import os
import base64
import pytest
from app.app import app



@pytest.fixture
def client():
    app.config["TESTING"] = True
    os.environ.setdefault("ADMIN_PASSWORD", "testpass")  # fallback for local
    with app.test_client() as client:
        yield client

def _auth_header():
    user = "admin"
    pwd = os.environ["ADMIN_PASSWORD"]
    token = base64.b64encode(f"{user}:{pwd}".encode()).decode()
    return {"Authorization": f"Basic {token}"}

def test_home(client):
    resp = client.get("/")
    assert resp.status_code == 200

def test_unauthorized_messages(client):
    resp = client.get("/messages")
    assert resp.status_code == 401

def test_authorized_messages(client):
    resp = client.get("/messages", headers=_auth_header())
    assert resp.status_code == 200
