import { DomainEvents } from "~/core/events/domain-events";

import { OrganizationAddressCreatedEvent } from "../../enterprise/events/organization-address-created-event";

import type { CompleteOrganizationProfile } from "../use-cases/complete-organization-profile";
import type { EventHandler } from "~/core/events/event-handler";

export class OnOrganizationAddressCreated implements EventHandler {
  public constructor(private readonly completeOrganizationProfile: CompleteOrganizationProfile) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(
      this.completeOrganizationProfileOnAddAddress.bind(this),
      OrganizationAddressCreatedEvent.name,
    );
  }

  private async completeOrganizationProfileOnAddAddress({ organizationAddress }: OrganizationAddressCreatedEvent) {
    await this.completeOrganizationProfile.execute({
      organizationId: organizationAddress.values.organizationId.toValue(),
    });
  }
}
