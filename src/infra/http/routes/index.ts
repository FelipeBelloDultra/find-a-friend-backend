import { organizationRoutes } from "./organization-routes";
import { petRoutes } from "./pet-routes";

export const ROUTES = [organizationRoutes, petRoutes] as const;
