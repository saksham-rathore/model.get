import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { t } from "elysia";

const app = new Elysia()
.use(bearer())
  .post(
    "/api/v1/chat/completions",
    ({ bearer, body }) => {
      console.log(bearer);
      console.log(body);
      return "hii";
    },
    {
      headers: t.Object({
        Authorization: t.String(),
        ContentType: t.Literal("application/json"),
      }),
      body: t.Object({
        models: t.String(),
        messages: t.Array(
          t.Object({
            role: t.Enum({
              user: "user",
              assistant: "assistant",
            }),
            content: t.String(),
          }),
        ),
      }),
    },
  )
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);