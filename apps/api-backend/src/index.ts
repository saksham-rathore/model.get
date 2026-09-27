import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { t } from "elysia";

export const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", ({ bearer, body }) => {}, {
    body: t.Object({
      model: t.String(),
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
  });
// Only listen when run directly (`bun src/index.ts`).
// When mounted into primary-backend, importing this file must NOT
// start a second server.
if (import.meta.main) {
  app.listen(+(process.env.PORT || 4000));

  console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
}

export default app;