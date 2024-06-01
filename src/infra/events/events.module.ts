import { Module } from "@nestjs/common";

import { OnOrganizationAddressCreated } from "~/domain/organization/application/subscribers/on-organization-address-created";
import { CompleteOrganizationProfile } from "~/domain/organization/application/use-cases/complete-organization-profile";

import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [OnOrganizationAddressCreated, CompleteOrganizationProfile],
})
export class EventsModule {}
