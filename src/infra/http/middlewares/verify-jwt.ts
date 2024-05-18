import type { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(" ")[1] as string;

    if (!token) {
      throw new Error();
    }

    await request.jwtVerify({
      onlyCookie: false,
    });
  } catch (err) {
    return reply.status(401).send({
      message: "Unauthorized.",
    });
  }
}
