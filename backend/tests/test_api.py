from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'

def test_safe_defaults():
    r = client.get('/api/overview')
    body = r.json()
    assert body['mode'] == 'paper'
    assert body['trading_enabled'] is False
    assert body['kill_switch'] is True

def test_live_mode_is_blocked():
    r = client.post('/api/runtime/mode', params={'mode': 'live'})
    assert r.status_code == 403
