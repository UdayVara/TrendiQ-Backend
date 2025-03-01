import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSizeDto: CreateSizeDto) {
    try {
      const res = await this.prisma.size.create({
        data: {
          name: createSizeDto.name,
          description: createSizeDto.description,
          categoryId: createSizeDto.category,
        },
        include: {
          category:true
        }
      });

      if (res) {
        return {
          statusCode: 201,
          message: 'Size Created Successfully.',
          newSize: res,
        };
      } else {
        return { status: 500, message: 'Unexpected Error Occured.' };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unexpected Error Occured');
    }
  }

  async findAll() {
    try {
      const sizes = await this.prisma.size.findMany({
        orderBy: {
          updatedAt: 'asc',
        },
        include: {
          category: true,
        },
      });

      return {
        statusCode: 200,
        message: 'Sizes Fetched Successfully',
        sizes: sizes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Unexpected Error Occured');
    }
  }
  async getSizesByCategory(id: string) {
    try {
      const res = await this.prisma.size.findMany({
        where:{
          categoryId:id
        }
      })

      return {
        statusCode: 200,
        message: 'Sizes Fetched Successfully',
        sizes: res,
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Unexpected Error Occured");
    }
  }

  async update(updateSizeDto: UpdateSizeDto) {
    try {
      const res = await this.prisma.size.update({
        where: {
          id: updateSizeDto.sizeId,
        },
        data: {
          name: updateSizeDto.name,
          description: updateSizeDto.description,
          categoryId: updateSizeDto.category,
        },
      });

      if (res) {
        return {
          statusCode: 201,
          message: 'Size Updated Successfully',
          updatedCategory: res,
        };
      } else {
        return { statusCode: 500, message: 'Failed To Update' };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Unexpected Error Occured',
      );
    }
  }

  async   remove(id: string[]) {
    try {
      const res = await this.prisma.size.deleteMany({
        where:{
          id:{
            in:id
          },
          
        }
      });

      if (res) {
        return { statusCode: 201, message: 'Size Deleted Successfully' };
      } else {
        throw new InternalServerErrorException('Failed to Delete');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Exception',
      );
    }
  }
}
