-- Sample data for local development.
-- Run: psql "$DATABASE_URL" -f sql/seed.sql

INSERT INTO categories (name, slug) VALUES
    ('Electronics', 'electronics'),
    ('Books', 'books');

INSERT INTO products (category_id, name, slug, description)
SELECT id, 'Wireless Mouse', 'wireless-mouse', 'A wireless mouse with a 12-month battery life.'
FROM categories WHERE slug = 'electronics';

INSERT INTO products (category_id, name, slug, description)
SELECT id, 'Mechanical Keyboard', 'mechanical-keyboard', 'A tenkeyless mechanical keyboard with hot-swappable switches.'
FROM categories WHERE slug = 'electronics';

INSERT INTO products (category_id, name, slug, description)
SELECT id, 'Learning SQL', 'learning-sql', 'A practical guide to relational databases and SQL.'
FROM categories WHERE slug = 'books';

INSERT INTO product_variants (product_id, sku, name, price_cents, stock)
SELECT id, 'MOUSE-BLK', 'Black', 2499, 50 FROM products WHERE slug = 'wireless-mouse'
UNION ALL
SELECT id, 'MOUSE-WHT', 'White', 2499, 30 FROM products WHERE slug = 'wireless-mouse';

INSERT INTO product_variants (product_id, sku, name, price_cents, stock)
SELECT id, 'KEYB-RED', 'Red switches', 8999, 15 FROM products WHERE slug = 'mechanical-keyboard'
UNION ALL
SELECT id, 'KEYB-BRN', 'Brown switches', 8999, 20 FROM products WHERE slug = 'mechanical-keyboard';

INSERT INTO product_variants (product_id, sku, name, price_cents, stock)
SELECT id, 'BOOK-SQL-PB', 'Paperback', 3499, 100 FROM products WHERE slug = 'learning-sql'
UNION ALL
SELECT id, 'BOOK-SQL-HC', 'Hardcover', 4999, 10 FROM products WHERE slug = 'learning-sql';
