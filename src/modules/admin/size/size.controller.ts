import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('size')
@ApiTags('Size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiBody({
    description: 'Create Size',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Size Created Successfully.',
      newSize: {},
    },
  })
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'Get All Size',
      sizes: [],
    },
  })
  findAll() {
    return this.sizeService.findAll();
  }


  @Get(':id')
  getSizesByCategory(@Param('id') id: string) {
    return this.sizeService.getSizesByCategory(id);
  }
  @Patch()
  @ApiBody({
    description: 'Update Size',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        sizeId: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Size Updated Successfully.',
      newCategory: {},
    },
  })
  update(@Body() updateSizeDto: UpdateSizeDto) {
    return this.sizeService.update(updateSizeDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Deleted Sizes Successfully',
    }
  })
  remove(@Param('id') id: string) {
    return this.sizeService.remove(id.split(",") || []);
  }
}
