import supertest from "supertest";

import { DatabaseConnection } from "~/infra/database/connection";
import { App } from "~/infra/http/app";
import { makeAndAuthenticateOrganization } from "test/factories/make-organization";
import { makeAddress } from "test/factories/make-address";

let app: App;

describe("[PUT] Update organization address", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should be able update an organization address", async () => {
    const { token } = await makeAndAuthenticateOrganization(app.instance);

    const sut = await supertest(app.instance.server)
      .put("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAddress());

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual({});
  });

  it("should be able update an organization address and verify is profile is completed", async () => {
    const { token } = await makeAndAuthenticateOrganization(app.instance);
    const address = makeAddress();
    await supertest(app.instance.server).put("/api/orgs/address").set("Authorization", `Bearer ${token}`).send(address);

    const sut = await supertest(app.instance.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        profile_is_completed: true,
      }),
    );
  });

  it("should not be able able update address if organization does not exists", async () => {
    const { token, organization } = await makeAndAuthenticateOrganization(app.instance);
    await DatabaseConnection.query.organization.delete({
      where: { id: organization.id.toValue() },
    });

    const sut = await supertest(app.instance.server)
      .put("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAddress());

    expect(sut.statusCode).toEqual(404);
    expect(sut.body).toEqual({ message: "Organization not found." });
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
