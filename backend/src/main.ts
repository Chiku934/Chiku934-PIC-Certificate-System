import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
  });

  // Serve static files from uploads directory
  const uploadsPath = join(__dirname, '..', '..', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on port', process.env.PORT ?? 3000);
}
bootstrap();
