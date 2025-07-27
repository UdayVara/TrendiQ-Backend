import { Controller, Post, UseGuards,Request, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { CompletePaymentDto } from './dto/completePayment.dto';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('stripe')
@UseGuards(AuthGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Request() req:any,@Body() createPaymentDto:CreatePaymentDto) {
    return this.stripeService.createPaymentIntent(req.user.id,createPaymentDto);
  }
  @Post('create-payment-intent-mobile')
  @ApiOperation({ summary: 'Create payment intent for mobile' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiCreatedResponse({ description: 'Payment intent created successfully',example:{
      clientSecret: "kldsjflsdkjflsdkjf09ejfoidfjslkdfj",
      statusCode: 200,
      message: 'PaymentIntent Created Successfully',
      transactionId:"sldkjfkdsljflsdkjflkdsj"
    } })
  async createPaymentIntentMobile(@Request() req:any,@Body() createPaymentDto:CreatePaymentDto) {
    return this.stripeService.createPaymentIntentMobile(req.user.id,createPaymentDto);
  }

  @Post('complete-payment')
  async completePayment(@Request() req:any, @Body() completePaymentDto: CompletePaymentDto) {
    return this.stripeService.completePayment(completePaymentDto, req.user.id);
  }

  @Post('complete-payment-mobile')
  @ApiOperation({ summary: 'Complete payment for mobile' })
  @ApiBody({ type: CompletePaymentDto })
  @ApiCreatedResponse({ description: 'Payment completed successfully',example:{ statusCode: 201, message: 'Order Placed Successfully' }})
  async completePaymentMobile(@Request() req:any, @Body() completePaymentDto: CompletePaymentDto) {
    return this.stripeService.completePaymentMobile(completePaymentDto, req.user.id);
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
