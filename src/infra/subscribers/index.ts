import { OnOrganizationAddressCreated } from "~/domain/organization/application/subscribers/on-organization-address-created";
import { makeCompleteOrganizationProfile } from "~/domain/organization/application/use-cases/factories/make-complete-organization-profile";

import type { EventHandler } from "~/core/events/event-handler";

const completeOrganizationProfile = makeCompleteOrganizationProfile();

export class Subscribers {
  private static subscribers: Array<EventHandler> = [new OnOrganizationAddressCreated(completeOrganizationProfile)];

  public static setup(): void {
    Subscribers.subscribers.forEach((subscriber) => subscriber.listen());
  }
}
