import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import promBundle from 'express-prom-bundle';
import cluster from 'cluster';
import * as os from 'os';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const express = require('express');
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
  });

  server.use(metricsMiddleware);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Головний процес (master) ${process.pid} запущено.`);
  console.log(`Використовуємо ${numCPUs} ядер процесора.`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(
      `Процес-робітник (worker) ${worker.process.pid} помер. Перезапускаємо...`,
    );
    cluster.fork();
  });
} else {
  bootstrap();
}