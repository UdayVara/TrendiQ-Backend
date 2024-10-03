import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const res = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
        },
      });

      if (res) {
        return {
          statusCode: 201,
          message: 'Category Created Successfully.',
          newCategory: res,
        };
      } else {
        return { status: 500, message: 'Unexpected Error Occured.' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Unexpected Error Occured');
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({})

      return {statusCode:200,message:"Categories Fetched Successfully",categories:categories}
    } catch (error) {
      throw new InternalServerErrorException("Unexpected Error Occured")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    try {
      const res = await this.prisma.category.update({
        where:{
          id:updateCategoryDto.id
        },
        data:{
          name:updateCategoryDto.name,
          description:updateCategoryDto.description
        }
      }) 

      if(res){
        return {statusCode:201,message:"Category Updated Successfully",updatedCategory:res}
      }else{
        return {statusCode:500,message:"Failed To Update"}
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Unexpected Error Occured")
    }
  }

  async remove(id: string) {
    try {
      const res = await this.prisma.category.delete({
        where:{
          id:id
        }
      })

      if(res){
        return {statusCode:201,message:"Category Deleted Successfully"}
      }else{
        throw new InternalServerErrorException("Failed to Delete")
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Internal Server Exception")
    }
  }
}
