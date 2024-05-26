import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { env } from "~/config/env";

import { AppModule } from "./app.module";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableCors({
    origin: [env.HTTP_FRONTEND_ALLOWED],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
  });
  await app.register(fastifyHelmet);
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET_KEY,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "10m",
    },
  });
  await app.register(fastifyCookie);

  await app.listen(env.HTTP_SERVER_PORT);
}
bootstrap();
