import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastify from "fastify";
import { ZodError } from "zod";

import { env } from "~/config/env";

import { DatabaseConnection } from "../database/connection";

import { ROUTES } from "./routes";

export class App {
  private readonly RATE_LIMIT_TIME_WINDOW = 1000 * 60 * 1; // milliseconds * seconds * minutes
  private readonly ROUTES = ROUTES;
  public readonly instance = fastify({
    logger: true,
  });

  private registerRoutes() {
    this.ROUTES.forEach((route) => {
      this.instance.register(route);
    });
  }

  private registerPlugins() {
    this.instance.register(fastifyCors, {
      origin: [env.HTTP_FRONTEND_ALLOWED],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH"],
    });
    this.instance.register(fastifyHelmet);
    this.instance.register(fastifyRateLimit, {
      max: 100,
      timeWindow: this.RATE_LIMIT_TIME_WINDOW,
      ban: 1,
    });
    this.instance.register(fastifyJwt, {
      secret: env.JWT_SECRET_KEY,
      cookie: {
        cookieName: "refreshToken",
        signed: false,
      },
      sign: {
        expiresIn: "10m",
      },
    });
    this.instance.register(fastifyCookie);
  }

  public async start() {
    await DatabaseConnection.connect();

    this.registerPlugins();
    this.registerRoutes();
    this.setErrorHandler();

    return this.instance;
  }

  private setErrorHandler() {
    this.instance.setErrorHandler((error, _, reply) => {
      if (error.statusCode === 429) {
        return reply.status(429).send({
          message: "Too many requests.",
        });
      }

      if (error instanceof ZodError) {
        return reply.status(422).send({
          message: "Validation error.",
          issues: error.flatten().fieldErrors,
        });
      }

      console.log(error);

      return reply.status(500).send({
        message: "Internal server error.",
      });
    });
  }

  public async disconnect() {
    await DatabaseConnection.disconnect();

    await this.instance.close();
  }
}
