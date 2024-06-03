export abstract class Encrypter {
  public abstract decode<Payload extends object>(token: string): Promise<Payload>;
  public abstract encrypt(payload: Record<string, unknown>, expiresIn?: string): Promise<string>;
}
