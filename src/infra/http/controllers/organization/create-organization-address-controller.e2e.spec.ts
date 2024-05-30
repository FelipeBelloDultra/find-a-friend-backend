import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrganizationFactory } from "test/factories/make-organization";
import { makeOrganizationAddress } from "test/factories/make-organization-address";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";
import { PrismaService } from "~/infra/database/prisma/prisma.service";

describe.only("Create organization address [E2E]", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let organizationFactory: OrganizationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    organizationFactory = moduleRef.get(OrganizationFactory);

    await app.init();
  });

  it("[POST] /api/orgs/address", async () => {
    const org = await organizationFactory.makePrismaOrganization();

    const token = jwt.sign({
      sub: org.id.toValue(),
    });

    const sut = await supertest(app.getHttpServer())
      .post("/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeOrganizationAddress());

    expect(sut.statusCode).toEqual(201);
    expect(await prisma.organizationAddress.count()).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
