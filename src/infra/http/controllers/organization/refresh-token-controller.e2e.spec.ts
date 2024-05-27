import supertest from "supertest";

import { makeOrganization } from "test/factories/make-organization";

import { App } from "~/infra/http/app";

let app: App;

describe("[PATCH] Refresh token controller", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should be able refresh token", async () => {
    const org = await makeOrganization();
    await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const authResponse = await supertest(app.instance.server).post("/api/session").send({
      email: org.email,
      password: "123456",
    });
    const cookies = authResponse.get("Set-Cookie") as Array<string>;

    const sut = await supertest(app.instance.server).patch("/api/refresh-token").set("Cookie", cookies).send();

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
    await app.disconnect();
  });
});
