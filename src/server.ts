import fastify from "fastify";
import app from "./app.js";

function loggerOptions() {
  const level = process.env.LOG_LEVEL ?? "silent";

  return {
    level,
    ...(level !== "silent" ? {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname"
        }
      }
    } : {}),
  };
}

async function start() {
  const server = fastify({
    logger: loggerOptions(),

    connectionTimeout: 120_000,
    requestTimeout: 60_000,
    keepAliveTimeout: 10_000,
    http: {
      headersTimeout: 15_000
    },
    ajv: {
      customOptions: {
        coerceTypes: "array",
        removeAdditional: "all",
        allErrors: true,
      }
    }
  });

  await server.register(app);

  let shuttingDown = false;

  async function shutdown(signal: NodeJS.Signals) {
    if (shuttingDown) return;
    shuttingDown = true;

    server.log.info(`Received ${signal}, starting shutdown...`);

    setTimeout(() => {
      server.log.error(`Shutdown timed out, forcing exit`);
      process.exit(1);
    }, 10_000).unref();

    try {
      await server.close();
      process.exit(0);
    } catch (err) {
      server.log.error(err, "Error during shutdown");
      process.exit(1);
    }
  }

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => void shutdown(signal));
  }

  try {
    await server.listen({ port: server.config.APP_PORT, host: server.config.APP_HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
