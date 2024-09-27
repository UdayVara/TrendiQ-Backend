import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './Filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/v1");
  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
  .setTitle('TrendiQ')
  .setDescription('The TrendiQ API description')
  .setVersion('1.0')
  .addTag('TrendiQ')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);
  await app.listen(5643);
}
bootstrap();
