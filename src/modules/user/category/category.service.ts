import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { gender } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(genderData:string) {
        console.log("gender",genderData)
        try {
            const res = await this.prisma.category.findMany({where:{
                gender:genderData as gender
            }});
            console.log("caegory",res)
            return { statusCode: 200, message: 'Categories Fetched Successfully', data: res || [] };
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
