import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CompletePaymentDto } from './dto/completePayment.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createPaymentIntent(userId: string) {
    try {
      const cart = await this.prisma.cart.findMany({
        where: {
          userId: userId,
        },
        include: {
          product_inventory: true,
        },
      });

      const total = cart.reduce((acc, item) => {
        return (
          acc +
          item.quantity *
            (item.product_inventory?.price -
              (item.product_inventory?.discount *
                item.product_inventory?.price) /
                100)
        );
      }, 0);
      // Create a PaymentIntent and return the client_secret
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.floor((total - (total * 18) / 100) * 100),
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
        metadata: { userId },  // Let Stripe handle payment methods
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('Stripe Payment Error:', error);
      throw new Error(error.message);
    }
  }



  async completePayment(
    completePaymentDto: CompletePaymentDto,
    userId: string,
  ) {
    try {
      const orderId = uuid() + new Date().getDate();
      const cart = await this.prisma.cart.findMany({
        where: {
          userId: userId,
        },
        include: {
          product_inventory: true,
          product: true,
        },
      });
     
      const arr = [];
      cart.forEach((item) => {
        const discountAmount =
          (item.product_inventory?.discount * item.product_inventory?.price) /
          100;
        const totalAmount =
          item.quantity * (item.product_inventory?.price - discountAmount);
        const gst = (totalAmount * 18) / 100;

        arr.push({
          orderId: orderId,
          amount: totalAmount,
          finalAmount: totalAmount + gst,
          quantity: item.quantity,
          sizeId:item.product_inventory?.sizeId,
          color:item.product.color,
          productId: item.product.id,
          shippingAddress: completePaymentDto.shippingId,
          userId: userId,
        });
      });
      await this.prisma.order.createMany({
        data: arr,
      });
      await this.prisma.cart.deleteMany({
        where: {
          userId: userId,
        },
      });

      return {statusCode:201,message:"Order Placed Successfully"}
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        "Order Failed, Please Try Again",
      );
    }
  }

  async myOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
        },
        select:{
          orderId:true,
          finalAmount:true,
          createdAt:true,
          status:true,
          size:{
            select:{
              name:true,
            }
          },
          product:{
            select:{
              imageUrl:true,
              title:true,
              description:true,
              color:true,

            }
          },
          address:{
            select:{
              address:true,
              name:true
            }
          }
        },
       
      });

      const groupedOrders = Object.values(
        orders.reduce((acc, order) => {
            if (!acc[order.orderId]) {
                acc[order.orderId] = {
                    orderId: order.orderId,
                    finalAmount: 0,
                    createdAt: order.createdAt,
                    status: order.status,
                    address: order.address, // Pick the first address
                    products: []
                };
            }
            acc[order.orderId].finalAmount += order.finalAmount;
            acc[order.orderId].products.push({
                size: order.size,
                price:order.finalAmount,
                ...order.product
            });
    
            return acc;
        }, {}))
      console.log(orders)
      return { statusCode: 200, message: 'Orders Fetched Successfully', data: groupedOrders };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }


  async getOrderById(userId:string,orderId:string){
    try {
      const res = await this.prisma.order.findFirst({
        where:{
          orderId:orderId,
          userId:userId
        },
        include:{
          product:true,
        }
      })

      if(!res){
        throw new NotFoundException("Order Not Found")
      }

      return {statusCode:200,message:"Order Fetched Successfully",data:res}
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal Server Error")
    }
  }
}
