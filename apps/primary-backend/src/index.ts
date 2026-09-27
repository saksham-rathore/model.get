import { Elysia } from "elysia";
import { app as apiBackendApp } from "api-backend";
import { app as authApp } from "./modules/auth";
import { app as apiKeysApp } from "./modules/apikeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

const port = process.env.PORT || 4000;

const app = new Elysia()
  .get("/", () => ({
    name: "primary-backend",
    status: "ok",
  }))
  .use(authApp)
  .use(apiKeysApp)
  .use(modelsApp)
  .use(paymentsApp)
  .use(apiBackendApp)
  .listen(port);

console.log(
  `🦊 Primary backend is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;