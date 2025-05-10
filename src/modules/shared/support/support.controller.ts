import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@Controller('support')
@UseGuards(AuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  findAll() {
    return this.supportService.findAll();
  }

  @Post()
  createTicket(@Request() req:any,@Body() body) {
    return this.supportService.createTicket(req?.user?.id,body);
  }
}
