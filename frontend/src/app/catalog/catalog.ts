import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../products/products.service';

@Component({
  selector: 'app-catalog',
  imports: [],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  private readonly productsService = inject(ProductsService);

  protected readonly products = toSignal(this.productsService.list(), {
    initialValue: null,
  });
}
