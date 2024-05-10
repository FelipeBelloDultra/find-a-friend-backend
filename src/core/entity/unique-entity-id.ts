import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private id: string;

  toValue() {
    return this.id;
  }

  constructor(value?: string) {
    this.id = value ?? randomUUID();
  }

  public equals(id: UniqueEntityID) {
    return this.toValue() === id.toValue();
  }
}
