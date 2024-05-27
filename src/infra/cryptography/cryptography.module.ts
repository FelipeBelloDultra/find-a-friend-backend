import { Module } from "@nestjs/common";

import { Encrypter } from "~/application/cryptography/encrypter";

import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [{ provide: Encrypter, useClass: JwtEncrypter }],
  exports: [Encrypter],
})
export class CryptographyModule {}
