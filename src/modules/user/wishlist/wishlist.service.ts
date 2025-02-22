import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AddWishlistDto } from './dto/addWishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async addWishlist(addWishlistDto: AddWishlistDto, userId: string) {
    try {
      await this.prisma.wishlist.create({
        data: {
          productId: addWishlistDto.productId,
          userId: userId,
        },
      });

      return { statusCode: 201, message: 'Item Added to the Wishlist' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal server Error");
    }
  }

  async getWishlist(userId: string) {
    try {
      const res = await this.prisma.wishlist.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true,
        },
      });

      return { statusCode: 200, data: res,message:"Wishlist Fetched Successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal server Error");
    }
  }

  async deleteWishlist(id: string, userId: string) {
    try {
      const res = await this.prisma.wishlist.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      console.log(res);
      if (res) {
        return { statusCode: 201, message: 'Item Deleted Successfully' };
      } else {
        throw new InternalServerErrorException('Failed to Delete');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal server Error");
    }
      }
}
