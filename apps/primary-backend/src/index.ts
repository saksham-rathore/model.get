import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";
import { app as apiKeysApp } from "./modules/apikeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

const port = process.env.PORT || 8000;

const app = new Elysia()
  .get("/", () => ({
    name: "primary-backend",
    status: "ok",
  }))
  .use(authApp)
  .use(apiKeysApp)
  .use(modelsApp)
  .use(paymentsApp)
  .listen(port);

console.log(
  `🦊 Primary backend is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
