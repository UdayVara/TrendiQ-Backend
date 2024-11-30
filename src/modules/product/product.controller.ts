import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post("/image/upload")
  @UseInterceptors(FileInterceptor('file',{
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    if(!file){
      throw new BadRequestException("File is Required")
    }
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.url };
  }


  @Delete("/image")
  async deleteImage(@Body("publicId") publicId: string) {
    const result = await this.cloudinaryService.deleteImage(publicId);
    return { url: result.result };
  }

  @Get()

/**
 * Retrieves a list of all products.
 *
 * @returns A promise that resolves to an array of products.
 */
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
