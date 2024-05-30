import cookieParser from "cookie-parser";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import supertest from "supertest";

import { makeOrganization, OrganizationFactory } from "test/factories/make-organization";
import { AppModule } from "~/infra/app.module";
import { DatabaseModule } from "~/infra/database/database.module";

describe.only("Refresh token [E2E]", () => {
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

    app.use(cookieParser());

    await app.init();
  });

  it("[PATCH] /api/refresh-token", async () => {
    const password = "password";
    const org = await makeOrganization();
    const email = org.email;

    const createdOrg = await organizationFactory.makePrismaOrganization(org);

    const authResponse = await supertest(app.getHttpServer()).post("/session").send({
      email,
      password,
    });

    const cookies = authResponse.get("Set-Cookie");
    const token = jwt.sign(
      {
        sub: createdOrg.id.toValue(),
      },
      {
        expiresIn: "10m",
      },
    );

    const sut = await supertest(app.getHttpServer())
      .patch("/refresh-token")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(sut.status).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          token: expect.any(String),
        }),
      }),
    );
    expect(sut.get("Set-Cookie")).toEqual([expect.stringContaining("refreshToken=")]);
  });

  afterAll(async () => {
    await app.close();
  });
});
