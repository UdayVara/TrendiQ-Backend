import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({
    global:true,
    secret: process.env.JWT_SECRET,
  })],
  providers: [PrismaService],
  exports:[PrismaService]
})
export class CommonModule {}
