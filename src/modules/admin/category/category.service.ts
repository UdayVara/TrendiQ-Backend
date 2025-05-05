import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService, private cloudinary:CloudinaryService) {}
  async create(createCategoryDto: CreateCategoryDto,file: Express.Multer.File) {
    try {
      console.log(file)
      const result = await this.cloudinary.uploadImage(file,"/category");
      const res = await this.prisma.category.create({
        data: {
          name: createCategoryDto.name,
          description: createCategoryDto.description,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          gender: createCategoryDto.gender,
        },
      });

      if (res) {
        return {
          statusCode: 201,
          message: 'Category Created Successfully.',
          category: res,
        };
      } else {
        await this.cloudinary.deleteImage(result.public_id);
        return { status: 500, message: 'Unexpected Error Occured.' };
      }
    } catch (error) {
      console.log("Category Add",error)
      throw new InternalServerErrorException('Unexpected Error Occured');
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({orderBy:{
        updatedAt:"asc"
      }})

      return {statusCode:200,message:"Categories Fetched Successfully",categories:categories}
    } catch (error) {
      throw new InternalServerErrorException("Unexpected Error Occured")
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto,file:Express.Multer.File | null) {
    try {
      if(file){


      const cat = await this.prisma.category.findUnique({
        where:{
          id:updateCategoryDto.id
        }
      })
      await this.cloudinary.deleteImage(cat.publicId);

      const updImage = await this.cloudinary.uploadImage(file,"/category");
      const res = await this.prisma.category.update({
        where:{
          id:updateCategoryDto.id
        },
        data:{
          name:updateCategoryDto.name,
          description:updateCategoryDto.description,
          gender:updateCategoryDto.gender,
          imageUrl:updImage.secure_url,
          publicId:updImage.public_id
        }
      }) 

      if(res){
        return {statusCode:201,message:"Category Updated Successfully",category:res}
      }else{
        return {statusCode:500,message:"Failed To Update"}
      }      }else{
        const res = await this.prisma.category.update({
          where:{
            id:updateCategoryDto.id
          },
          data:{
            name:updateCategoryDto.name,
            description:updateCategoryDto.description,
            gender:updateCategoryDto.gender,
          }
        }) 
        if(res){
          return {statusCode:201,message:"Category Updated Successfully",category:res}
        }else{
          return {statusCode:500,message:"Failed To Update"}
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(error?.message || "Unexpected Error Occured")
    }
  }

  async remove(id: string[]) {
    try {
      const res = await this.prisma.category.deleteMany({
        where:{
          id:{
            in:id
          }
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
