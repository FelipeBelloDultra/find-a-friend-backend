import { Module } from "@nestjs/common";

import { CreateOrganization } from "~/domain/organization/application/use-cases/create-organization";
import { AuthenticateOrganization } from "~/domain/organization/application/use-cases/authenticate-organization";
import { ShowOrganizationProfile } from "~/domain/organization/application/use-cases/show-organization-profile";
import { CreateOrganizationAddress } from "~/domain/organization/application/use-cases/create-organization-address";
import { CreatePet } from "~/domain/pet/application/use-cases/create-pet";
import { ShowPetDetail } from "~/domain/pet/application/use-cases/show-pet-detail";
import { FetchManyPetsAvailableToAdoption } from "~/domain/pet/application/use-cases/fetch-many-pets-available-to-adoption";

import { DatabaseModule } from "../database/database.module";
import { CryptographyModule } from "../cryptography/cryptography.module";

import { CreateOrganizationController } from "./controllers/organization/create-organization.controller";
import { AuthenticateOrganizationController } from "./controllers/organization/authenticate-organization.controller";
import { ShowOrganizationProfileController } from "./controllers/organization/show-organization-profile.controller";
import { RefreshTokenController } from "./controllers/organization/refresh-token.controller";
import { CreateOrganizationAddressController } from "./controllers/organization/create-organization-address-controller";
import { CreatePetController } from "./controllers/pet/create-pet-controller";
import { ShowPetDetailController } from "./controllers/pet/show-pet-detail-controller";
import { FetchManyPetsAvailableToAdoptionController } from "./controllers/pet/fetch-many-pets-available-to-adoption-controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateOrganizationAddressController,
    CreateOrganizationController,
    AuthenticateOrganizationController,
    ShowOrganizationProfileController,
    RefreshTokenController,
    CreatePetController,
    ShowPetDetailController,
    FetchManyPetsAvailableToAdoptionController,
  ],
  providers: [
    ShowPetDetail,
    CreateOrganizationAddress,
    CreateOrganization,
    AuthenticateOrganization,
    ShowOrganizationProfile,
    CreatePet,
    FetchManyPetsAvailableToAdoption,
  ],
})
export class HttpModule {}
