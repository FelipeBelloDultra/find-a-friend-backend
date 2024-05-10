import "dotenv/config";

import { z } from "zod";

const ENVIRONMENT_SCHEMA = z.object({
  PASSWORD_SALT: z.coerce.number().default(6),
});

const parsedEnv = ENVIRONMENT_SCHEMA.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(
    `Invalid env var: ${JSON.stringify(
      parsedEnv.error.formErrors.fieldErrors,
      undefined,
      2
    )}`,
    {
      cause: "Invalid env config",
    }
  );
}

export const env = parsedEnv.data;