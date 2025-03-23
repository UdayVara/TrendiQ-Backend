import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { getProductDto } from './dto/getProduct.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/")
  async getAllProducts(@Query() query: getProductDto,@Request() req: any) {
    return await this.productService.findAllProducts(query,req?.user?.id);
  }

  @Get("/:name")
  async getSingleProduct(@Param("name") name: string) {
    return await this.productService.findSingleProduct(name);
  }

  @Get("/trending/home")
  async getTrendingProducts() {
      return await this.productService.findTrendingProducts();
  }
}
