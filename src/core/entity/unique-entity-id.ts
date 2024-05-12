import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private id: string;

  public toValue() {
    return this.id;
  }

  public constructor(value?: string) {
    this.id = value ?? randomUUID();
  }

  public equals(id: UniqueEntityID) {
    return this.toValue() === id.toValue();
  }
}
