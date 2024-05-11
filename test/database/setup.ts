import "dotenv/config";

import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

class DatabaseSetupTesting {
  public static SCHEMA_NAME_ID = randomUUID();

  public static DB_CONNECTION = new PrismaClient({
    datasourceUrl: this.setDatabaseURL(),
  });

  public static generateDatabaseURL() {
    if (!process.env.DATABASE_URL) {
      throw new Error("Please provide a DATABASE_URL environment variable.");
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set("schema", this.SCHEMA_NAME_ID);

    return url.toString();
  }

  public static setDatabaseURL() {
    process.env.DATABASE_URL = this.generateDatabaseURL();

    return process.env.DATABASE_URL;
  }
}

beforeEach(async () => {
  execSync("npm run db:migrate:deploy");
});

afterEach(async () => {
  await DatabaseSetupTesting.DB_CONNECTION.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${DatabaseSetupTesting.SCHEMA_NAME_ID}" CASCADE`
  );

  await DatabaseSetupTesting.DB_CONNECTION.$disconnect();
});
