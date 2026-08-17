USE smartcart;

INSERT INTO users (name, email, password_hash) VALUES 
('Test User', 'test@example.com', 'hashedpassword123');

INSERT INTO products (id, name, brand, category, description, image_url) VALUES 
('PROD-001', 'Sony WH-1000XM5 Wireless Headphones', 'Sony', 'Electronics', 'Industry leading noise canceling headphones.', 'https://m.media-amazon.com/images/I/61+OigWtPQL._SL1500_.jpg'),
('PROD-002', 'Samsung Galaxy S23 Ultra', 'Samsung', 'Smartphones', 'The epic new Galaxy with 200MP camera.', 'https://m.media-amazon.com/images/I/71lD7eNdW-L._SX679_.jpg'),
('PROD-003', 'Apple MacBook Air M2', 'Apple', 'Laptops', 'Supercharged by M2 chip.', 'https://m.media-amazon.com/images/I/71f5Eu5lJ4L._SX679_.jpg');

INSERT INTO product_listings (product_id, platform, seller, price, original_price, rating, review_count, availability, product_url) VALUES 
('PROD-001', 'Amazon', 'Appario Retail', 29999.00, 34990.00, 4.4, 1248, 'In Stock', 'https://amazon.in/dp/B09XS7JWHH'),
('PROD-001', 'Flipkart', 'SuperComNet', 30499.00, 34990.00, 4.3, 850, 'In Stock', 'https://flipkart.com/sony-wh-1000xm5'),
('PROD-001', 'Reliance Digital', 'Reliance', 29799.00, 34990.00, 4.2, 320, 'Limited Stock', 'https://reliancedigital.in/sony-wh-1000xm5'),

('PROD-002', 'Amazon', 'STPL', 104999.00, 124999.00, 4.6, 3210, 'In Stock', 'https://amazon.in/dp/B0BRQF65W5'),
('PROD-002', 'Flipkart', 'MobilesHub', 105999.00, 124999.00, 4.5, 2100, 'In Stock', 'https://flipkart.com/samsung-s23-ultra'),

('PROD-003', 'Amazon', 'Appario Retail', 109900.00, 114900.00, 4.8, 5600, 'In Stock', 'https://amazon.in/dp/B0B3B3W5XV');

INSERT INTO price_history (listing_id, price, recorded_at) VALUES
(1, 31999.00, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 30999.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 29999.00, NOW()),
(2, 32999.00, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 31499.00, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 30499.00, NOW());
