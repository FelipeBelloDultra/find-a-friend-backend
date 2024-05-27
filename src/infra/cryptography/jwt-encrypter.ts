import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Encrypter } from "~/domain/organization/application/cryptography/encrypter";

@Injectable()
export class JwtEncrypter implements Encrypter {
  public constructor(private jwtService: JwtService) {}

  public encrypt(payload: Record<string, unknown>, expiresIn = "10m"): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
