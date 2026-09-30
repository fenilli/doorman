import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { DiscoveryResponse, JwksResponse } from "./discovery.schemas.js";
import { createDiscoveryService } from "./discovery.service.js";

export const discoveryRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const service = createDiscoveryService();
  const document = service.buildDiscoveryDocument(app.config.oidc.issuer);

  app.get("/.well-known/openid-configuration", {
    schema: { response: DiscoveryResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return document;
  });

  app.get("/jwks.json", {
    schema: { response: JwksResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return app.keys.getPublicJwks();
  });
};
