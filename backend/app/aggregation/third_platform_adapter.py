import os
from sqlalchemy import create_engine, text
from app.aggregation.base_adapter import BasePlatformAdapter

db_user = os.getenv("DB_USER", "root")
db_pass = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "localhost")
db_name = os.getenv("DB_NAME", "smartcart")
mysql_uri = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}/{db_name}"
engine = create_engine(mysql_uri)

class ThirdPlatformMockAdapter(BasePlatformAdapter):
    def __init__(self):
        # We use Reliance Digital as our third mocked platform
        super().__init__("Reliance Digital")

    def search(self, query: str) -> list:
        results = []
        with engine.connect() as conn:
            sql = text("""
                SELECT p.id as product_id, p.name, p.brand, p.category, p.description, p.image_url,
                       l.id as listing_id, l.seller, l.price, l.original_price, l.rating, l.review_count, 
                       l.availability, l.product_url
                FROM products p
                JOIN product_listings l ON p.id = l.product_id
                WHERE l.platform = :platform AND (p.name LIKE :q OR p.brand LIKE :q OR p.category LIKE :q)
            """)
            rows = conn.execute(sql, {"platform": self.platform_name, "q": f"%{query}%"}).fetchall()
            
            for row in rows:
                results.append(self._normalize_product(row))
                
        return results

    def _normalize_product(self, raw_data) -> dict:
        price = float(raw_data.price) if raw_data.price else 0.0
        original_price = float(raw_data.original_price) if raw_data.original_price else 0.0
        discount = 0
        if original_price > 0 and original_price > price:
            discount = round(((original_price - price) / original_price) * 100)
            
        return {
            "id": raw_data.listing_id,
            "product_id": raw_data.product_id,
            "name": raw_data.name,
            "brand": raw_data.brand,
            "category": raw_data.category,
            "description": raw_data.description,
            "image_url": raw_data.image_url,
            "price": price,
            "original_price": original_price,
            "discount": discount,
            "rating": float(raw_data.rating) if raw_data.rating else 0.0,
            "review_count": raw_data.review_count,
            "availability": raw_data.availability,
            "seller": raw_data.seller,
            "platform": self.platform_name,
            "product_url": raw_data.product_url,
            "specifications": {}
        }
