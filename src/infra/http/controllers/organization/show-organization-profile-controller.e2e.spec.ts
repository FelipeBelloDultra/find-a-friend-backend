import supertest from "supertest";

import { query } from "~/infra/database/connection";
import { app } from "~/infra/http/app";

import { makeAndAuthenticateOrganization } from "test/factories/make-organization";

describe("[GET] Show organization profile controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("should be able show authenticated organization profile", async () => {
    const { token, organization } = await makeAndAuthenticateOrganization(app);

    const sut = await supertest(app.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        email: organization.email,
        name: organization.name,
        phone: organization.phone,
        id: organization.id.toValue(),
      }),
    );
  });

  it("should not be able show authenticated organization profile if organization does not exists", async () => {
    const { token, organization } = await makeAndAuthenticateOrganization(app);
    await query.organization.delete({
      where: { id: organization.id.toValue() },
    });

    const sut = await supertest(app.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(404);
    expect(sut.body).toEqual({ message: "Organization not found." });
  });

  it("should not be able show authenticated organization profile if JWT is wrong", async () => {
    const sut = await supertest(app.server)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-bearer-token")
      .send();

    expect(sut.statusCode).toEqual(401);
    expect(sut.body).toEqual({ message: "Unauthorized." });
  });

  afterAll(async () => {
    await app.close();
  });
});
