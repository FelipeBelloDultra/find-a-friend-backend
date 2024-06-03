import * as bcrypt from "bcrypt";

import { env } from "~/config/env";

export class Password {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  private static async hashPassword(password: string) {
    return await bcrypt.hash(password, env.PASSWORD_SALT);
  }

  public async comparePassword(passwordToCompare: string) {
    return await bcrypt.compare(passwordToCompare, this.value);
  }

  public static async create(value: string, isHashed = false) {
    let password = value;

    if (!isHashed) {
      password = await this.hashPassword(value);
    }

    return new Password(password);
  }
}
