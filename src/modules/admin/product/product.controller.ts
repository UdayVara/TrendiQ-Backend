import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  Request,
  UseGuards,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import {FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/authguard/adminauth.guard';
import { UpdateStatusDto } from './dto/updateStatus.dto';
import { FetchForUser } from './dto/fetch-by-user.dto';
import { AddProductInventoryDto } from './dto/addInventory.dto';
import { UpdateProductInventoryDto } from './dto/updateInventory.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard)
@Post('/')
@UseInterceptors(FilesInterceptor('file', 10)) // 10 = max number of files allowed
async createFile(
  @Body() createProductDto: CreateProductDto,
  @UploadedFiles(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: /(jpeg|png|svg|jpg|webp)$/ })
      .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 }) // 5MB max size per file
      .build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
  )
  files: Express.Multer.File[],
  @Request() req: any,
) {
  if (!files || files.length === 0) {
    throw new BadRequestException('At least one file is required');
  }
  return this.productService.create(createProductDto, files, req.user.id);
}

 
  @UseGuards(AuthGuard)
  @Get("/admin")
  findAll() {
    return this.productService.findAll();
  }

  
  @Get("/")
  async findAllforUser(@Query() query:FetchForUser) {
    return this.productService.fetchForUser(query);
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('')
  @UseInterceptors(FilesInterceptor('file',10))
  update(
    @Body() updateProductDto: UpdateProductDto,
    
    @Request()
    req: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpeg|png|svg|jpg|webp)$/ })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build({
          fileIsRequired:false,

          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        
        }),
    )
    file?: Express.Multer.File[],
  ) {
    
    return this.productService.update(updateProductDto, file || null, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch("/status")
  async updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
    return this.productService.updateTrendingStatus(updateStatusDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get("/inventory/:id")
  findInventory(@Param('id') id: string) {
    return this.productService.findInventory(id);
  }

  @Post("/inventory/:id")
  addInventory(@Param('id') id: string,@Body() addProductInventoryDto:AddProductInventoryDto) {
    return this.productService.addInventory(id,addProductInventoryDto);
  }
  @Put("/inventory/:id")
  updateInventory(@Param('id') id: string,@Body() updateProductInventoryDto:UpdateProductInventoryDto) {
    return this.productService.updateInventory(id,updateProductInventoryDto);
  }
}
