import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { EnviromentService } from './enviroment.service';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { AuthGuard } from 'src/guards/authguard/auth.guard';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('enviroment')
@ApiTags("Enviroment")
export class EnviromentController {
  constructor(private readonly enviromentService: EnviromentService) {}

  @Post()
  @ApiBody({
    description: 'Create Enviroment Variable',
    required: true,
    schema:{
      type:"object",
      properties:{
        key:{type:"string"},
        value:{type:"string"}
      }
    }
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Enviroment Variable Added Successfully.',
      newEnviroment: {},
    },
  })
  create(@Body() createEnviromentDto: CreateEnviromentDto,@Request() req) {
    return this.enviromentService.create(createEnviromentDto,req.user.id);
  }

  @Get()
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Get All Enviroments',
      enviroments: [],
    }
  })
  findAll() {
    return this.enviromentService.findAll();
  }


  @Patch()
  @ApiBody({
    description: 'Update Enviroment Variable',
    required: true,
    schema:{
      type:"object",
      properties:{
        key:{type:"string"},
        value:{type:"string"},
        id:{type:"string"}
      }
    }
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Enviroment Updated Successfully',
    }
  })
  update(@Body() updateEnviromentDto: UpdateEnviromentDto,@Request() req) {
    return this.enviromentService.update(updateEnviromentDto,req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Deleted Enviroment Successfully',
    }
  })
  remove(@Param('id') id: string,@Request() req) {
    return this.enviromentService.remove(id.split(",") || [],req.user.id);
  }
}
