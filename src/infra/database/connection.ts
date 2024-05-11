import { PrismaClient } from "@prisma/client";
import { env } from "~/config/env";

export const query = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
