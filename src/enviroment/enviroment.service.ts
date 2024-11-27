import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class EnviromentService {
  constructor(private prisma: PrismaService) {}
  async create(createEnviromentDto: CreateEnviromentDto, userId: string) {
    try {
      const newEnviroment = await this.prisma.enviroment.create({
        data: {
          key: createEnviromentDto.key,
          value: createEnviromentDto.value,
          userId,
        },
      });

      if (newEnviroment) {
        return { statusCode: 201, message: 'Enviroment Updated Successfully' };
      } else {
        throw new InternalServerErrorException('Unexpected Error Occured');
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const enviroments = await this.prisma.enviroment.findMany()

      return {statusCode:200,message:"Enviroments Fetched Successfully",data:enviroments}
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }



  async update(updateEnviromentDto: UpdateEnviromentDto, userId: string) {
    try {
      const newEnviroment = await this.prisma.enviroment.update({
        where: {
          id: updateEnviromentDto.id,
        },
        data: {
          key: updateEnviromentDto.key,
          value: updateEnviromentDto.value,
          userId,
        },
      });

      if (newEnviroment) {
        return { statusCode: 201, message: 'Enviroment Created Successfully' };
      } else {
        throw new InternalServerErrorException('Unexpected Error Occured');
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string[],user:string) {
    try {
      const deletedEnviroment = await this.prisma.enviroment.deleteMany({
        where:{
          id:{
            in:id
          },
          userId:user
        }
      })

      if(deletedEnviroment){
        return {statusCode:201,message:"Enviroment Deleted Successfully"}
      }else{
        return {statusCode:500,message:"Unexpected Error Occured"}
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
