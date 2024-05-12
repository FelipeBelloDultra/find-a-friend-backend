import supertest from "supertest";
import { makeOrganization } from "test/factories/make-organization";

import { app } from "~/infra/http/app";

describe("[PATCH] Refresh token controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("should be able refresh token", async () => {
    const org = await makeOrganization();
    await supertest(app.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const authResponse = await supertest(app.server).post("/api/session").send({
      email: org.email,
      password: "123456",
    });
    const cookies = authResponse.get("Set-Cookie") as Array<string>;

    const sut = await supertest(app.server).patch("/api/refresh-token").set("Cookie", cookies).send();

    expect(sut.status).toEqual(200);
    expect(sut.body).toEqual({
      token: expect.any(String),
    });
    expect(sut.get("Set-Cookie")).toEqual([expect.stringContaining("refreshToken=")]);
  });

  afterAll(async () => {
    await app.close();
  });
});
