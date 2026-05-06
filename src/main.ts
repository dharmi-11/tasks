import 'reflect-metadata';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const express = require('express');
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(express.static(join(process.cwd(), 'public')));

  await app.listen(port, '0.0.0.0');
  console.log(`Tasks API is running on http://localhost:${port}`);
}

void bootstrap();
