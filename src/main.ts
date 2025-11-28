import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || 3000;

  await app.listen(port);

  // If SERVER_BASE_URL is not set yet, fallback to localhost for now
  const serverUrl = process.env.SERVER_BASE_URL || `http://localhost:${port}`;
  console.log(`Backend running at ${serverUrl}`);
}

bootstrap();