import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { makeOrganization, OrganizationFactory } from "test/factories/make-organization";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";

describe("Authenticate organization [E2E]", () => {
  let app: INestApplication;
  let organizationFactory: OrganizationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    organizationFactory = moduleRef.get(OrganizationFactory);

    await app.init();
  });

  it("[POST] /api/session", async () => {
    const password = "password";
    const org = await makeOrganization();
    const email = org.email;

    await organizationFactory.makePrismaOrganization(org);

    const sut = await supertest(app.getHttpServer()).post("/session").send({
      email,
      password,
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          token: expect.any(String),
        }),
      }),
    );
    expect(sut.headers["set-cookie"]).toEqual([expect.stringContaining("refreshToken")]);
  });

  afterAll(async () => {
    await app.close();
  });
});
