import { organizationRoutes } from "./organization-routes";

import type { FastifyInstance } from "fastify";

const ROUTES = [organizationRoutes] as const;

export function registerRoutes(app: FastifyInstance) {
  ROUTES.forEach((route) => {
    app.register(route);
  });
}
