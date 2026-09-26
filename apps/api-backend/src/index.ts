import { Elysia } from "elysia";
import { t } from "elysia";

const app = new Elysia().post("/conversation", () => {

}, {
  body: t.Object({

  })
}).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
