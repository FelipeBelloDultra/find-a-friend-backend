import "dotenv/config";

import { z } from "zod";

const ENVIRONMENT_SCHEMA = z.object({
  PASSWORD_SALT: z.coerce.number().default(6),
  DATABASE_URL: z.string(),
  HTTP_SERVER_PORT: z.coerce.number().default(3000),
  HTTP_FRONTEND_ALLOWED: z.string().default("http://localhost:3333"),
  JWT_SECRET_KEY: z.string(),
  NODE_ENV: z.enum(["production", "dev", "test"]).default("dev"),
  DEFAULT_LOGO_PLACEHOLDER: z.string(),
  MAIL_HOST: z.string().default("mailpit"),
  MAIL_PORT: z.coerce.number().default(1025),
  MAIL_USERNAME: z.string().default("admin"),
  MAIL_PASSWORD: z.string().default("admin"),
  MAIL_FROM_ADDRESS: z.string().default("contact@find-a-friend.app"),
  MAIL_FROM_NAME: z.string().default("FindAFriend"),
  REDIS_HOST: z.string().default("redis"),
  REDIS_PORT: z.coerce.number().default(6379),
});

const parsedEnv = ENVIRONMENT_SCHEMA.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid env var: ${JSON.stringify(parsedEnv.error.formErrors.fieldErrors, undefined, 2)}`);
}

export const env = parsedEnv.data;
