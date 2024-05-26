import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { env } from "~/config/env";

import { AppModule } from "./app.module";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.register(fastifyCors, {
    origin: [env.HTTP_FRONTEND_ALLOWED],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
  });
  app.register(fastifyHelmet);
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: 1000 * 60 * 1, // milliseconds * seconds * minutes,
    ban: 1,
  });
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET_KEY,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "10m",
    },
  });
  app.register(fastifyCookie);

  await app.listen(env.HTTP_SERVER_PORT);
}
bootstrap();
