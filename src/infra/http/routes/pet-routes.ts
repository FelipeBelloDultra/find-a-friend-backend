import { createPetController } from "../controllers/pet/create-pet-controller";
import { verifyJwt } from "../middlewares/verify-jwt";

import type { FastifyInstance } from "fastify";

export async function petRoutes(app: FastifyInstance) {
  app.post("/api/pets", { onRequest: [verifyJwt] }, createPetController);
}
