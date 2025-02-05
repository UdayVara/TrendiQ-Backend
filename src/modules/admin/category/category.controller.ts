import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';

@Controller('category')
@UseGuards(AuthGuard)
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({
    description: 'Create Category',
    required: true,
    schema:{
      type:"object",
      properties:{
        name:{type:"string"},
        description:{type:"string"}
      }
    }
  })
  @ApiCreatedResponse({
    example: {
      statusCode: 201,
      message: 'Category Successfully.',
      newCategory: {},
    },
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    example: {
      statusCode: 200,
      message: 'All Categories',
      categories: [],
    }
  })
  findAll() {
    return this.categoryService.findAll();
  }


  @Patch()
  @ApiBody({
    description: 'Update Category',
    required: true,
    schema:{
      type:"object",
      properties:{
        name:{type:"string"},
        description:{type:"string"},
        categoryId:{type:"string"}
      }
    }
  })
  @ApiOkResponse({
    example:{
      statusCode:201,
      message:"Category Updated Successfully"
    }
  })
  update( @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    example: {
      statusCode: 201,
      message: 'Deleted Sizes Successfully',
    }
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id.split(",") || []);
  }
}
