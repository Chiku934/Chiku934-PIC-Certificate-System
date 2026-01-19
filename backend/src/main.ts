import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
  });

  // For development, backend only serves API, frontend is served separately

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on port', process.env.PORT ?? 3000);
}
bootstrap();
