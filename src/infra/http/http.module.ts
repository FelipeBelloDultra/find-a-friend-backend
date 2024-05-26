import { Module } from "@nestjs/common";

import { CreateOrganization } from "~/domain/organization/application/use-cases/create-organization";
import { AuthenticateOrganization } from "~/domain/organization/application/use-cases/authenticate-organization";

import { DatabaseModule } from "../database/database.module";

import { CreateOrganizationController } from "./controllers/organization/create-organization.controller";
import { AuthenticateOrganizationController } from "./controllers/organization/authenticate-organization.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateOrganizationController, AuthenticateOrganizationController],
  providers: [CreateOrganization, AuthenticateOrganization],
})
export class HttpModule {}
