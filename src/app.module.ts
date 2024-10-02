import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { EnviromentModule } from './enviroment/enviroment.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [CommonModule, AuthModule, EnviromentModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [CommonModule],
})
export class AppModule {}
