import os
import time
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

def train_model():
    start_time = time.time()
    data_path = os.path.join(os.path.dirname(__file__), '../data/mock_dataset.csv')
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)

    # Basic preprocessing
    texts = df['text'].fillna('')
    labels = df['label']
    total_samples = len(texts)

    # TF-IDF
    vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
    X = vectorizer.fit_transform(texts)
    vocab_size = len(vectorizer.vocabulary_)

    # Train
    model = LogisticRegression(random_state=42, class_weight='balanced')
    model.fit(X, labels)

    # Calculate training accuracy
    predictions = model.predict(X)
    accuracy = accuracy_score(labels, predictions)

    # Save
    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(vectorizer, os.path.join(models_dir, 'vectorizer.pkl'))
    joblib.dump(model, os.path.join(models_dir, 'model.pkl'))
    
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"Model trained and saved successfully in {duration:.2f}s.")
    
    return {
        "status": "success",
        "accuracy": float(accuracy),
        "total_samples": total_samples,
        "vocab_size": vocab_size,
        "training_time_seconds": float(duration)
    }

if __name__ == '__main__':
    train_model()
