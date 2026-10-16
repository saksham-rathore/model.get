// Playground: actually CALL the chat API (api-backend) and render the reply.
//
// Flow: pick one of your api-keys + a model slug + a message, then we POST
// /api/v1/chat/completions with `Authorization: Bearer <your-key>`.
// Each call spends credits, so the balance updates afterwards.
import { useState } from "react";
import type { FormEvent } from "react";
import {
  useDashboard,
  DashboardLayout,
} from "../components/dashboard";
import type { DashboardPage } from "../components/dashboard/DashboardLayout";
import { chatCompletion } from "../lib/api";

export interface PlaygroundPageProps {
  onNavigate?: (page: DashboardPage | "landing") => void;
  onSignOut?: () => void;
}

export function Playground({
  onNavigate,
  onSignOut,
}: PlaygroundPageProps): React.JSX.Element {
  const { keys, models, refresh } = useDashboard();
  const enabledKeys = keys.filter((k) => !k.disabled);

  const [keyId, setKeyId] = useState("");
  const [modelSlug, setModelSlug] = useState("");
  const [prompt, setPrompt] = useState("Hello! What can you do?");
  const [reply, setReply] = useState<string | null>(null);
  const [tokens, setTokens] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeKeyId = keyId || enabledKeys[0]?.id || "";
  const activeModel = modelSlug || models[0]?.slug || "";

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    const key = keys.find((k) => k.id === activeKeyId);
    if (!key || !activeModel || !prompt.trim()) return;
    setBusy(true);
    setError(null);
    setReply(null);
    setTokens(null);
    try {
      const res = await chatCompletion({
        apiKey: key.apiKey,
        model: activeModel,
        messages: [{ role: "user", content: prompt.trim() }],
      });
      setReply(res.completions.choices[0]?.message.content ?? "(empty reply)");
      setTokens(`in ${res.inputTokensConsumed} / out ${res.outputTokensConsumed} tokens`);
      await refresh(); // balance + key usage changed
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout
      activePage="playground"
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <div className="mb-8">
        <h1 className="text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          Playground
        </h1>
        <p className="mt-1 text-zinc-400">
          Send a real request through POST /api/v1/chat/completions.
        </p>
      </div>

      {enabledKeys.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-zinc-400">
          You need an enabled API key first. Create one on the{" "}
          <a href="#keys" className="text-brand hover:underline">
            API keys
          </a>{" "}
          page.
        </p>
      ) : (
        <form
          onSubmit={onSend}
          className="grid gap-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pg-key"
                className="mb-1.5 block text-sm font-medium text-zinc-200"
              >
                API key (sent as Bearer token)
              </label>
              <select
                id="pg-key"
                value={activeKeyId}
                onChange={(e) => setKeyId(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-raised px-3 text-sm text-white focus:outline-none"
              >
                {enabledKeys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} (…{k.apiKey.slice(-4)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="pg-model"
                className="mb-1.5 block text-sm font-medium text-zinc-200"
              >
                Model slug
              </label>
              <select
                id="pg-model"
                value={activeModel}
                onChange={(e) => setModelSlug(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-raised px-3 text-sm text-white focus:outline-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.slug}>
                    {m.slug}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="pg-prompt"
              className="mb-1.5 block text-sm font-medium text-zinc-200"
            >
              Message
            </label>
            <textarea
              id="pg-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-3 text-base text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20"
            />
          </div>

          <button
            type="submit"
            disabled={busy || !prompt.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
          >
            {busy ? "Sending…" : "Send chat request"}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {reply !== null && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Reply
          </h2>
          {tokens && <p className="mt-1 text-xs text-zinc-500">{tokens}</p>}
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-100">
            {reply}
          </p>
        </section>
      )}
    </DashboardLayout>
  );
}

export default Playground;
