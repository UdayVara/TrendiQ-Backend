import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, ParseFilePipeBuilder, HttpStatus, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createCategoryDto: CreateCategoryDto,@UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpeg|png|svg|jpg|webp)$/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 }) // 5MB max size per file
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File) {
      
    return this.categoryService.create(createCategoryDto,file);
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
  @UseInterceptors(FileInterceptor('file'))
  update( @Body() updateCategoryDto: UpdateCategoryDto,@UploadedFile() file: Express.Multer.File | null) {
    return this.categoryService.update(updateCategoryDto,file);
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
