import os
import pytest
from app.app import app
@pytest.fixture
def client():
    app.config["TESTING"] = True
    os.environ["ADMIN_PASSWORD"] = "testpass"
    with app.test_client() as client:
        yield client

def test_home(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert b"StackPilot" in resp.data or b"Hello" in resp.data

def test_unauthorized_messages(client):
    resp = client.get("/messages")
    assert resp.status_code == 401

def test_authorized_messages(client):
    resp = client.get("/messages", headers={
        "Authorization": "Basic YWRtaW46dGVzdHBhc3M="  # base64(admin:testpass)
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
