import supertest from "supertest";

import { makeAndAuthenticateOrganizationRequest } from "test/factories/make-organization";
import { makeOrganizationAddressRequest } from "test/factories/make-organization-address";
import { makePetEntity } from "test/factories/make-pet";
import { App } from "~/infra/http/app";

let app: App;

describe("[POST] Create pet controller", () => {
  beforeAll(async () => {
    app = new App();
    await app.start();
    await app.instance.ready();
  });

  it("should create a pet and return 201", async () => {
    const { token, organization } = await makeAndAuthenticateOrganizationRequest(app.instance);
    const { organizationAddress } = await makeOrganizationAddressRequest(organization.id);
    const pet = makePetEntity({
      organizationId: organization.id,
      organizationAddressId: organizationAddress.id,
    });

    /**
     * In this case, we are working with Domain events,
     * and this code await for the next tick of event loop running to
     * continue the test execution
     */
    await new Promise((r, _) => setTimeout(r));

    const sut = await supertest(app.instance.server).post("/api/pets").set("Authorization", `Bearer ${token}`).send({
      organization_address_id: pet.values.organizationAddressId.toValue(),
      name: pet.values.name,
      about: pet.values.about,
      size: pet.values.size,
      energy_level: pet.values.energyLevel,
      environment_size: pet.values.environmentSize,
    });

    expect(sut.status).toEqual(201);
    expect(sut.body).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          pet_id: expect.any(String),
        }),
      }),
    );
  });

  afterAll(async () => {
    await app.disconnect();
  });
});
