import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { getProductDto } from './dto/getProduct.dto';
import { ApiOkResponse, ApiOperation,  ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags("User Products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get("/")
  @ApiOperation({
    summary: "Get all products",
    description: "This endpoint is used to Get all products",
  })
  @ApiOkResponse({
    example:{
      statusCode:200,
      message:"",
      data:[],
      wishlist:[],
    }
  })
  async getAllProducts(@Query() query: getProductDto,@Request() req: any) {
    return await this.productService.findAllProducts(query,req?.user?.id);
  }

  @Get("/:name")
  @ApiOperation({
    summary: "Get single product",
    description: "This endpoint is used to Get single product by Name",
  })
  @ApiOkResponse({
    example:{
      statusCode:200,
      message:"",
      data:{},
    }
  })
  async getSingleProduct(@Param("name") name: string) {
    return await this.productService.findSingleProduct(name);
  }

  @Get("/trending/home")
  @ApiOperation({
    summary: "Get Trending products",
    description: "This endpoint is used to Get Trending products",
  })
  @ApiOkResponse({
    example:{
      statusCode:200,
      message:"",
      data:[],
      banner:[]
    }
  })
  async getTrendingProducts(@Query("gender") gender: "male" | "female" | null | undefined) {
      return await this.productService.findTrendingProducts(gender);
  }

  @Get("/home/search-products")
  async getSearchProducts(@Query("gender") gender: "male" | "female"){
    return await this.productService.returnAllProductByGender(gender)
  }
}
