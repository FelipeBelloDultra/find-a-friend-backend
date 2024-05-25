import supertest from "supertest";

import { makeOrganization } from "test/factories/make-organization";
import { App } from "~/infra/http/app";

let app: App;

describe("[POST] Authenticate organization controller", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should authenticate organization and return the token (with refresh token in setCookie header)", async () => {
    const org = await makeOrganization();
    await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const sut = await supertest(app.instance.server).post("/api/session").send({
      email: org.email,
      password: "123456",
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

  it("should not be able authenticate organization with wrong email", async () => {
    const sut = await supertest(app.instance.server).post("/api/session").send({
      email: "example@email.com",
      password: "123456",
    });

    expect(sut.status).toBe(401);
    expect(sut.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Invalid credentials.",
        }),
      }),
    );
  });

  it("should not be able authenticate organization with wrong password", async () => {
    const org = await makeOrganization();
    await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const sut = await supertest(app.instance.server).post("/api/session").send({
      email: org.email,
      password: "wrong-password",
    });

    expect(sut.status).toBe(401);
    expect(sut.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Invalid credentials.",
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
