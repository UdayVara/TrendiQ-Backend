import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CompletePaymentDto } from './dto/completePayment.dto';
import { v4 as uuid } from 'uuid';
import { orderStatus } from '@prisma/client';
import { CreatePaymentDto } from './dto/createPayment.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createPaymentIntent(
    userId: string,
    createPaymentDto: CreatePaymentDto,
  ) {
    try {
      const cart = await this.prisma.cart.findMany({
        where: {
          userId: userId,
        },
        include: {
          product_inventory: true,
          product: true,
        },
      });
      let isOutOfstock = false;
      for (const item of cart) {
        const inventory = await this.prisma.product_inventory.findFirst({
          where: {
            id: item.product_inventory.id,
          },
        });

        if (inventory.stock - item.quantity < inventory.minimum_stock) {
          console.log('Out of stock');
          isOutOfstock = true;
          break; // Stop loop early if out of stock
        }
      }

      if (isOutOfstock) {
        return { statusCode: 400, message: 'Item Out of Stock' };
      }
      const id = uuid();
      const orderData: any = await Promise.all<any>(
        cart.map(async (item) => {
          await this.prisma.product_inventory.update({
            where: {
              id: item.product_inventory.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
          return {
            quantity: item.quantity,
            productId: item.product.id,
            amount: item.product_inventory?.price,
            color: item.product.color,
            product_inventoryId: item.product_inventory.id,
            finalAmount:
              item.product_inventory?.price -
              (item.product_inventory?.discount *
                item.product_inventory?.price) /
                100,
            status: 'pending',
            sizeId: item.product_inventory?.sizeId,
            discount: item.product_inventory?.discount,
            shippingAddress: createPaymentDto.shippingId,
            orderId: id,
            userId,
          };
        }),
      );
      console.log('OrderData', orderData);
      await this.prisma.order.createMany({ data: orderData });
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
      console.log('Total', total);
      const res = await this.prisma.transaction.create({
        data: {
          amount: total,
          status: 'pending',
          paymentStatus: 'pending',
          sessionId: 'pending',
          orderId: id,
          userId,
        },
      });
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        currency: 'inr',

        line_items: cart.map((item) => {
          const discountedPrice = Math.floor(
            item.product_inventory?.price -
              (item.product_inventory?.discount *
                item.product_inventory?.price) /
                100,
          );

          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: item.product.title,
              },
              unit_amount: Math.floor(discountedPrice * 1.18) * 100, // amount in paisa
            },
            quantity: item.quantity, // ✅ correctly placed here
          };
        }),
        success_url: `${process.env.FRONTEND_URL}/verification?action=success&token=${res.id}`,
        cancel_url: `${process.env.FRONTEND_URL}/verification?action=cancel&token=${res.id}`,
      });

      await this.prisma.transaction.update({
        where: { id: res.id },
        data: {
          sessionId: session.id,
          status: session.status,
          paymentStatus: session.payment_status,
        },
      });
      // res.json({ url: session.url })
      // // Create a PaymentIntent and return the client_secret
      // const paymentIntent = await this.stripe.paymentIntents.create({
      //   amount: Math.floor((total - (total * 18) / 100) * 100),
      //   currency: 'inr',
      //   automatic_payment_methods: { enabled: true },
      //   metadata: { userId },  // Let Stripe handle payment methods
      // });

      return {
        url: session.url,
        statusCode: 200,
        message: 'Checkout Session Created Successfully',
      };
    } catch (error) {
      console.error('Stripe Payment Error:', error);
      throw new Error(error.message);
    }
  }
async createPaymentIntentMobile(
  userId: string,
  createPaymentDto: CreatePaymentDto,
) {
  try {
    const cart = await this.prisma.cart.findMany({
      where: {
        userId: userId,
      },
      include: {
        product_inventory: true,
        product: true,
      },
    });

    let isOutOfstock = false;
    for (const item of cart) {
      const inventory = await this.prisma.product_inventory.findFirst({
        where: {
          id: item.product_inventory.id,
        },
      });

      if (inventory.stock - item.quantity < inventory.minimum_stock) {
        console.log('Out of stock');
        isOutOfstock = true;
        break;
      }
    }

    if (isOutOfstock) {
      return { statusCode: 400, message: 'Item Out of Stock' };
    }

    const id = uuid();
    const orderData: any = await Promise.all<any>(
      cart.map(async (item) => {
        await this.prisma.product_inventory.update({
          where: {
            id: item.product_inventory.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
        return {
          quantity: item.quantity,
          productId: item.product.id,
          amount: item.product_inventory?.price,
          color: item.product.color,
          product_inventoryId: item.product_inventory.id,
          finalAmount:
            item.product_inventory?.price -
            (item.product_inventory?.discount *
              item.product_inventory?.price) /
              100,
          status: 'pending',
          sizeId: item.product_inventory?.sizeId,
          discount: item.product_inventory?.discount,
          shippingAddress: createPaymentDto.shippingId,
          orderId: id,
          userId,
        };
      }),
    );

    await this.prisma.order.createMany({ data: orderData });

    const total = cart.reduce((acc, item) => {
      const discountedPrice =
        item.product_inventory?.price -
        (item.product_inventory?.discount * item.product_inventory?.price) / 100;

      return acc + item.quantity * discountedPrice;
    }, 0);

    const taxAppliedTotal = Math.floor(total * 1.18); // apply 18% GST

    const res = await this.prisma.transaction.create({
      data: {
        amount: taxAppliedTotal,
        status: 'pending',
        paymentStatus: 'pending',
        sessionId: 'pending',
        orderId: id,
        userId,
      },
    });

    // ✅ Stripe Payment Intent instead of Checkout Session
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: taxAppliedTotal * 100, // amount in paisa
      currency: 'inr',
      metadata: {
        userId,
        orderId: id,
        transactionId: res.id,
      },
      automatic_payment_methods: { enabled: true },
    });

    await this.prisma.transaction.update({
      where: { id: res.id },
      data: {
        sessionId: paymentIntent.id,
        status: paymentIntent.status,
        paymentStatus: paymentIntent.status,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      statusCode: 200,
      message: 'PaymentIntent Created Successfully',
    };
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
      const res = await this.prisma.transaction.findFirst({
        where: {
          id: completePaymentDto.transactionId,
        },
      });

      if (!res) {
        throw new NotFoundException('Transaction Not Found');
      }

      const orderItems = await this.prisma.order.findMany({
        where: {
          orderId: res.orderId,
        },
        include: {
          product_inventory: true,
        },
      });

      if (!orderItems) {
        throw new NotFoundException('Order Not Found');
      }

      for (const item of orderItems) {
        const remainingStock = item.product_inventory?.stock - item.quantity;
        const minStock = item.product_inventory?.minimum_stock ?? 0;

        if (remainingStock <= minStock) {
          const session = await this.stripe.checkout.sessions.retrieve(
            res.sessionId,
          );
          const paymentIntentId = session.payment_intent as string;
          await this.prisma.order.updateMany({
            where: {
              orderId: res.orderId,
            },
            data: {
              status: orderStatus.refunded,
            },
          });
          await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
          });

          throw new InternalServerErrorException(
            'Item out of stock, refund initiated',
          );
        }
      }

      await this.prisma.order.updateMany({
        where: {
          orderId: res.orderId,
        },
        data: {
          status: orderStatus.confirmed,
        },
      });

      const stripePayment = await this.stripe.checkout.sessions.retrieve(
        res.sessionId,
      );

      if (!stripePayment) {
        throw new InternalServerErrorException(
          'Payment Not Confirmed by Stripe',
        );
      }
      await this.prisma.cart.deleteMany({
        where: {
          userId: userId,
        },
      });
      this.prisma.transaction.updateMany({
        where: {
          id: completePaymentDto.transactionId,
        },
        data: {
          status: stripePayment.status,
          paymentStatus: stripePayment.payment_status,
        },
      });
      return { statusCode: 201, message: 'Order Placed Successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Order Failed, Please Try Again');
    }
  }

  async completePaymentMobile(
  completePaymentDto: CompletePaymentDto,
  userId: string,
) {
  try {
    const res = await this.prisma.transaction.findFirst({
      where: {
        id: completePaymentDto.transactionId,
      },
    });

    if (!res) {
      throw new NotFoundException('Transaction Not Found');
    }

    const orderItems = await this.prisma.order.findMany({
      where: {
        orderId: res.orderId,
      },
      include: {
        product_inventory: true,
      },
    });

    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException('Order Not Found');
    }

    // ✅ Retrieve PaymentIntent using sessionId (which is now paymentIntent.id)
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      res.sessionId,
    );

    if (!paymentIntent) {
      throw new InternalServerErrorException('Payment not found on Stripe');
    }

    for (const item of orderItems) {
      const remainingStock = item.product_inventory?.stock - item.quantity;
      const minStock = item.product_inventory?.minimum_stock ?? 0;

      if (remainingStock <= minStock) {
        await this.prisma.order.updateMany({
          where: {
            orderId: res.orderId,
          },
          data: {
            status: orderStatus.refunded,
          },
        });

        await this.stripe.refunds.create({
          payment_intent: paymentIntent.id,
        });

        throw new InternalServerErrorException(
          'Item out of stock, refund initiated',
        );
      }
    }

    await this.prisma.order.updateMany({
      where: {
        orderId: res.orderId,
      },
      data: {
        status: orderStatus.confirmed,
      },
    });

    // ✅ Clean up cart
    await this.prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    // ✅ Update transaction with paymentIntent status
    await this.prisma.transaction.updateMany({
      where: {
        id: completePaymentDto.transactionId,
      },
      data: {
        status: paymentIntent.status,
        paymentStatus: paymentIntent.status,
      },
    });

    return { statusCode: 201, message: 'Order Placed Successfully' };
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('Order Failed, Please Try Again');
  }
}

  async myOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
        },
        select: {
          orderId: true,
          finalAmount: true,
          createdAt: true,
          status: true,
          size: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              imageUrl: true,
              title: true,
              description: true,
              color: true,
            },
          },
          address: {
            select: {
              address: true,
              name: true,
            },
          },
        },
      });
      console.log('orders', orders);

      const groupedOrders = Object.values(
        orders.reduce((acc, order) => {
          if (!acc[order.orderId]) {
            acc[order.orderId] = {
              orderId: order.orderId,
              finalAmount: 0,
              createdAt: order.createdAt,
              status: order.status,
              address: order.address, // Pick the first address
              products: [],
            };
          }
          acc[order.orderId].finalAmount += order.finalAmount;
          acc[order.orderId].products.push({
            size: order.size,
            price: order.finalAmount,
            ...order.product,
          });

          return acc;
        }, {}),
      );
      console.log(orders);
      return {
        statusCode: 200,
        message: 'Orders Fetched Successfully',
        data: groupedOrders,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async getOrderById(userId: string, orderId: string) {
    try {
      const res = await this.prisma.order.findFirst({
        where: {
          orderId: orderId,
          userId: userId,
        },
        include: {
          product: true,
        },
      });

      if (!res) {
        throw new NotFoundException('Order Not Found');
      }

      return {
        statusCode: 200,
        message: 'Order Fetched Successfully',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Internal Server Error',
      );
    }
  }
}
