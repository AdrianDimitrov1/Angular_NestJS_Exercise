import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  stock: number;
}

export interface ProductDetail extends ProductSummary {
  variants: ProductVariant[];
}

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async list(page: number, limit: number): Promise<{ items: ProductSummary[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      this.productsRepository.findAll(limit, offset),
      this.productsRepository.count(),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
      })),
      total,
      page,
      limit,
    };
  }

  async getBySlug(slug: string): Promise<ProductDetail> {
    const product = await this.productsRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`No product found with slug "${slug}"`);
    }

    const variantRows = await this.productsRepository.findVariantsForProduct(product.id);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      variants: variantRows.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        priceCents: variant.price_cents,
        stock: variant.stock,
      })),
    };
  }
}
