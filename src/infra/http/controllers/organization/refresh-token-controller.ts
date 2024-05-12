import { type FastifyReply, type FastifyRequest } from "fastify";

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  const { email } = request.user;

  const token = await reply.jwtSign(
    { email },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  );
  const refreshToken = await reply.jwtSign(
    { email },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d",
      },
    },
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    });
}
