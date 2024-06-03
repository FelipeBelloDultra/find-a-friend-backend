import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Encrypter } from "~/application/cryptography/encrypter";

@Injectable()
export class JwtEncrypter implements Encrypter {
  public constructor(private jwtService: JwtService) {}

  public async decode<Payload extends object>(token: string): Promise<Payload> {
    return await this.jwtService.verifyAsync<Payload>(token);
  }

  public async encrypt(payload: Record<string, unknown>, expiresIn = "10m"): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
