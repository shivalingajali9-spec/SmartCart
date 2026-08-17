import os
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../backend/.env'))

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client["smartcart"]
reviews_collection = db["reviews"]

# Clear existing reviews if any
reviews_collection.delete_many({})

product_ids = ["PROD-001", "PROD-002", "PROD-003"]
platforms = ["Amazon", "Flipkart", "Reliance Digital"]

# Sample review texts to randomly pick from
good_reviews = [
    "Excellent product, works exactly as described. Very happy with the purchase.",
    "The build quality is amazing. Battery life is stellar.",
    "Highly recommended! Best in its class.",
    "Fast delivery and original product. Sound quality is superb.",
    "A bit pricey but absolutely worth the money."
]

bad_reviews = [
    "Not worth the price. Stopped working after a week.",
    "Customer service was terrible, product arrived damaged.",
    "Disappointed with the performance. Expected better.",
    "Battery drains too fast. Do not buy.",
    "Fake product sent by the seller. Returned it immediately."
]

neutral_reviews = [
    "It's okay for the price. Nothing special.",
    "Decent, but could be better. The features are standard.",
    "Works fine, but the delivery was delayed by a week.",
    "Average product. You get what you pay for."
]

reviews_to_insert = []

for pid in product_ids:
    for i in range(15): # 15 reviews per product
        rating = random.choice([1, 2, 3, 4, 4, 5, 5, 5])
        
        if rating >= 4:
            text = random.choice(good_reviews)
        elif rating == 3:
            text = random.choice(neutral_reviews)
        else:
            text = random.choice(bad_reviews)
            
        review_date = datetime.now() - timedelta(days=random.randint(1, 100))
        
        review = {
            "review_id": f"REV-{pid}-{i}",
            "product_id": pid,
            "platform": random.choice(platforms),
            "reviewer_name": f"User_{random.randint(1000, 9999)}",
            "rating": rating,
            "review_text": text,
            "review_date": review_date.strftime("%Y-%m-%d"),
            # Placeholder for ML pipeline later:
            "prediction": "pending",
            "trust_score": None,
            "sentiment": "pending",
            "confidence": None
        }
        reviews_to_insert.append(review)

reviews_collection.insert_many(reviews_to_insert)
print(f"Successfully seeded {len(reviews_to_insert)} mock reviews into MongoDB.")
