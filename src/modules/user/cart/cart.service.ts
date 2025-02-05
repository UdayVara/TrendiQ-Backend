import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCartDto: CreateCartDto, userId: string) {
    try {
      await this.prisma.cart.create({
        data: {
          quantity: createCartDto.quantity,
          productId: createCartDto.productId,
          product_inventoryId: createCartDto.inventoryId,
          userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Item Added to the Cart',
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async findAll(userId:string) {
    try {
      const res = await this.prisma.cart.findMany({
        where: {
          userId,
        },
        include:{
          product:true,
          product_inventory:{
            include:{
              size:true
            }
          }
        },
        orderBy:{
          createdAt:'desc'
        }
      })

      return {statusCode:200,message:"Cart items Fetched Successfully",data:res}
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Internal Server Error")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  async update( updateCartDto: UpdateCartDto,userId:string) {
    try {

      const checkAvailability = await this.prisma.product_inventory.findFirst({
        where:{
          id:updateCartDto.inventoryId,
        }
      })

      if(checkAvailability.stock - updateCartDto.quantity < checkAvailability.minimum_stock){
        throw new BadRequestException("Not enough stock Available")
      }
      await this.prisma.cart.updateMany({
        where: {
          id: updateCartDto.cartId,
          userId,
        },
        data: {
          quantity: updateCartDto.quantity,
          product_inventoryId: updateCartDto.inventoryId,
        },
      }) 

      return {statusCode:201,message:"Cart Updated Successfully"}
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Internal Server Error")
    }
  }

  async remove(cartId:string,userId:string) {
    try {
      await this.prisma.cart.delete({
        where: {
          id: cartId,
          userId,
        },
      })

      return {
        statusCode:201,
        message:"Cart Item Deleted Successfully",
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Internal Server Error")
    }
  }
}
