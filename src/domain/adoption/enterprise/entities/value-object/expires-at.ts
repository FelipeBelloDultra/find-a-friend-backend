export class ExpiresAt {
  public readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  public isExpired() {
    const isExpired = this.value.getTime() < Date.now();

    return isExpired;
  }

  private static setAdoptionExpiresDate() {
    const EXPIRATION_IN_MINUTES = 15;

    const expiresTime = new Date();
    expiresTime.setMinutes(expiresTime.getMinutes() + EXPIRATION_IN_MINUTES);

    return expiresTime;
  }

  public static create(value?: Date) {
    const date = value ?? this.setAdoptionExpiresDate();

    return new ExpiresAt(date);
  }
}
