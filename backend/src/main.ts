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

  // Serve static files from frontend
  const frontendPath = join(process.cwd(), 'frontend', 'src');
  console.log('Serving static files from:', frontendPath);
  expressApp.use(express.static(frontendPath));

  // Serve index.html for all non-API routes (SPA fallback)
  expressApp.get('*', (req, res, next) => {
    // Skip API routes (users, setup, etc.)
    if (req.path.startsWith('/users') ||
        req.path.startsWith('/setup') ||
        req.path.startsWith('/equipment') ||
        req.path.startsWith('/location') ||
        req.path.startsWith('/certificate')) {
      return next();
    }
    res.sendFile(join(frontendPath, 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on port', process.env.PORT ?? 3000);
}
bootstrap();
