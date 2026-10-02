import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { JwksResponse } from "./keys.schemas.js";

export const keysRoutes: FastifyPluginAsyncTypebox = async (server) => {
  server.get("/jwks.json", {
    schema: { response: JwksResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return server.keys.getPublicJwks();
  });
};
