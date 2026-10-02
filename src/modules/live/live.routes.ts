import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { LiveResponse } from "./live.schemas.js";

export const liveRoutes: FastifyPluginAsyncTypebox = async (server) => {
  server.get("/", {
    schema: {
      response: LiveResponse
    }
  }, async () => {
    return {
      status: "ok" as const
    }
  });
};
