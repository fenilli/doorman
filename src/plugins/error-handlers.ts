import { FastifyError } from "fastify";
import fp from "fastify-plugin";

import { DomainError } from "@/core/errors.js";

export const errorHandlersPlugin = fp(async (app) => {
  app.setErrorHandler((error: FastifyError | DomainError | Error, request, reply) => {
    if ("validation" in error && error.validation) {
      const violations = error.validation.map(v => ({
        field: v.instancePath ? v.instancePath.replace(/^\//, "") : v.params.missingProperty || "",
        description: v.message || "Invalid value"
      }));

      return reply.status(400).send({
        message: "Request field validation failed",
        code: "BAD_REQUEST",
        violations,
      });
    }

    if (error instanceof DomainError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        code: error.code,
      });
    }

    if ("statusCode" in error && "code" in error
      && error.statusCode !== undefined
      && error.statusCode < 500
    ) {
      return reply.status(error.statusCode).send({
        message: error.message,
        code: error.code,
      });
    }

    request.log.error(error, "Unhandled exception");

    return reply.status(500).send({
      message: "An unexpected internal server error occurred.",
      code: "INTERNAL_SERVER_ERROR"
    });
  });

  app.setNotFoundHandler({
    preHandler: app.rateLimit({
      max: 3,
      timeWindow: 500,
    })
  }, (_, reply) => {
    return reply.status(404).send({
      message: "The requested resource was not found.",
      code: "NOT_FOUND",
    })
  });
}, { name: "error-handler-plugin", dependencies: ["rate-limit-plugin"] });
