import supertest from "supertest";

import { makeAndAuthenticateOrganization } from "test/factories/make-organization";
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
    const { token } = await makeAndAuthenticateOrganization(app.instance);

    const sut = await supertest(app.instance.server)
      .post("/api/orgs/address")
      .set("Authorization", `Bearer ${token}`)
      .send(makeOrganizationAddress());

    expect(sut.statusCode).toEqual(201);
    expect(sut.body).toEqual({});
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
