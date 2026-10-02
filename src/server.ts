import fastify from "fastify";

import { app } from "./app.js";
import { config } from "./config/index.js";

const startServer = async () => {
  const server = fastify({
    logger: config.log,
    ajv: {
      customOptions: {
        allErrors: true
      }
    }
  });

  await server.register(app);
  await server.listen({ port: config.server.port, host: config.server.host });

  const shutdown = async () => {
    await server.close();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

startServer().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
