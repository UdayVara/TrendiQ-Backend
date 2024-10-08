import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly prisma:PrismaService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
