import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
  });

  // Get the Express instance and serve static files
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.static(join(__dirname, '..', '..', 'frontend', 'src')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
