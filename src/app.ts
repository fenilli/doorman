import fp from "fastify-plugin";
import type { FastifyError } from "fastify";

import plugins from "./plugins/index.js";
import modules from "./modules/index.js";

export default fp(async (app) => {
  await app.register(plugins);

  app.register(modules);

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) {
      const formattedErrors = error.validation.map(err => {
        const fieldName = err.instancePath.replace(/^\//, "") || err.params.missingProperty || "root";

        return {
          domain: "global",
          reason: err.keyword,
          message: err.message,
          location: fieldName,
          locationType: error.validationContext || "body"
        };
      });

      return reply.status(400).send({
        error: {
          code: 400,
          message: "The request is missing required fields or has invalid parameters.",
          status: "INVALID_ARGUMENT",
          errors: formattedErrors,
        }
      });
    }

    if (error.statusCode && error.statusCode < 500) {
      const statusMap: Record<number, string> = {
        401: "UNAUTHENTICATED",
        403: "PERMISSION_DENIED",
        404: "NOT_FOUND",
        409: "ALREADY_EXISTS",
        422: "FAILED_PRECONDITION",
      };

      return reply.status(error.statusCode).send({
        error: {
          code: error.statusCode,
          message: error.message,
          status: statusMap[error.statusCode] || "CLIENT_ERROR",
        }
      });
    }

    request.log.error({
      error,
      request: {
        method: request.method,
        url: request.url,
        query: request.query,
        params: request.params,
      },
    }, "Unhandled error occurred");

    return reply.status(500).send({
      error: {
        code: 500,
        message: "An internal error occurred on the server.",
        status: "INTERNAL"
      }
    });
  });

  app.setNotFoundHandler({
    preHandler: app.rateLimit({
      max: 3,
      timeWindow: 500,
    })
  }, (request, reply) => {
    return reply.status(404).send({
      error: {
        code: 404,
        message: `The requested URL '${request.url}' was not found on this server.`,
        status: "NOT_FOUND",
      }
    })
  });
});
