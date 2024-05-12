import supertest from "supertest";
import { makeOrganization } from "test/factories/make-organization";

import { app } from "~/infra/http/app";

describe("[POST] Authenticate organization controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("should authenticate organization and return the token (with refresh token in setCookie header)", async () => {
    const org = await makeOrganization();
    await supertest(app.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const sut = await supertest(app.server).post("/api/session").send({
      email: org.email,
      password: "123456",
    });

    expect(sut.status).toBe(200);
    expect(sut.body).toEqual({
      token: expect.any(String),
    });
    expect(sut.headers["set-cookie"]).toEqual([expect.stringContaining("refreshToken")]);
  });

  it("should not be able authenticate organization with wrong email", async () => {
    const sut = await supertest(app.server).post("/api/session").send({
      email: "example@email.com",
      password: "123456",
    });

    expect(sut.status).toBe(401);
    expect(sut.body).toEqual({
      message: "Invalid credentials.",
    });
  });

  it("should not be able authenticate organization with wrong password", async () => {
    const org = await makeOrganization();
    await supertest(app.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const sut = await supertest(app.server).post("/api/session").send({
      email: org.email,
      password: "wrong-password",
    });

    expect(sut.status).toBe(401);
    expect(sut.body).toEqual({
      message: "Invalid credentials.",
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
