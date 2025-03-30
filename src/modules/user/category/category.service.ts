import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        try {
            const res = await this.prisma.category.findMany();
            console.log("caegory",res)
            return { statusCode: 200, message: 'Categories Fetched Successfully', data: res || [] };
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
