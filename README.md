# model.get — one API key for every AI model

Sign up, create an API key, top up demo credits, and call any model through
one OpenAI-style endpoint. Includes a dashboard and a chat Playground.

## Run it

```sh
bun install

# terminal 1 — backend (primary + chat API) on http://localhost:4000
bun --watch apps/primary-backend/src/index.ts

# terminal 2 — dashboard on http://localhost:3000
bun --hot apps/dashboard-frontend/src/index.ts
```

Needs Postgres (`DATABASE_URL`) and `JWT_SECRET` — see `.env`.
Model calls also need provider keys (`OPENAI_API_KEY`, `GOOGLE_API_KEY`,
`ANTHROPIC_API_KEY`).

## How it fits together

```
dashboard-frontend (React)
        |  cookie session (httpOnly `auth` cookie)
        v
primary-backend :4000 ── mounts ──> api-backend (/api/v1/...)
   |  /auth       sign-up, sign-in, sign-out, profile
   |  /api-keys   create, list, enable/disable, delete
   |  /models     models, providers, per-model pricing
   |  /payments   demo top-up (+1,000 credits)
   |
   +-- api-backend: POST /api/v1/chat/completions
        Auth = YOUR api-key as `Authorization: Bearer <key>`
```

## How login works (no localStorage anywhere)

1. `POST /auth/sign-up` or `/auth/sign-in` checks credentials and stores a
   signed JWT in the httpOnly `auth` cookie. Sign-up logs you in immediately.
2. The frontend sends `credentials: "include"` on every call and asks
   `GET /auth/profile` ("who am I?") — that response is the only login state.
3. Private backend routes call `readUserId()` (`primary-backend/src/lib/auth-cookie.ts`)
   to turn the cookie back into a user id. No cookie / bad token → `401`.
4. `POST /auth/sign-out` clears the cookie.

## API cheat sheet

| Call | Auth | What you get |
| ---- | ---- | ------------ |
| `POST /auth/sign-up {email, password}` | — | `{id, email}` + logged in |
| `POST /auth/sign-in {email, password}` | — | `{message, email}` + logged in |
| `POST /auth/sign-out` | cookie | `{message}` |
| `GET /auth/profile` | cookie | `{email, credits}` |
| `POST /api-keys {name}` | cookie | `{id, apiKey}` (shown once) |
| `GET /api-keys` | cookie | `{apiKeys: [...]}` |
| `PUT /api-keys {id, disabled}` | cookie | `{message}` |
| `DELETE /api-keys/:id` | cookie | `{message}` |
| `GET /models` | — | `{models: [{id, name, slug, company}]}` |
| `GET /models/providers` | — | `{providers: [...]}` |
| `GET /models/:id/providers` | — | token costs per provider |
| `POST /payments/onramp` | cookie | `{message, credits}` (+1,000 demo) |
| `POST /api/v1/chat/completions {model, messages}` | Bearer api-key | LLM reply, spends credits |

Try it with curl (slug looks like `openai/gpt-4o-mini` — see `GET /models`):

```sh
curl -X POST http://localhost:4000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-api-key>" \
  -d '{"model": "openai/gpt-4o-mini", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Frontend map (start here)

- `apps/dashboard-frontend/src/lib/api.ts` — every backend call, one file.
- `apps/dashboard-frontend/src/auth.tsx` — login state (`useAuth()`).
- `apps/dashboard-frontend/src/App.tsx` — tiny hash router + auth gate.
- `.../components/dashboard/DashboardContext.tsx` — dashboard data (keys,
  models, providers, balance) straight from the API.
- `apps/dashboard-frontend/src/pages/` — `Landing, Signin, Signup,
  Dashboard, ApiKeys, Credits, Playground`.

## Backend map

- `apps/primary-backend/src/index.ts` — composes the modules below.
- `apps/primary-backend/src/lib/auth-cookie.ts` — the cookie ⇄ user-id logic.
- `apps/primary-backend/src/modules/{auth,apikeys,models,payments}/` — one
  folder per resource: `index.ts` (routes) + `service.ts` (Prisma) + `models.ts` (schemas).
- `apps/api-backend/src/` — chat route plus one adapter per provider in `llms/`.
- `packages/db/prisma/schema.prisma` — `User, ApiKey, Model, Provider,
  ModelProviderMapping, OnrampTransaction, Conversation`.
