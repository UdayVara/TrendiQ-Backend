import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAddressDto: CreateAddressDto, userId: string) {
    try {
      const addresses = await this.prisma.address.findMany({
        where: {
          userId: userId,
        },
      });
      await this.prisma.address.create({
        data: {
          ...createAddressDto,
          userId: userId,
          isDefault: addresses.length > 0 ? false : true,
        },
      });

      return { statusCode: 201, message: 'Address Added Successfully.' };
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }

  async updateDefault(addressId: string, userId: string) {
    try {
      await this.prisma.address.updateMany({
        where: {
          userId: userId,
        },
        data: {
          isDefault: false,
        },
      })

      await this.prisma.address.update({
        where: {
          id: addressId,
          userId: userId,
        },
        data: {
          isDefault: true,
        },
      });
      return { statusCode: 201, message: 'Default Address Updated Successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || "Unexpected Error Occured");
    }
  }

  async findAll(userId: string) {
    try {
      const res = await this.prisma.address.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
         isDefault:"desc"
        },
      });

      return {
        statusCode: 200,
        message: 'Address Fetched Successfully',
        data: res || [],
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(updateAddressDto: UpdateAddressDto, userId: string) {
    try {
      const {addressId,...rest} = updateAddressDto
      const res = await this.prisma.address.update({
        where: {
          id: addressId,
          userId: userId,
        },data:{
          ...rest,
          updatedAt: new Date()
        }
      });

      if(res){
        return {statusCode:201,message:"Address Updated Successfully"}
      }else{
        throw new BadRequestException("Address Does Not Exists.")
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error.',
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const res = await this.prisma.address.delete({
        where: {
          id: id,
          userId: userId,
        },  
      });

      if (res) {
        return { statusCode: 201, message: 'Address Deleted Successfully' };
      } else {
        return { statusCode: 403, message: 'Address Does Not Exists.' };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || 'Internal Server Error',
      );
    }
  }
}
