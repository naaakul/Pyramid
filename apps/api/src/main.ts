import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import { AppModule } from './app.module';

const server = express();

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/v1');
  await app.init();
  return server;
}

let cachedServer: express.Express | null = null;

export async function getServer() {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer;
}

if (process.env.VERCEL !== '1') {
  bootstrapServer().then((s) => s.listen(process.env.PORT ?? 4000));
}