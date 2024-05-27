import { FastifyReply } from "fastify";

export class HttpPresenter {
  private static formattedSuccess<SuccessType>(data: SuccessType) {
    return {
      status: "success",
      error: {},
      data,
    };
  }

  private static formattedError<ErrorType>(error: ErrorType) {
    return {
      status: "error",
      error,
      data: {},
    };
  }

  public static created<ReturnCreated>(reply: FastifyReply, data: ReturnCreated) {
    return reply.status(201).send(this.formattedSuccess(data));
  }

  public static ok<ReturnOk>(reply: FastifyReply, data: ReturnOk) {
    return reply.status(200).send(this.formattedSuccess(data));
  }

  public static conflict<ReturnConflict>(reply: FastifyReply, error: ReturnConflict) {
    return reply.status(409).send(this.formattedError(error));
  }

  public static notFound<ReturnNotFound>(reply: FastifyReply, error: ReturnNotFound) {
    return reply.status(404).send(this.formattedError(error));
  }

  public static unauthorized<ReturnUnauthorized>(reply: FastifyReply, error: ReturnUnauthorized) {
    return reply.status(401).send(this.formattedError(error));
  }

  public static internal<ReturnInternal>(reply: FastifyReply, error: ReturnInternal) {
    return reply.status(500).send(this.formattedError(error));
  }

  public static unprocessableEntity<ReturnUnprocessableEntity>(reply: FastifyReply, error: ReturnUnprocessableEntity) {
    return reply.status(422).send(this.formattedError(error));
  }

  public static tooManyRequests<ReturnTooManyRequests>(reply: FastifyReply, error: ReturnTooManyRequests) {
    return reply.status(429).send(this.formattedError(error));
  }

  public static forbidden<ReturnForbidden>(reply: FastifyReply, error: ReturnForbidden) {
    return reply.status(403).send(this.formattedError(error));
  }

  public static unknown<ReturnUnknown>(reply: FastifyReply, statusCode: number, error: ReturnUnknown) {
    return reply.status(statusCode).send(this.formattedError(error));
  }
}
