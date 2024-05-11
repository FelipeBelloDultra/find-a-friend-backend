import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      email: string;
      sub: string;
    };
  }
}
