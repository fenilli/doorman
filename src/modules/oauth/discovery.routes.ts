import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { config } from "@/config/index.js";
import { DiscoveryResponse } from "./discovery.schemas.js";
import { DiscoveryService } from "./discovery.service.js";

export const discoveryRoutes: FastifyPluginAsyncTypebox = async (server) => {
  const service = new DiscoveryService();
  const document = service.buildDiscoveryDocument(config.oidc.issuer);

  server.get("/openid-configuration", {
    schema: { response: DiscoveryResponse }
  }, async (_, reply) => {
    reply.cacheControl("public").maxAge(300);

    return document;
  });
};
