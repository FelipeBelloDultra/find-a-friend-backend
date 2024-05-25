import supertest from "supertest";

import { makeAndAuthenticateOrganizationRequest } from "test/factories/make-organization";
import { makeOrganizationAddress } from "test/factories/make-organization-address";
import { App } from "~/infra/http/app";

let app: App;

describe("[POST] Create organization address", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should be able create an organization address", async () => {
    const { token } = await makeAndAuthenticateOrganizationRequest(app.instance);

    const sut = await supertest(app.instance.server)
      .post("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeOrganizationAddress());

    expect(sut.statusCode).toEqual(201);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          organization_address_id: expect.any(String),
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
