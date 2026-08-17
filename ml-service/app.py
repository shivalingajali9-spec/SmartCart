import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib

# Import training module
from training.train import train_model

app = Flask(__name__)
CORS(app)

models_dir = os.path.join(os.path.dirname(__file__), 'models')
vectorizer = None
model = None

def load_models():
    global vectorizer, model
    try:
        vectorizer = joblib.load(os.path.join(models_dir, 'vectorizer.pkl'))
        model = joblib.load(os.path.join(models_dir, 'model.pkl'))
        print("ML Models loaded successfully.")
        return True
    except Exception as e:
        print(f"Warning: Models not loaded. Train models first. Error: {e}")
        vectorizer = None
        model = None
        return False

# Initial load
load_models()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ml-service"})

@app.route('/api/ml/status', methods=['GET'])
def model_status():
    if model and vectorizer:
        return jsonify({
            "status": "loaded",
            "model_type": type(model).__name__,
            "vectorizer_type": type(vectorizer).__name__
        })
    return jsonify({"status": "not_loaded"})

@app.route('/api/ml/retrain', methods=['POST'])
def retrain():
    try:
        # Programmatically trigger the training script
        stats = train_model()
        
        # Reload models into memory
        success = load_models()
        
        if success:
            return jsonify({
                "message": "Model retrained and loaded successfully.",
                "stats": stats
            }), 200
        else:
            return jsonify({"error": "Model trained but failed to load into memory."}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ml/fake-review', methods=['POST'])
def analyze_review():
    if not model or not vectorizer:
        return jsonify({"error": "Model not initialized"}), 503
        
    data = request.json
    review_text = data.get('text', '')
    
    if not review_text:
        return jsonify({"error": "No text provided"}), 400

    # Inference
    X_new = vectorizer.transform([review_text])
    prediction = model.predict(X_new)[0]
    
    # Probabilities
    proba = model.predict_proba(X_new)[0]
    confidence = max(proba)
    
    trust_score = round(confidence * 100) if prediction == 'genuine' else round((1 - confidence) * 100)
    
    # Sentiment Analysis
    from textblob import TextBlob
    blob = TextBlob(review_text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        sentiment = 'positive'
    elif polarity < -0.1:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return jsonify({
        "prediction": prediction,
        "confidence": round(float(confidence), 2),
        "trust_score": trust_score,
        "sentiment": sentiment,
        "sentiment_score": round(polarity, 2),
        "reason": ["Placeholder NLP Feature"] if prediction == 'fake' else []
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
