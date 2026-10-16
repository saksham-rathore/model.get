// ALL backend calls live here — one file to learn.
//
// primary-backend (http://localhost:4000) also mounts api-backend, so this
// single base URL covers every route: auth, api-keys, models, payments AND
// /api/v1/chat/completions.
//
// Auth uses the httpOnly `auth` cookie, so every cookie-based call sends
// `credentials: "include"`. Only the chat call is different: it uses
// `Authorization: Bearer <api-key>` like a normal public API.

// ---------------------------------------------------------------- types ---

export const API_BASE_URL = "http://localhost:4000";

export interface Profile {
  email: string;
  credits: number;
}

export interface ApiKey {
  id: string;
  apiKey: string;
  name: string;
  /** Spent credits. (Field is misspelled upstream; kept to match the API.) */
  credisConsumed: number;
  lastUsed: string | null;
  disabled: boolean;
}

export interface BackendModel {
  id: string;
  name: string;
  slug: string;
  company: { id: string; name: string; website: string };
}

export interface Provider {
  id: string;
  name: string;
  website: string;
}

export interface ModelProvider {
  id: string;
  providerId: string;
  providerName: string;
  providerWebsite: string;
  inputTokenCost: number;
  outputTokenCost: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  completions: { choices: { message: { content: string } }[] };
  inputTokensConsumed: number;
  outputTokensConsumed: number;
}

// --------------------------------------------------------------- helper ---

/** JSON fetch that throws a readable Error when the backend says no. */
async function api<T>(
  path: string,
  options?: { method?: string; body?: unknown; headers?: Record<string, string> },
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...(options?.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : `Request failed: ${options?.method ?? "GET"} ${path}`;
    throw new Error(message);
  }
  return data as T;
}

// ----------------------------------------------------------------- auth ---

export const signUp = (email: string, password: string) =>
  api<{ id: string; email: string }>("/auth/sign-up", {
    method: "POST",
    body: { email, password },
  });

export const signIn = (email: string, password: string) =>
  api<{ message: string; email: string }>("/auth/sign-in", {
    method: "POST",
    body: { email, password },
  });

export const signOut = () =>
  api<{ message: string }>("/auth/sign-out", { method: "POST" });

/** Source of truth for "who is logged in". 401 = logged out. */
export const getProfile = () => api<Profile>("/auth/profile");

// -------------------------------------------------------------- api-keys ---

export const listKeys = () => api<{ apiKeys: ApiKey[] }>("/api-keys");

export const createKey = (name: string) =>
  api<{ id: string; apiKey: string }>("/api-keys", {
    method: "POST",
    body: { name },
  });

export const setKeyEnabled = (id: string, enabled: boolean) =>
  api<{ message: string }>("/api-keys", {
    method: "PUT",
    body: { id, disabled: !enabled },
  });

export const deleteKey = (id: string) =>
  api<{ message: string }>(`/api-keys/${id}`, { method: "DELETE" });

// ---------------------------------------------------------------- models ---

export const listModels = () => api<{ models: BackendModel[] }>("/models");

export const listProviders = () =>
  api<{ providers: Provider[] }>("/models/providers");

export const listModelProviders = (modelId: string) =>
  api<{ providers: ModelProvider[] }>(`/models/${modelId}/providers`);

// --------------------------------------------------------------- payments ---

/** Demo top-up: the backend adds a fixed 1,000 credits. No card involved. */
export const addCredits = () =>
  api<{ message: string; credits: number }>("/payments/onramp", {
    method: "POST",
  });

// ------------------------------------------------------------------ chat ---
// Served by api-backend (same base URL). Auth = YOUR api-key as a Bearer
// token, exactly like OpenAI's API. Costs credits on every call.

export async function chatCompletion(params: {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}): Promise<ChatReply> {
  const res = await fetch(`${API_BASE_URL}/api/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({ model: params.model, messages: params.messages }),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : "Chat request failed";
    throw new Error(message);
  }
  return data as ChatReply;
}
