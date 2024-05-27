// import { FastifyReply, FastifyRequest } from "fastify";

// import { HttpPresenter } from "~/infra/http/http-presenter";

// export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
//   const isRefreshTokenFilled = !!request.cookies["refreshToken"];

//   if (!isRefreshTokenFilled) {
//     return HttpPresenter.unauthorized(reply, {
//       message: "Unauthorized.",
//     });
//   }
//   await request.jwtVerify({ onlyCookie: true });

//   const { email } = request.user;

//   const token = await reply.jwtSign(
//     { email },
//     {
//       sign: {
//         sub: request.user.sub,
//       },
//     },
//   );
//   const refreshToken = await reply.jwtSign(
//     { email },
//     {
//       sign: {
//         sub: request.user.sub,
//         expiresIn: "7d",
//       },
//     },
//   );

//   return HttpPresenter.ok(
//     reply.setCookie("refreshToken", refreshToken, {
//       path: "/",
//       secure: true,
//       sameSite: true,
//       httpOnly: true,
//     }),
//     {
//       token,
//     },
//   );
// }
