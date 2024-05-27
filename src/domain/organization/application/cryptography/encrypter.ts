export abstract class Encrypter {
  public abstract encrypt(payload: Record<string, unknown>, expiresIn?: string): Promise<string>;
}
