import { Module } from "@nestjs/common";

import { OnOrganizationAddressCreated } from "~/domain/organization/application/subscribers/on-organization-address-created";

import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [OnOrganizationAddressCreated],
})
export class EventsModule {}
