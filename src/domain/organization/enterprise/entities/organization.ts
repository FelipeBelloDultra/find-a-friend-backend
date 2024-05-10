import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";
import { Alias } from "./value-object/alias";

export interface OrganizationProps {
  name: string;
  alias: Alias;
  logoUrl: string;
  phone: string;
  createdAt: Date;
}

export class Organization extends Entity<OrganizationProps> {
  public get phone() {
    return this.props.phone;
  }

  public get alias() {
    return this.props.alias;
  }

  static create(
    props: Optional<OrganizationProps, "createdAt" | "alias">,
    id?: UniqueEntityID
  ) {
    return new Organization(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        alias: props.alias ?? Alias.createFromText(props.name),
      },
      id
    );
  }
}
