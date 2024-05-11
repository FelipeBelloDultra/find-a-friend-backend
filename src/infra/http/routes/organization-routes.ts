import { FastifyInstance } from "fastify";

import { createOrganizationController } from "../controllers/organization/create-organization-controller";
import { authenticateOrganizationController } from "../controllers/organization/authenticate-organization-controller";
import { refreshTokenController } from "../controllers/organization/refresh-token-controller";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/api/orgs", createOrganizationController);
  app.post("/api/session", authenticateOrganizationController);
  app.patch("/api/refresh-token", refreshTokenController);
}
