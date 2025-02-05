import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto,@Request() req) {
    return this.cartService.create(createCartDto,req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.cartService.findAll(req.user.id);
  }

  

  @Patch()
  update( @Body() updateCartDto: UpdateCartDto,@Request() req) {
    return this.cartService.update( updateCartDto,req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.cartService.remove(id,req.user.id);
  }
}
