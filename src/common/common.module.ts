import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "randomJWTSecret",
    }),
    MulterModule.register({dest:"./uploads"}),
  ],
  providers: [PrismaService, CloudinaryService],
  exports: [PrismaService, CloudinaryService],
})
export class CommonModule {}
