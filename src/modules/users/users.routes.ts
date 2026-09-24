import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { createUserService } from "./users.service.js";
import { UserResponseSchema } from "./users.schemas.js";

export default (async (app) => {
  const users = createUserService(app);

  app.get("/me", {
    onRequest: [app.authenticate],
    schema: { response: { 200: UserResponseSchema } }
  }, async (request) => {
    const user = await users.findById(request.user.sub);

    if (!user) throw app.httpErrors.notFound();

    return user;
  });

  app.delete("/me", { onRequest: [app.authenticate] }, async (request, reply) => {
    await users.delete(request.user.sub);
    return reply.status(204).send();
  });
}) satisfies FastifyPluginAsyncTypebox;
