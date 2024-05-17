import supertest from "supertest";

import { makeOrganization } from "test/factories/make-organization";
import { App } from "~/infra/http/app";

let app: App;

describe("[POST] Create organization controller", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should create organization and return 201", async () => {
    const org = await makeOrganization();

    const sut = await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    expect(sut.status).toBe(201);
    expect(sut.body).toEqual({});
  });

  it("should not be able to create an organization with same email", async () => {
    const org = await makeOrganization();
    await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    const sut = await supertest(app.instance.server).post("/api/orgs").send({
      email: org.email,
      logoUrl: org.logoUrl,
      name: org.name,
      password: "123456",
      phone: org.phone,
    });

    expect(sut.status).toBe(409);
    expect(sut.body).toStrictEqual({
      message: "Email already used.",
      issues: {
        email: "Email already used.",
      },
    });
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
