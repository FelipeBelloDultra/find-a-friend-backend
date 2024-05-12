import supertest from "supertest";

import { query } from "~/infra/database/connection";
import { app } from "~/infra/http/app";
import { makeAndAuthenticateOrganization } from "test/factories/make-organization";
import { makeAddress } from "test/factories/make-address";

describe("[PUT] Update organization address", () => {
  beforeAll(async () => {
    await app.ready();
  });

  it("should be able update an organization address", async () => {
    const { token } = await makeAndAuthenticateOrganization(app);

    const sut = await supertest(app.server)
      .put("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAddress());

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual({});
  });

  it("should be able update an organization address and verify is profile is completed", async () => {
    const { token } = await makeAndAuthenticateOrganization(app);
    const address = makeAddress();
    await supertest(app.server).put("/api/orgs/address").set("Authorization", `Bearer ${token}`).send(address);

    const sut = await supertest(app.server).get("/api/auth/me").set("Authorization", `Bearer ${token}`).send();

    expect(sut.statusCode).toEqual(200);
    expect(sut.body).toEqual(
      expect.objectContaining({
        profile_is_completed: true,
      }),
    );
  });

  it("should not be able able update address if organization does not exists", async () => {
    const { token, organization } = await makeAndAuthenticateOrganization(app);
    await query.organization.delete({
      where: { id: organization.id.toValue() },
    });

    const sut = await supertest(app.server)
      .put("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAddress());

    expect(sut.statusCode).toEqual(404);
    expect(sut.body).toEqual({ message: "Organization not found." });
  });

  afterAll(async () => {
    await app.close();
  });
});
