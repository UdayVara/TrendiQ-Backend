import { Controller, Post, UseGuards,Request, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { CompletePaymentDto } from './dto/completePayment.dto';

@Controller('stripe')
@UseGuards(AuthGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Request() req:any) {
    return this.stripeService.createPaymentIntent(req.user.id);
  }

  @Post('complete-payment')
  async completePayment(@Request() req:any, @Body() completePaymentDto: CompletePaymentDto) {
    return this.stripeService.completePayment(completePaymentDto, req.user.id);
  }

  @Get("myorders")
  async myOrders(@Request() req:any) {
    return this.stripeService.myOrders(req.user.id);
  }

  @Get("order/:id")
  async getOrderId(@Param("id",ParseUUIDPipe) id:string,@Request() req:any){
    return this.stripeService.getOrderById(req.user.id,id)
  }
}
