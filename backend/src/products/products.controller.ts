import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: ListProductsQueryDto) {
    return this.productsService.list(query.page, query.limit);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.productsService.getBySlug(slug);
  }
}
