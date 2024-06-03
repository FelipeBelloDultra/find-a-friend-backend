import { Controller, HttpCode, Patch, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

import { Encrypter } from "~/application/cryptography/encrypter";
import { Public } from "~/infra/auth/public";

import { HttpPresenter } from "../../presenters/http-presenter";

@Controller("/refresh-token")
@Public()
export class RefreshTokenController {
  public constructor(private readonly encrypter: Encrypter) {}

  @Patch()
  @HttpCode(200)
  public async handle(@Req() request: Request, @Res() response: Response) {
    const isRefreshTokenFilled = !!request.cookies["refreshToken"];

    if (!isRefreshTokenFilled) {
      throw new UnauthorizedException();
    }

    const { sub } = await this.encrypter.decode<{ sub: string }>(request.cookies["refreshToken"]);

    const [accessToken, refreshToken] = await Promise.all([
      this.encrypter.encrypt({
        sub,
      }),
      this.encrypter.encrypt(
        {
          sub,
        },
        "7d",
      ),
    ]);

    return response
      .cookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .json(
        HttpPresenter.success({
          token: accessToken,
        }),
      );
  }
}
