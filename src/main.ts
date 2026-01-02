import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * ✅ GLOBAL VALIDATION
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * ✅ CORS (Swagger + Frontend safe)
   *
   * - Allows localhost, 127.0.0.1, and deployed frontend
   * - Fixes "Failed to fetch" in Swagger
   */
  app.enableCors({
    origin: true, // 👈 reflects request origin safely
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  /**
   * ✅ SWAGGER (JWT AUTH ENABLED)
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Internet Business Manager API')
    .setDescription(
      'Backend API for authentication, managers, subscribers, payments, audit logs, and health checks',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  /**
   * ✅ SERVER
   */
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://127.0.0.1:${port}`);
  console.log(`📘 Swagger docs available at http://127.0.0.1:${port}/api`);
}

bootstrap();