import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/updateOrderStatus.dto';
import { orderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(private readonly prisma:PrismaService) {}

      async findAllTransaction() {
        try {
          const res = await this.prisma.transaction.findMany({
            include:{
                user:true
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
    
          return {
            statusCode: 200,
            message: 'Transactions Fetched Successfully',
            data: res,
          };
        } catch (error) {
          throw new InternalServerErrorException(
            error?.message || 'Internal Server Error',
          );
        }
      }

async findOneByID(orderId:string) {
  try {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        orderId: orderId
      },
      include: {
        address: true,
        product: true,
        size: true,
        user: true,
      }
    });

    const grouped = Object.values(
      orders.reduce((acc, order) => {
        if (!acc[order.orderId]) {
          acc[order.orderId] = {
            orderId: order.orderId,
            title: order.product.title,
            totalAmount: 0,
            totalDiscount: 0,
            finalAmount: 0,
            user: order.user,
            address: order.address,
            products: []
          };
        }

        const itemTotal = order.amount * order.quantity;
        const itemDiscount = order.discount ? (order.amount * order.discount / 100) * order.quantity : 0;
        const itemFinal = itemTotal - itemDiscount;

        acc[order.orderId].totalAmount += itemTotal;
        acc[order.orderId].totalDiscount += itemDiscount;
        acc[order.orderId].finalAmount += itemFinal;
        acc[order.orderId].status = order.status  ;
        acc[order.orderId].createdAt = order.createdAt  ;
        acc[order.orderId].products.push({
          title: order.product.title,
          imageUrl:order.product.imageUrl,
          amount: order.amount,
          discount: order.discount || 0,
          finalAmount: itemFinal,
          quantity: order.quantity,
          color: order.color,
          size: order.size.name
        });

        return acc;
      }, {} as Record<string, any>)
    );

    return {
      statusCode: 200,
      message: 'Orders Fetched Successfully',
      data: grouped[0]
    };
  } catch (error) {
    throw new InternalServerErrorException(error?.message || 'Internal Server Error');
  }
}


async findAll() {
  try {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        address: true,
        product: true,
        size: true,
        user: true
      }
    });

    const summary = Object.values(
      orders.reduce((acc, order) => {
        if (!acc[order.orderId]) {
          acc[order.orderId] = {
            username: order.user.username,
            email: order.user.email,
            orderId: order.orderId,
            totalAmount: 0,
            totalDiscount: 0,
            finalAmount: 0,
            createdAt: order.createdAt,
            status: order.status,
            address: order.address
          };
        }

        const itemTotal = order.amount * order.quantity;
        const itemDiscount = order.discount
          ? (order.amount * order.discount / 100) * order.quantity
          : 0;
        const itemFinal = itemTotal - itemDiscount;

        acc[order.orderId].totalAmount += itemTotal;
        acc[order.orderId].totalDiscount += itemDiscount;
        acc[order.orderId].finalAmount += itemFinal;

        return acc;
      }, {} as Record<string, any>)
    );

    return {
      statusCode: 200,
      message: 'Order Summary Fetched Successfully',
      data: summary
    };
  } catch (error) {
    throw new InternalServerErrorException(
      error?.message || 'Internal Server Error'
    );
  }
}


async updateOrderStatusById (updateOrderStatusDto:UpdateOrderStatusDto){
try {
  const findOrders = await this.prisma.order.findMany({
    where:{
      orderId:updateOrderStatusDto.orderId
    }
  })
   await this.prisma.orderUpdateHistory.create({
    data:{
      orderId:updateOrderStatusDto.orderId,
      from :findOrders[0].status as orderStatus || "pending",
      to :updateOrderStatusDto.status as orderStatus || "pending"
    }
  })
  const res  = await this.prisma.order.updateMany({
    data:{
      status:updateOrderStatusDto.status as orderStatus || "pending",
    },
    where:{
      orderId:updateOrderStatusDto.orderId
    }
  })

  return {
    statusCode:200,
    message:"Order Status Updated Successfully",
    data:res
  }
} catch (error) {
  throw new InternalServerErrorException(error?.message || "Internal Server Error")
}
}

}
