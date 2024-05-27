// import fastifyCookie from "@fastify/cookie";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { NestFactory } from "@nestjs/core";

import { env } from "~/config/env";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.enableCors({
    origin: [env.HTTP_FRONTEND_ALLOWED],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH"],
  });
  app.use(helmet());
  app.use(cookieParser());

  app.listen(env.HTTP_SERVER_PORT);
  // await app.register(fastifyJwt, {
  //   secret: env.JWT_SECRET_KEY,
  //   cookie: {
  //     cookieName: "refreshToken",
  //     signed: false,
  //   },
  //   sign: {
  //     expiresIn: "10m",
  //   },
  // });
  // if (!error.statusCode || error.statusCode === 500) {
  //   return HttpPresenter.internal(reply, {
  //     message: "Internal server error.",
  //   });
  // }

  // if (error.statusCode === 429) {
  //   return HttpPresenter.tooManyRequests(reply, {
  //     message: "Too many requests.",
  //   });
  // }

  // if (error instanceof ZodError) {
  //   return HttpPresenter.unprocessableEntity(reply, {
  //     message: "Validation error.",
  //     issues: error.flatten().fieldErrors,
  //   });
  // }

  // return HttpPresenter.unknown(reply, error.statusCode, {
  //   message: error.message,
  // });
}
bootstrap();
