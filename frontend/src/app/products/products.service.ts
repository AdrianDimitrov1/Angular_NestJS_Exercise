import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ProductListResponse {
  items: ProductSummary[];
  total: number;
  page: number;
  limit: number;
}

const API_BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  list(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${API_BASE_URL}/products`);
  }
}
