import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { KeysService } from "./keys.service.js";
import { JwksResponse } from "./keys.schemas.js";

export const keysRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const service = new KeysService(app.db);

  app.get("/jwks.json", {
    schema: { response: JwksResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return service.getPublicJwks();
  });
};
