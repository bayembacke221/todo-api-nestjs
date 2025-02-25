import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration globale pour la validation des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non autorisées
      transform: true, // Transforme automatiquement les types primitifs
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
