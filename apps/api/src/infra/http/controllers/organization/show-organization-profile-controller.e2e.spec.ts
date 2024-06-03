import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { OrganizationFactory } from "test/factories/make-organization";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";

describe("Show organization profile [E2E]", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let organizationFactory: OrganizationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [OrganizationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    organizationFactory = moduleRef.get(OrganizationFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it("[GET] /api/auth/me", async () => {
    const organization = await organizationFactory.makePrismaOrganization();

    const token = jwt.sign(
      { sub: organization.id.toValue() },
      {
        expiresIn: "10m",
      },
    );

    const sut = await supertest(app.getHttpServer()).get("/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          email: organization.values.email,
          name: organization.values.name,
          phone: organization.values.phone,
          id: organization.id.toValue(),
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
