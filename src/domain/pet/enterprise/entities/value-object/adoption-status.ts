export type PetAdoptionStatusValue = "PENDING" | "ADOPTED" | "NOT_ADOPTED";

export class AdoptionStatus {
  public value: PetAdoptionStatusValue;

  private constructor(value: PetAdoptionStatusValue) {
    this.value = value;
  }

  public setPending() {
    this.value = "PENDING";
  }

  public setAdopted() {
    this.value = "ADOPTED";
  }

  public setNotAdopted() {
    this.value = "NOT_ADOPTED";
  }

  public static create(value?: PetAdoptionStatusValue) {
    const status = value ?? "NOT_ADOPTED";

    return new AdoptionStatus(status);
  }
}
