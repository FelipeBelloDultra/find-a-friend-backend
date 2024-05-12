import { PrismaClient } from "@prisma/client";

import { env } from "~/config/env";

export class DatabaseConnection {
  public static query = new PrismaClient({
    log: env.NODE_ENV === "dev" ? ["query"] : [],
  });

  public static async disconnect() {
    await DatabaseConnection.query.$disconnect();
    process.stdout.write("[Database]: Disconnected\n");
  }

  public static async connect() {
    await DatabaseConnection.query.$connect();
    process.stdout.write("[Database]: Connected\n");
  }
}
