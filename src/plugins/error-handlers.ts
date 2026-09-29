import { FastifyError } from "fastify";
import fp from "fastify-plugin";

const statusByHttpCode: Record<number, string> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  402: "PAYMENT_REQUIRED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "METHOD_NOT_ALLOWED",
  406: "NOT_ACCEPTABLE",
  407: "PROXY_AUTHENTICATION_REQUIRED",
  408: "REQUEST_TIMEOUT",
  409: "CONFLICT",
  410: "GONE",
  411: "LENGTH_REQUIRED",
  412: "PRECONDITION_FAILED",
  413: "PAYLOAD_TOO_LARGE",
  414: "URI_TOO_LONG",
  415: "UNSUPPORTED_MEDIA_TYPE",
  416: "RANGE_NOT_SATISFIABLE",
  417: "EXPECTATION_FAILED",
  418: "IMATEAPOT",
  421: "MISDIRECTED_REQUEST",
  422: "UNPROCESSABLE_ENTITY",
  423: "LOCKED",
  424: "FAILED_DEPENDENCY",
  425: "TOO_EARLY",
  426: "UPGRADE_REQUIRED",
  428: "PRECONDITION_REQUIRED",
  429: "TOO_MANY_REQUESTS",
  431: "REQUEST_HEADER_FIELDS_TOO_LARGE",
  451: "UNAVAILABLE_FOR_LEGAL_REASONS",
  500: "INTERNAL_SERVER_ERROR"
};

export const errorHandlersPlugin = fp(async (app) => {
  app.setErrorHandler((err: FastifyError, request, reply) => {
    if (err.validation) {
      const violations = err.validation.map(err => {
        const field = err.instancePath.replace(/^\//, "") || err.params.missingProperty || "field";

        return {
          field,
          description: err.message
        }
      });

      return reply.status(400).send({
        error: {
          status: statusByHttpCode[400],
          message: "Validation failed for incoming request data.",
          violations,
        }
      });
    }

    const statusCode = err.statusCode ?? 500;

    if (statusCode < 500) {
      return reply.status(statusCode).send({
        error: {
          status: statusByHttpCode[statusCode] ?? statusByHttpCode[500],
          message: err.message,
        }
      });
    }

    request.log.error(err);

    return reply.status(500).send({
      error: {
        status: statusByHttpCode[500],
        message: "An unexpected internal server error occurred."
      }
    });
  });

  app.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({
      error: {
        status: statusByHttpCode[404],
        message: "The requested resource was not found."
      }
    })
  });
}, { name: "error-handler-plugin" });
