import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  public constructor(private readonly schema: ZodSchema) {}

  public transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          status_code: 400,
          errors: fromZodError(error).details,
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
