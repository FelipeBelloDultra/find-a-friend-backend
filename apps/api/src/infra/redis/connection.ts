// import Redis from "ioredis";

// import { env } from "~/config/env";

// export class RedisConnection {
//   public static client = new Redis({
//     host: env.REDIS_HOST,
//     port: env.REDIS_PORT,
//     maxRetriesPerRequest: null,
//   });

//   public static disconnect() {
//     RedisConnection.client.disconnect();
//     process.stdout.write("[Redis]: Disconnected\n");
//   }

//   public static connect() {
//     RedisConnection.client.connect();
//     process.stdout.write("[Redis]: Connected\n");
//   }
// }
