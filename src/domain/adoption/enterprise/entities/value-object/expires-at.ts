export class ExpiresAt {
  public static EXPIRATION_IN_MINUTES = 15;
  public readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  public isExpired() {
    const isExpired = this.value.getTime() < Date.now();

    return isExpired;
  }

  private static setAdoptionExpiresDate() {
    const expiresTime = new Date();
    expiresTime.setMinutes(expiresTime.getMinutes() + ExpiresAt.EXPIRATION_IN_MINUTES);

    return expiresTime;
  }

  public static create(value?: Date) {
    const date = value ?? this.setAdoptionExpiresDate();

    return new ExpiresAt(date);
  }
}
