import pytest
import sys
import os

# Add backend dir to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import importlib.util
spec = importlib.util.spec_from_file_location("app_module", os.path.join(os.path.dirname(__file__), '..', 'app.py'))
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
flask_app = app_module.app

@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client

def test_search_api(client):
    response = client.get('/api/products/search?q=laptop')
    data = response.get_json()
    if response.status_code != 200:
        print("Search API Failed:", data)
    assert response.status_code == 200
    assert data["success"] is True
    assert "products" in data
    assert isinstance(data["products"], list)

def test_analytics_api(client):
    response = client.get('/api/products/analytics')
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "total_products" in data
    assert "overall_predictions" in data

def test_empty_search(client):
    response = client.get('/api/products/search?q=')
    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert data["error"]["code"] == "EMPTY_QUERY"
