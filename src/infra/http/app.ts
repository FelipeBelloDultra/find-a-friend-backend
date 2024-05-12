import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastify from "fastify";
import { ZodError } from "zod";

import { env } from "~/config/env";

import { registerRoutes } from "./routes";

export const app = fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: [env.HTTP_FRONTEND_ALLOWED],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH"],
});
app.register(fastifyHelmet);
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: 1000 * 60 * 1, // milliseconds * seconds * minutes
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

registerRoutes(app);

app.setErrorHandler((error, _, reply) => {
  if (error.statusCode === 429) {
    return reply.status(429).send({
      message: "Too many requests.",
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.flatten().fieldErrors,
    });
  }

  console.log(error);

  return reply.status(500).send({
    message: "Internal server error.",
  });
});
