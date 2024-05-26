import { BadRequestException } from "@nestjs/common";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import type { ZodSchema } from "zod";
import type { PipeTransform } from "@nestjs/common";

export class ZodValidationPipe implements PipeTransform {
  public constructor(private readonly schema: ZodSchema) {}

  public transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
