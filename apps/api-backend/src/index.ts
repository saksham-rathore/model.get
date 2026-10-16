// Chat API (mounted by primary-backend at /api/v1/chat/completions).
//
// How a request flows:
//   1. The caller passes one of THEIR api-keys as `Authorization: Bearer <key>`
//      (create one on the dashboard under "API keys").
//   2. We check the key exists, is enabled, and its owner has credits left.
//   3. We look up the model by slug (e.g. "openai/gpt-4o-mini").
//   4. We pick one of the model's providers at random and forward the chat.
//   5. We charge the user + record usage on the key, then return the reply.
import bearer from "@elysiajs/bearer";
import { prisma } from "db";
import { Elysia } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import { OpenAi } from "./llms/OpenAI";
import { Claude } from "./llms/Claude";
import type { LlmResponse } from "./llms/Base";

export const app = new Elysia().use(bearer()).post(
  "/api/v1/chat/completions",
  async ({ bearer: apiKey, body, status }) => {
    // No key at all -> stop here. (Prisma would ignore an `undefined`
    // filter, so we must reject this before the database query.)
    if (!apiKey) {
      return status(403, { message: "Missing api key" });
    }

    // Model slugs look like "company/model-name"; providers only need the part after "/".
    const slash = body.model.indexOf("/");
    const providerModelName =
      slash >= 0 ? body.model.slice(slash + 1) : body.model;

    // 1 + 2. Whose key is this, and can they still spend?
    const keyRow = await prisma.apiKey.findFirst({
      where: { apiKey, disabled: false, deleted: false },
      select: { apiKey: true, user: true },
    });
    if (!keyRow) {
      return status(403, { message: "Invalid api key" });
    }
    if (keyRow.user.credits <= 0) {
      return status(403, { message: "You dont have enough credits in your db" });
    }

    // 3. Does this model exist?
    const modelRow = await prisma.model.findFirst({
      where: { slug: body.model },
    });
    if (!modelRow) {
      return status(403, { message: "This is an invalid model we dont have support" });
    }

    // 4. Pick a provider for the model and forward the chat.
    const mappings = await prisma.modelProviderMapping.findMany({
      where: { modelId: modelRow.id },
      include: { provider: true },
    });
    const mapping = mappings[Math.floor(Math.random() * mappings.length)];
    if (!mapping) {
      return status(403, { message: "No provider found for this model" });
    }

    let response: LlmResponse | null = null;
    if (
      mapping.provider.name === "Google API" ||
      mapping.provider.name === "Google Vertex"
    ) {
      response = await Gemini.chat(providerModelName, body.messages);
    } else if (mapping.provider.name === "OpenAI") {
      response = await OpenAi.chat(providerModelName, body.messages);
    } else if (mapping.provider.name === "Claude API") {
      response = await Claude.chat(providerModelName, body.messages);
    }
    if (!response) {
      return status(403, { message: "No provider found for this model" });
    }

    // 5. Charge the user, record usage on the key, return the reply.
    const creditsUsed =
      (response.inputTokensConsumed * mapping.inputTokenCost +
        response.outputTokensConsumed * mapping.outputTokenCost) /
      10;
    await prisma.user.update({
      where: { id: keyRow.user.id },
      data: { credits: { decrement: creditsUsed } },
    });
    await prisma.apiKey.update({
      where: { apiKey: keyRow.apiKey },
      data: { creditsConsumed: { increment: creditsUsed } },
    });

    return response;
  },
  {
    body: Conversation,
  },
);

if (import.meta.main) {
  app.listen(+(process.env.PORT || 4000));

  console.log(
    `Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
}
