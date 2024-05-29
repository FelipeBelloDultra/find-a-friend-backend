import { Encrypter } from "~/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  public async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }

  public async decode<Payload extends object>(token: string): Promise<Payload> {
    return Promise.resolve({ token } as Payload);
  }
}
