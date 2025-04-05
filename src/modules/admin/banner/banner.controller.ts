import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  ParseFilePipeBuilder,
  Get,
  Delete,
  Param,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { AddBannerDto } from './dto/addBanner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly banner: BannerService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('files', 2)) // Accepts 2 files
  async uploadBanner(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/jpeg|image/png|image/svg+xml|image/webp' })
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 }) // 10MB limit
        .build(),
    )
    files: Express.Multer.File[],
    
    @Body() body: AddBannerDto
  ) {
    console.log("inside controller")
    if (files.length !== 2) {
      throw new BadRequestException('Both mobile and default images are required');
    }

    const mobileFile = files[1]
    const defaultFile = files[0]

    if (!mobileFile || !defaultFile) {
      throw new BadRequestException('Both mobile and default images must be provided');
    }

    return this.banner.addBanner(mobileFile, defaultFile, body);
  }
  @Get()
  async getBanner() {
    return this.banner.getBanners();
  }

  @Delete(":id")
  async deleteBanner(@Param("id") id : string) {
    return this.banner.deleteBanner(id);
  }
}
