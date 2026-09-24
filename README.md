# Doorman

Backend service for managing identities, authentication, and access control.

> **Status:** early scaffold. Email and password authentication with short-lived access tokens and rotating refresh tokens is in place. Authorization (roles and permissions) is not implemented yet.

## Requirements

- Node.js 22 or newer
- Docker (for the local PostgreSQL container)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file and fill in the values
cp .env.example .env

# 3. Start PostgreSQL
docker compose up -d

# 4. Apply database migrations
npm run db:migrate

# 5. Start the dev server
npm run dev
```

The API listens on `http://localhost:3000` by default.

## Configuration

All configuration comes from environment variables. The server refuses to start if a required variable is missing.

| Variable         | Default       | Description                                                                              |
| ---------------- | ------------- | ---------------------------------------------------------------------------------------- |
| `NODE_ENV`       | `development` | Set to `development` locally. In `production` the refresh cookie is `Secure`.            |
| `APP_PORT`       | `3000`        | Port to listen on.                                                                       |
| `APP_HOST`       | `localhost`   | Interface to bind to.                                                                    |
| `LOG_LEVEL`      | `debug`       | Pino log level. The logger is silent if `LOG_LEVEL` is unset in the process environment. |
| `RATE_LIMIT_MAX` | `100`         | Global requests per minute, per client.                                                  |
| `DB_HOST`        | `localhost`   | PostgreSQL host.                                                                         |
| `DB_PORT`        | `5432`        | PostgreSQL port.                                                                         |
| `DB_DATABASE`    | required      | Database name.                                                                           |
| `DB_USER`        | required      | Database user.                                                                           |
| `DB_PASSWORD`    | required      | Database password.                                                                       |
| `JWT_SECRET`     | required      | Secret used to sign access tokens.                                                       |
| `COOKIE_SECRET`  | required      | Secret used by the cookie plugin.                                                        |

Use long, random, distinct values for `JWT_SECRET` and `COOKIE_SECRET` outside of local development.

## Scripts

| Script                         | Description                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                  | Run the server with `tsx`, loading `.env`.                                                                                                     |
| `npm run build`                | Compile TypeScript and resolve `@/` path aliases.                                                                                              |
| `npm start`                    | Run the compiled server from `dist/`. Environment variables must be provided by the shell or platform, since this script does not load `.env`. |
| `npm run db:migrate`           | Apply all pending migrations.                                                                                                                  |
| `npm run db:rollback`          | Revert the last applied migration.                                                                                                             |
| `npm run db:rollback -- --all` | Revert every migration.                                                                                                                        |

## API

### Authentication

| Method | Path             | Auth           | Description                                                                          |
| ------ | ---------------- | -------------- | ------------------------------------------------------------------------------------ |
| `POST` | `/auth/register` | none           | Create an account. Returns `201` with an access token and sets the refresh cookie.   |
| `POST` | `/auth/login`    | none           | Log in with email and password. Returns an access token and sets the refresh cookie. |
| `POST` | `/auth/refresh`  | refresh cookie | Exchange the refresh cookie for a new access token and a rotated refresh cookie.     |
| `POST` | `/auth/logout`   | refresh cookie | Revoke the refresh token and clear the cookie. Returns `204`.                        |

Register and login take a JSON body:

```json
{ "email": "user@example.com", "password": "at-least-8-characters" }
```

Successful register, login and refresh responses look like this:

```json
{ "accessToken": "eyJhbGciOi..." }
```

### Users

| Method   | Path        | Auth         | Description                                                              |
| -------- | ----------- | ------------ | ------------------------------------------------------------------------ |
| `GET`    | `/users/me` | Bearer token | Return the current user (`id`, `email`, `created_at`).                   |
| `DELETE` | `/users/me` | Bearer token | Delete the current account and all of its refresh tokens. Returns `204`. |

Send the access token as `Authorization: Bearer <accessToken>`.

### Errors

All errors use one shape:

```json
{
  "error": {
    "code": 401,
    "message": "Invalid email or password.",
    "status": "UNAUTHENTICATED"
  }
}
```

Validation failures return `400` with `status: "INVALID_ARGUMENT"` and an `errors` array describing each invalid field. Other statuses in use are `UNAUTHENTICATED` (401), `PERMISSION_DENIED` (403), `NOT_FOUND` (404), `ALREADY_EXISTS` (409), `FAILED_PRECONDITION` (422) and `INTERNAL` (500).

## How authentication works

- **Access token:** a JWT valid for 15 minutes, sent in the `Authorization` header.
- **Refresh token:** a random 32-byte value valid for 30 days, stored in an `httpOnly`, `SameSite=Strict` cookie scoped to the `/auth` path. Only a SHA-256 hash of it is stored in the database.
- **Rotation:** every call to `/auth/refresh` revokes the presented token and issues a new one, so a refresh token can only be used once.
- **Passwords:** hashed with argon2. Login performs a hash even when the email does not exist, so response timing does not reveal which emails are registered.
- **Rate limiting:** `register`, `login` and `refresh` allow 5 requests per minute. Unknown routes are limited more strictly, and everything else follows `RATE_LIMIT_MAX`.

## Project structure

```
src/
  app.ts                  Root plugin: plugins, modules, error and not-found handlers
  server.ts               Fastify instance, logging, graceful shutdown
  plugins/                Infrastructure plugins (env, db, cookie, jwt auth, rate limit, sensible)
  modules/
    index.ts              Registers module routes with their prefixes
    auth/                 auth.routes.ts, auth.service.ts, auth.schemas.ts
    users/                users.routes.ts, users.service.ts, users.schemas.ts
  database/
    index.ts              Kysely factory
    schema.ts             Database type definition
    tables/               Table interfaces
    migrations/           Numbered migration files
    scripts/              migrate.ts, rollback.ts, migrator.ts
```

**Modules** follow one pattern. `*.service.ts` exports a factory function (for example `createUserService(app)`) that receives the Fastify instance and returns the methods. `*.routes.ts` is a Fastify plugin that builds the service and declares the routes. `*.schemas.ts` holds the TypeBox schemas. The auth module depends on the users service, never the other way around.

## Database migrations

Migrations live in `src/database/migrations/` and run in filename order, so keep the zero-padded numeric prefix:

```
001_create_users_table.ts
002_create_refresh_tokens_table.ts
```

Each file exports `up` and `down` functions. To add one, create the next numbered file, then run `npm run db:migrate`. When you add a table, also add its interface under `src/database/tables/` and register it in `src/database/schema.ts` so queries are typed.

## Graceful shutdown

The server handles `SIGINT` and `SIGTERM` by closing Fastify, which also closes the database pool. It exits with `0` on a clean shutdown and `1` if closing fails or takes longer than 10 seconds.

## License

MIT. See [LICENSE](./LICENSE).
