import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrganizationFactory } from "test/factories/make-organization";
import { OrganizationAddressFactory } from "test/factories/make-organization-address";
import { PetFactory } from "test/factories/make-pet";
import { AdoptionStatus } from "~/domain/pet/enterprise/entities/value-object/adoption-status";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";

describe("Fetch many pets available to adoption [E2E]", () => {
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

  it("[GET] /api/pets", async () => {
    const org = await organizationFactory.makePrismaOrganization();
    const STATE = "SP";
    const CITY = "Sao Paulo";
    const orgAddress = await organizationAddressFactory.makePrismaOrganizationAddress({
      organizationId: org.id,
      city: CITY,
      state: STATE,
    });

    const promises = Array.from({ length: 15 }).map(() =>
      petFactory.makePrismaPet({
        organizationAddressId: orgAddress.id,
        organizationId: org.id,
      }),
    );

    await Promise.all([
      ...promises,
      petFactory.makePrismaPet({
        organizationAddressId: orgAddress.id,
        organizationId: org.id,
        adoptionStatus: AdoptionStatus.create("ADOPTED"),
      }),
    ]);

    const sut = await supertest(app.getHttpServer())
      .get(`/pets`)
      .query({
        city: CITY,
        state: STATE,
      })
      .send();

    expect(sut.status).toBe(200);
    expect(sut.body.data.total).toBe(15);
    expect(sut.body.data.pets.length).toBe(10);
    expect(sut.body.data).toEqual(
      expect.objectContaining({
        pets: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            organization_id: org.id.toValue(),
            organization_address_id: orgAddress.id.toValue(),
          }),
        ]),
      }),
    );

    const sut2 = await supertest(app.getHttpServer())
      .get(`/pets`)
      .query({
        page: 2,
        city: CITY,
        state: STATE,
      })
      .send();

    expect(sut2.body.data.total).toBe(15);
    expect(sut2.body.data.pets.length).toBe(5);
  });

  afterAll(async () => {
    await app.close();
  });
});
