import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import promBundle from 'express-prom-bundle';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const express = require('express');
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);

  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
  });

  server.use(metricsMiddleware);

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();