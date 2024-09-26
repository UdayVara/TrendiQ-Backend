import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly prisma:PrismaService) {}

  @Get()
  async getHello(): Promise<string> {
    const res = await this.prisma.temp.create({
      data:{
        name:"Test"
      }
    })
    return this.appService.getHello();
  }
}
