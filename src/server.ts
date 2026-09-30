import fastify from "fastify";

import { app } from "./app.js";
import { createConfig } from "./config/index.js";

const startServer = async () => {
  const config = createConfig();

  const server = fastify({
    logger: config.server.logger,
    ajv: {
      customOptions: {
        allErrors: true
      }
    }
  });

  await server.register(app, { config });
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
