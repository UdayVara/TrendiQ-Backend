import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { EnviromentModule } from './enviroment/enviroment.module';
import { CategoryModule } from './category/category.module';
import { SizeModule } from './size/size.module';

@Module({
  imports: [CommonModule, AuthModule, EnviromentModule, CategoryModule, SizeModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [CommonModule],
})
export class AppModule {}
