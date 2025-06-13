import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('cart')
@UseGuards(AuthGuard)
@ApiTags("Cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Cart',
    description: 'This API is used to create cart/add item to cart',
  })
  @ApiBody({
    type: CreateCartDto
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Item Added to the Cart',
    }
  })
  create(@Body() createCartDto: CreateCartDto,@Request() req) {
    return this.cartService.create(createCartDto,req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Cart Items',
    description: 'This API is used to get all cart items',
  })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Cart Items Fetched Successfully',
      data:['cart items here'],
      addresses:['addresses here'],
      cartSummary:{
        amount:0,
        discount:0,
        finalAmount:0,
        gst:0,
      }
    }
  })
  findAll(@Request() req) {
    return this.cartService.findAll(req.user.id);
  }

  
  @Get("/count")
  @ApiOperation({
    summary: 'Get Cart Count',
    description: 'This API is used to get cart count',
  })
  @ApiOkResponse({
    example: {
      statusCode: 200,
      count:0,
    }
  })
  getCartCount(@Request() req) {
    return this.cartService.getCartCount(req.user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update Cart Item',
    description: 'This API is used to update cart item',
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Cart Updated Successfully',
    }
  })
  update( @Body() updateCartDto: UpdateCartDto,@Request() req) {
    return this.cartService.update( updateCartDto,req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Cart Item',
    description: 'This API is used to delete cart item',
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Cart Item Deleted Successfully',
    }
  })
  remove(@Param('id') id: string,@Request() req) {
    return this.cartService.remove(id,req.user.id);
  }
}
