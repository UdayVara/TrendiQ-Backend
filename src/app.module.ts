import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnviromentModule } from './modules/enviroment/enviroment.module';
import { CategoryModule } from './modules/category/category.module';
import { SizeModule } from './modules/size/size.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [CommonModule, AuthModule, EnviromentModule, CategoryModule, SizeModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [CommonModule],
})
export class AppModule {}
