-- Basic shopfront catalog schema.
-- Applied by hand via psql for now — no migration framework yet.
-- Run: psql "$DATABASE_URL" -f sql/schema.sql

CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A product is the thing shown on a listing page (e.g. "Wireless Mouse").
-- It has no price or stock of its own — those live on its variants.
CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A variant is the thing that's actually bought (e.g. "Wireless Mouse — Black").
-- price_cents is an integer, never a float — floating point currency arithmetic
-- accumulates rounding errors that show up as real accounting discrepancies.
CREATE TABLE product_variants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku         TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);
