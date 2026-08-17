class BasePlatformAdapter:
    def __init__(self, platform_name):
        self.platform_name = platform_name

    def search(self, query: str) -> list:
        """
        Search for products on the platform.
        Must return a list of dictionaries with normalized keys.
        """
        raise NotImplementedError("Subclasses must implement the search method.")

    def _normalize_product(self, raw_data: dict) -> dict:
        """
        Convert platform-specific raw data into the normalized SmartCart structure.
        Normalized structure:
        id, product_id, name, brand, category, description, image_url,
        price, original_price, discount, rating, review_count, availability,
        seller, platform, product_url, specifications
        """
        raise NotImplementedError("Subclasses must implement the normalize method.")
