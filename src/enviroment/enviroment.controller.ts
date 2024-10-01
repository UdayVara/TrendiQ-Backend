import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { EnviromentService } from './enviroment.service';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { AuthGuard } from 'src/guards/authguard/auth.guard';

@UseGuards(AuthGuard)
@Controller('enviroment')
export class EnviromentController {
  constructor(private readonly enviromentService: EnviromentService) {}

  @Post()
  create(@Body() createEnviromentDto: CreateEnviromentDto,@Request() req) {
    return this.enviromentService.create(createEnviromentDto,req.user.id);
  }

  @Get()
  findAll() {
    return this.enviromentService.findAll();
  }


  @Patch()
  update(@Body() updateEnviromentDto: UpdateEnviromentDto,@Request() req) {
    return this.enviromentService.update(updateEnviromentDto,req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.enviromentService.remove(id,req.user.id);
  }
}
