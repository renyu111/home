import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 启用CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3345',
    credentials: true,
  });
  
  // 静态文件服务
  app.useStaticAssets(join(process.cwd(), 'assets', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // 全局前缀
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3344;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();