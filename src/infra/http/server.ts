import { env } from "~/config/env";

import { App } from "./app";

class Server {
  private static app = new App();

  public static async start() {
    await this.onStart();

    this.onClose();
  }

  private static async onStart() {
    try {
      const app = await this.app.start();
      await app.listen({
        host: "0.0.0.0",
        port: env.HTTP_SERVER_PORT,
      });
      process.stdout.write(`[HTTP]: Server running on port ${env.HTTP_SERVER_PORT}\n`);
    } catch (error) {
      process.stdout.write("[Error]: Some error happened during initialization\n");
      await this.app.disconnect();
    }
  }

  private static onClose() {
    process.on("SIGINT", this.app.disconnect.bind(this.app));
  }
}

Server.start();
