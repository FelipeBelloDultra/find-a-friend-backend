import { FastifyInstance } from "fastify";

import { createOrganizationController } from "../controllers/organization/create-organization-controller";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/api/orgs", createOrganizationController);
}
