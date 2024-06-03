import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { makeOrganization, OrganizationFactory } from "test/factories/make-organization";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";
import { PrismaService } from "~/infra/database/prisma/prisma.service";

describe("Create organization [E2E]", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[POST] /api/orgs", async () => {
    const org = await makeOrganization();

    const sut = await supertest(app.getHttpServer()).post("/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const savedOrganization = await prisma.organization.findUnique({
      where: {
        email: org.email,
      },
    });

    expect(sut.status).toBe(201);
    expect(savedOrganization).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
