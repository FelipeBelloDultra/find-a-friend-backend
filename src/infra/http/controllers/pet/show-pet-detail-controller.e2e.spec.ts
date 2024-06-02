import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrganizationFactory } from "test/factories/make-organization";
import { OrganizationAddressFactory } from "test/factories/make-organization-address";
import { PetFactory } from "test/factories/make-pet";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";

describe("Show pet detail [E2E]", () => {
  let app: INestApplication;
  let organizationFactory: OrganizationFactory;
  let organizationAddressFactory: OrganizationAddressFactory;
  let petFactory: PetFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory, OrganizationAddressFactory, PetFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    organizationFactory = moduleRef.get(OrganizationFactory);
    organizationAddressFactory = moduleRef.get(OrganizationAddressFactory);
    petFactory = moduleRef.get(PetFactory);

    await app.init();
  });

  it("[GET] /api/pets/:id", async () => {
    const org = await organizationFactory.makePrismaOrganization();
    const orgAddress = await organizationAddressFactory.makePrismaOrganizationAddress({
      organizationId: org.id,
    });
    const pet = await petFactory.makePrismaPet({
      organizationAddressId: orgAddress.id,
      organizationId: org.id,
    });

    const sut = await supertest(app.getHttpServer()).get(`/pets/${pet.id.toValue()}`).send();

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: pet.id.toValue(),
          name: pet.values.name,
          about: pet.values.about,
          size: pet.values.size,
          energy_level: pet.values.energyLevel,
          environment_size: pet.values.environmentSize,
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
