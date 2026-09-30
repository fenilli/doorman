import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { DiscoveryResponse } from "./discovery.schemas.js";
import { DiscoveryService } from "./discovery.service.js";

export const discoveryRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const service = new DiscoveryService();
  const document = service.buildDiscoveryDocument(app.config.oidc.issuer);

  app.get("/openid-configuration", {
    schema: { response: DiscoveryResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return document;
  });
};
