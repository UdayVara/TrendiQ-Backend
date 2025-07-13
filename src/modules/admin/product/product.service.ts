import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { gender } from '@prisma/client';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { FetchForUser } from './dto/fetch-by-user.dto';
import { AddProductInventoryDto } from './dto/addInventory.dto';
import { UpdateProductInventoryDto } from './dto/updateInventory.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    file: Express.Multer.File[],
    userId: string,
  ) {
    try {
      const result = await this.cloudinaryService.uploadMultipleImages(file);
      const res = await this.prisma.product.create({
        data: {
          title: createProductDto.title,
          description: createProductDto.description,
          markupDescription:createProductDto.markupDescription,
          categoryId: createProductDto.categoryId,
          adminId: userId,
          imageUrl: result[0].secure_url,
          publicId: result[0].public_id,
          gender: createProductDto.gender as gender,
          isTrending:
            createProductDto.isTrending == 'true' ? true : false || false,
          color: createProductDto.color,
        },
      });

      if (res) {
        const res2 = await this.prisma.product_inventory.create({
          data: {
            productId: res.id,
            stock: +createProductDto.stock,
            minimum_stock: +createProductDto.minimumStock,
            price: +createProductDto.price,
            discount: +createProductDto.discount,
            sizeId: createProductDto.sizeId,
          },
        });

        await this.prisma.product_images.createMany({
          data: result.map((item) => ({
            productId: res.id,
            imageUrl: item.secure_url,
            publicId: item.public_id,
          })),
        })
        if (res2) {
          return {
            statusCode: 201,
            message: 'Product Created Successfully',
          };
        }
      } else {
        await this.cloudinaryService.deleteMultipleImages(result.map((item)=> item.public_id));
        return { statusCode: 500, message: 'Unexpected Error Occured' };
      }
    } catch (error) {
      throw new Error(error?.message || 'Unexpected Error Occured');
    }
  }

  async findAll() {
    try {
      const res = await this.prisma.product.findMany({
        include: {
          category: true,
          product_inventory: {
            include: {
              size: true,
            },
          },
        },
      });
      const result = res.flatMap((product) =>
        product.product_inventory.map((inventory) => ({
          productId: product.id,
          title: product.title,
          description: product.description,
          markupDescription: product.markupDescription,
          color: product.color,
          category: product.category,
          gender: product.gender,
          isTrending: product.isTrending,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          publicId: product.publicId,
          imageUrl: product.imageUrl,
          inventoryId: inventory.id,
          size: inventory.size,
          sizeName: inventory.size.name,
          price: inventory.price,
          stock: inventory.stock,
          discount: inventory.discount,
          minimumStock: inventory.minimum_stock,
        }
      )),
        
      );
      
      return {
        statusCode: 200,
        message: 'Products Fetched Successfully',
        data: result,
        originalData: res,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }

  async fetchForUser(query: FetchForUser) {
    try {
      const queryOptions = {};
      // console.log("query",query)
      if (
        query.categoryId &&
        query.categoryId != 'undefined' &&
        query.categoryId != ''
      )
        queryOptions['categoryId'] = query.categoryId;
      if (query.gender && query.gender != 'undefined' && query.gender != '')
        queryOptions['gender'] = query.gender;
      if (query.search && query.search != 'undefined' && query.search != '')
        queryOptions['title'] = query.search;
      const res = await this.prisma.product.findMany({
        where: {
          ...queryOptions,
        },
        include: {
          category: true,
          product_inventory: {
            include: {
              size:true
            }
          }
        },
        skip: (+query.page - 1) * +query?.size,
        take: +query.size,
      });
      return {
        statusCode: 200,
        message: 'Products Fetched Successfully',
        data: res || [],
      };
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }
  async findOne(id: string) {
    try {
      const res = await this.prisma.product.findFirst({
        where: {
          id: id,
        },
        include: {
          category: true,
          product_inventory: {
            include:{
              size:true
            }
          },
          order:{
            include:{
              user:true,
              size:true
            },
            take:5,
            orderBy:{
              createdAt:"desc"
            }
          }
        },
      });

      return {
        statusCode: 200,
        message: 'Product Fetched Successfully',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }

  async updateTrendingStatus(updateStatusDto: UpdateStatusDto) {
    try {
      const res = await this.prisma.product.update({
        where: {
          id: updateStatusDto.productId,
        },
        data: {
          isTrending: updateStatusDto.isTrending,
        },
      });

      if (res) {
        return {
          statusCode: 201,
          message: updateStatusDto.isTrending
            ? 'Product Moved To Trending'
            : 'Product Removed From Trending',
        };
      }

      throw new InternalServerErrorException('Failed to Update');
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async update(
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File[],
    userId: string,
  ) {
    try {
      let result;
      if (file.length != 0) {
        result = await this.cloudinaryService.uploadMultipleImages(file);
      }
      console.log(file,"file")
      const { productId } = updateProductDto;

      const createBody: any = {
        title: updateProductDto.title,
        description: updateProductDto.description,
        markupDescription:updateProductDto.markupDescription,
        categoryId: updateProductDto.categoryId || '',
        adminId: userId || '',
        color: updateProductDto.color,
        gender: updateProductDto.gender as gender,
        isTrending:
          updateProductDto.isTrending == 'true' ? true : false || false,
      };
      console.log(file);
      if (file.length != 0) {
        createBody.imageUrl = result[0].secure_url;
        createBody.publicId = result[0].public_id;

        await this.prisma.product_images.deleteMany({
          where:{
            productId:productId
          }
        })

        await this.prisma.product_images.createMany({
          data: result.map((item) => {
            return {
              imageUrl: item.secure_url,
              publicId: item.public_id,
              productId: productId
            }
          })
        })
      }
      const res = await this.prisma.product.update({
        where: {
          id: productId,
          adminId: userId,
        },
        data: createBody,
      });

      if (res) {
        if (!file) {
          await this.cloudinaryService.deleteImage(res.publicId);
        }
        return { statusCode: 201, message: 'Product Updated Successfully' };
      }

      throw new InternalServerErrorException('Failed To Update');
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }

  async remove(id: string) {
    try {
      const res = await this.prisma.product.deleteMany({
        where: {
          id: {
            in: id.split(','),
          },
        },
      });

      if (res) {
        // await this.cloudinaryService.deleteImage(res.publicId);
        return { statusCode: 200, message: 'Product Deleted Successfully' };
      }

      throw new InternalServerErrorException('Failed to Delete');
    } catch (error) {

      console.log(error)
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }

  async findInventory(id: string) {
    try {
      const res = await this.prisma.product_inventory.findMany({
        where: {
          productId: id,
        },
      });
      return {
        statusCode: 200,
        message: 'Inventory Fetched Successfully',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }

  async addInventory(id:string,addProductInventoryDto:AddProductInventoryDto){
    try {
      const res = await this.prisma.product_inventory.create({
        data:{
          sizeId:addProductInventoryDto.sizeId,
          discount:addProductInventoryDto.discount,
          minimum_stock:addProductInventoryDto.minimumStock,
          price:addProductInventoryDto.price,
          stock:addProductInventoryDto.stock,
          productId:id
        }
      })

      if(res){
        return {
          statusCode: 201,
          message: 'Inventory Added Successfully',
        };
      }else{
        throw new InternalServerErrorException('Failed to Add Inventory')
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal Server Error")
    }
  }
  async updateInventory(id:string,updateProductInventoryDto:UpdateProductInventoryDto){
    try {
      const res = await this.prisma.product_inventory.update({
        where:{
          id:updateProductInventoryDto.inventoryId
        },
        data:{
          sizeId:updateProductInventoryDto.sizeId,
          discount:updateProductInventoryDto.discount,
          minimum_stock:updateProductInventoryDto.minimumStock,
          price:updateProductInventoryDto.price,
          stock:updateProductInventoryDto.stock,
          productId:id
        }
      })

      if(res){
        return {
          statusCode: 201,
          message: 'Inventory Added Successfully',
        };
      }else{
        throw new InternalServerErrorException('Failed to Add Inventory')
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Internal Server Error")
    }
  }
}
