import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { getProductDto } from './dto/getProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(query: getProductDto,userId?:string) {
    try {
      const AND = [];
      let wishlist = {}

      if(userId){
        wishlist =  {
          where:{
            userId:userId
          }
        }
      }
      if (query.categoryId) {
        AND.push({ categoryId: query.categoryId });
      }
      if (query.search) {
        AND.push({
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        });
      }
      if (query.gender) {
        AND.push({ gender: query.gender });
      }
      const products = await this.prisma.product.findMany({
        where: {
          AND: [...AND],
        },
        include: {
          category: true,
          product_inventory: true,
          wishlist:{...wishlist}
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (+query.page - 1) * +query?.size,
        take: +query.size,
      });

      console.log(query.userEmail,"Email")
      if(query.userEmail){
        const wishlist = await this.prisma.wishlist.findMany({
          where: {
            user:{
              email:query.userEmail
            }
          },
          include: {
            product: {
              select:{
                id:true
              }
            },
          },
        });
        console.log("wishilist",wishlist)
        return {
          statusCode: 200,
          message: 'Products Fetched Successfully',
          data: products,
          wishlist:wishlist
        };
      }
      return {
        statusCode: 200,
        message: 'Products Fetched Successfully',
        data: products,
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async findTrendingProducts() {
    try {
      const res = await this.prisma.product.findMany({include:{product_inventory:true,category:true},where:{isTrending:true}});
console.log(res)
      return {
        statusCode: 200,
        data: res,
        message: 'Products Fetched Successfully',
      };
    } catch (error) {
        console.log(error)
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async findSingleProduct(name: string) {
    try {
      const res = await this.prisma.product.findFirst({
        where: {
          id: name,
        },
        include: {
          category: true,
          product_images:true,
          product_inventory: {
            include: {
              size: true,
            },
          },
        },
      });
      const findAllProducts = await this.prisma.product.findMany({
        where: { title: res.title },
        select: {
          id: true,
          color: true,
          imageUrl: true,
        },
      });
      if (res) {
        return {
          statusCode: 200,
          message: 'Product Fetched Successfully',
          data: { ...res, availableColors: findAllProducts },
        };
      } else {
        throw new BadRequestException('Product Not Found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }
}
