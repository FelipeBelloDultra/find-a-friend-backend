import supertest from "supertest";

import { DatabaseConnection } from "~/infra/database/connection";
import { App } from "~/infra/http/app";
import { makeAndAuthenticateOrganizationRequest } from "test/factories/make-organization";

let app: App;

describe("[GET] Show organization profile controller", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should be able show authenticated organization profile", async () => {
    const { token, organization } = await makeAndAuthenticateOrganizationRequest(app.instance);

    const sut = await supertest(app.instance.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

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

  it("should not be able show authenticated organization profile if organization does not exists", async () => {
    const { token, organization } = await makeAndAuthenticateOrganizationRequest(app.instance);
    await DatabaseConnection.query.organization.delete({
      where: { id: organization.id.toValue() },
    });

    const sut = await supertest(app.instance.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(404);
    expect(sut.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Organization not found.",
        }),
      }),
    );
  });

  it("should not be able show authenticated organization profile if JWT is wrong", async () => {
    const sut = await supertest(app.instance.server)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-bearer-token")
      .send();

    expect(sut.statusCode).toEqual(401);
    expect(sut.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          message: "Unauthorized.",
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
