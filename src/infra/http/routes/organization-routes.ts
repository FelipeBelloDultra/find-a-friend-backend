import { createOrganizationController } from "../controllers/organization/create-organization-controller";
import { authenticateOrganizationController } from "../controllers/organization/authenticate-organization-controller";
import { refreshTokenController } from "../controllers/organization/refresh-token-controller";
import { showOrganizationProfileController } from "../controllers/organization/show-organization-profile-controller";
import { verifyJwt } from "../middlewares/verify-jwt";
import { createOrganizationAddressController } from "../controllers/organization/create-organization-address-controller";

import type { FastifyInstance } from "fastify";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/api/orgs", createOrganizationController);
  app.post("/api/session", authenticateOrganizationController);
  app.patch("/api/refresh-token", refreshTokenController);
  app.get("/api/auth/me", { onRequest: [verifyJwt] }, showOrganizationProfileController);
  app.post("/api/orgs/address", { onRequest: [verifyJwt] }, createOrganizationAddressController);
}
