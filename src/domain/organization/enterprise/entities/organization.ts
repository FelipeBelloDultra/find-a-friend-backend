import { Entity } from "~/core/entity/entity";
import { UniqueEntityID } from "~/core/entity/unique-entity-id";
import { Optional } from "~/core/types/optional";

export interface OrganizationProps {
  name: string;
  email: string;
  password: string;
  logoUrl: string;
  phone: string;
  createdAt: Date;
}

export class Organization extends Entity<OrganizationProps> {
  public get phone() {
    return this.props.phone;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  static create(
    props: Optional<OrganizationProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Organization(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
