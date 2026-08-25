import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

// These interfaces describe the raw shape a row comes back as from `pg` —
// column names as they are in the database, not the API's camelCase.
export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
}

export interface ProductVariantRow {
  id: string;
  sku: string;
  name: string;
  price_cents: number;
  stock: number;
}

@Injectable()
export class ProductsRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAll(limit: number, offset: number): Promise<ProductRow[]> {
    const { rows } = await this.pool.query<ProductRow>(
      `SELECT id, name, slug, description, category_id
       FROM products
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows;
  }

  async count(): Promise<number> {
    const { rows } = await this.pool.query<{ count: string }>('SELECT COUNT(*) FROM products');
    // COUNT(*) comes back as a string because it's a bigint — Postgres bigints
    // don't fit safely into a JS number, so node-postgres won't silently coerce it.
    return Number(rows[0].count);
  }

  async findBySlug(slug: string): Promise<ProductRow | null> {
    const { rows } = await this.pool.query<ProductRow>(
      `SELECT id, name, slug, description, category_id
       FROM products
       WHERE slug = $1`,
      [slug],
    );
    return rows[0] ?? null;
  }

  async findVariantsForProduct(productId: string): Promise<ProductVariantRow[]> {
    const { rows } = await this.pool.query<ProductVariantRow>(
      `SELECT id, sku, name, price_cents, stock
       FROM product_variants
       WHERE product_id = $1
       ORDER BY name`,
      [productId],
    );
    return rows;
  }
}
