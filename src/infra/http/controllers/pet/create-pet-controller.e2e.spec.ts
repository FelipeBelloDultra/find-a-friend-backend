import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrganizationFactory } from "test/factories/make-organization";
import { OrganizationAddressFactory } from "test/factories/make-organization-address";
import { makePetEntity } from "test/factories/make-pet";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";
import { PrismaService } from "~/infra/database/prisma/prisma.service";

describe("Create pet [E2E]", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let organizationFactory: OrganizationFactory;
  let organizationAddressFactory: OrganizationAddressFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory, OrganizationAddressFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    organizationFactory = moduleRef.get(OrganizationFactory);
    organizationAddressFactory = moduleRef.get(OrganizationAddressFactory);

    await app.init();
  });

  it("[POST] /api/pets", async () => {
    const org = await organizationFactory.makePrismaOrganization();
    const orgAddress = await organizationAddressFactory.makePrismaOrganizationAddress({
      organizationId: org.id,
    });
    await prisma.organization.update({
      where: { id: org.id.toValue() },
      data: { profile_completed: true },
    });

    const token = jwt.sign({
      sub: org.id.toValue(),
    });

    const pet = makePetEntity({
      organizationId: org.id,
      organizationAddressId: orgAddress.id,
    });

    const sut = await supertest(app.getHttpServer()).post("/pets").set("Authorization", `Bearer ${token}`).send({
      organization_address_id: pet.values.organizationAddressId.toValue(),
      name: pet.values.name,
      about: pet.values.about,
      size: pet.values.size,
      energy_level: pet.values.energyLevel,
      environment_size: pet.values.environmentSize,
    });

    expect(sut.statusCode).toEqual(201);
    expect(await prisma.pet.count()).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
