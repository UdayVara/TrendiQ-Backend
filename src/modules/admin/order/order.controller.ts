import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Get("/transactions")
  async findAllTransaction() {
    return this.orderService.findAllTransaction();
  }

  @Get(":id")
  async findOne(@Param("id") orderId:string) {
    return this.orderService.findOneByID(orderId);
  }

  @Get("")
  async findAll() {
    return this.orderService.findAll();
  }

  @Put("/update-status")
  async updateOrderStatus(@Body() updateOrderStatusDto:UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatusById(updateOrderStatusDto);
  }
}
