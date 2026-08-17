import os
import requests
from flask import Blueprint, jsonify
from sqlalchemy import text, create_engine
from pymongo import MongoClient

admin_bp = Blueprint('admin', __name__)

mysql_uri = os.getenv("DB_URI", f"mysql+pymysql://{os.getenv('DB_USER', 'root')}:{os.getenv('DB_PASSWORD', '')}@{os.getenv('DB_HOST', 'localhost')}/{os.getenv('DB_NAME', 'smartcart')}")
engine = create_engine(mysql_uri)

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(mongo_uri)
mongo_db = mongo_client["smartcart"]

ml_service_url = os.getenv("ML_SERVICE_URL", "http://localhost:5001")

@admin_bp.route('/health', methods=['GET'])
def get_system_health():
    health_status = {
        "mysql": {"status": "unknown", "message": ""},
        "mongodb": {"status": "unknown", "message": ""},
        "ml_service": {"status": "unknown", "message": ""}
    }

    # 1. Check MySQL
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        health_status["mysql"]["status"] = "connected"
        health_status["mysql"]["message"] = "OK"
    except Exception as e:
        health_status["mysql"]["status"] = "error"
        health_status["mysql"]["message"] = str(e)

    # 2. Check MongoDB
    try:
        mongo_client.admin.command('ping')
        health_status["mongodb"]["status"] = "connected"
        health_status["mongodb"]["message"] = "OK"
    except Exception as e:
        health_status["mongodb"]["status"] = "error"
        health_status["mongodb"]["message"] = str(e)

    # 3. Check ML Service
    try:
        response = requests.get(f"{ml_service_url}/api/ml/status", timeout=5)
        if response.status_code == 200:
            ml_data = response.json()
            if ml_data.get("status") == "loaded":
                health_status["ml_service"]["status"] = "connected"
                health_status["ml_service"]["message"] = f"OK ({ml_data.get('model_type')})"
            else:
                health_status["ml_service"]["status"] = "warning"
                health_status["ml_service"]["message"] = "Service online, but model not loaded"
        else:
            health_status["ml_service"]["status"] = "error"
            health_status["ml_service"]["message"] = f"HTTP {response.status_code}"
    except Exception as e:
        health_status["ml_service"]["status"] = "error"
        health_status["ml_service"]["message"] = "Service Unreachable"

    overall_status = "healthy"
    for svc, details in health_status.items():
        if details["status"] == "error":
            overall_status = "error"
            break
        elif details["status"] == "warning":
            overall_status = "warning"

    return jsonify({
        "status": overall_status,
        "services": health_status
    })
