import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { Express, Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
  });

  // Get the Express instance and serve static files
  const expressApp = app.getHttpAdapter().getInstance() as Express;

  // Serve static files from frontend
  const frontendPath = join(__dirname, '..', '..', 'frontend', 'src');
  console.log('Serving static files from:', frontendPath);
  expressApp.use(express.static(frontendPath));

  // Handle SPA routing - serve index.html for non-API routes
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    // Skip API routes
    if (req.path.startsWith('/users') ||
        req.path.startsWith('/setup') ||
        req.path.startsWith('/equipment') ||
        req.path.startsWith('/location') ||
        req.path.startsWith('/certificate') ||
        req.path.startsWith('/auth')) {
      return next();
    }

    // For all other routes, serve the Angular app
    res.sendFile(join(frontendPath, 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on port', process.env.PORT ?? 3000);
}
bootstrap();
