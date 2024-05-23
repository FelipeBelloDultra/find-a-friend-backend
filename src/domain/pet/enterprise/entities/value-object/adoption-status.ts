type AdoptionStatusValue = "PENDING" | "ADOPTED" | "NOT_ADOPTED";

export class AdoptionStatus {
  public value: AdoptionStatusValue;

  private constructor(value: AdoptionStatusValue) {
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

  public static create(value?: AdoptionStatusValue) {
    const status = value ?? "NOT_ADOPTED";

    return new AdoptionStatus(status);
  }
}
