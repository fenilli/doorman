import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { UsersService } from "./users.service.js";
import { CreateUserBody, CreateUserResponse } from "./users.schemas.js";

export const usersRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const service = new UsersService(app.db);

  app.post("/", {
    schema: {
      body: CreateUserBody,
      response: CreateUserResponse,
    }
  }, async (request, reply) => {
    const user = await service.createUser(request.body);

    return reply.status(201).send(user);
  });
};
