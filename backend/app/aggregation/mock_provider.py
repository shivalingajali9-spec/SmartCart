import os
from sqlalchemy import create_engine, text

# Reuse the DB connection for our mock provider
db_user = os.getenv("DB_USER", "root")
db_pass = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "smartcart")
mysql_uri = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}/{db_name}"
engine = create_engine(mysql_uri)

def search_products(query=""):
    """Mock search aggregating from our database."""
    with engine.connect() as conn:
        # Searching by name, brand, or category
        sql = text("""
            SELECT p.id, p.name, p.brand, p.category, p.description, p.image_url,
                   l.platform, l.seller, l.price, l.original_price, l.rating, l.review_count, l.availability, l.product_url
            FROM products p
            JOIN product_listings l ON p.id = l.product_id
            WHERE p.name LIKE :q OR p.brand LIKE :q OR p.category LIKE :q
        """)
        result = conn.execute(sql, {"q": f"%{query}%"}).fetchall()
        
        # Organize results into structured dictionaries
        products = {}
        for row in result:
            pid = row.id
            if pid not in products:
                products[pid] = {
                    "product_id": pid,
                    "name": row.name,
                    "brand": row.brand,
                    "category": row.category,
                    "description": row.description,
                    "image_url": row.image_url,
                    "listings": []
                }
            
            # Simulated fake review adjustment (mock for phase 2, real in phase 8)
            adjusted_rating = max(1.0, float(row.rating) - 0.3)
            
            products[pid]["listings"].append({
                "platform": row.platform,
                "seller": row.seller,
                "price": float(row.price),
                "original_price": float(row.original_price),
                "discount": round(((float(row.original_price) - float(row.price)) / float(row.original_price)) * 100),
                "rating": float(row.rating),
                "adjusted_rating": round(adjusted_rating, 1),
                "review_count": row.review_count,
                "trust_score": 85, # mock score
                "availability": row.availability,
                "product_url": row.product_url
            })
            
        return list(products.values())
