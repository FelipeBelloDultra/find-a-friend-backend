import { type FastifyInstance } from "fastify";

import { organizationRoutes } from "./organization-routes";

const ROUTES = [organizationRoutes] as const;

export function registerRoutes(app: FastifyInstance) {
  ROUTES.forEach((route) => {
    app.register(route);
  });
}
