import React, { useState } from "react";
import { useDashboard } from "./DashboardContext";

export interface CreateKeyCardProps {
  extended?: boolean;
}

export function CreateKeyCard({
  extended = false,
}: CreateKeyCardProps): React.JSX.Element {
  const { createKey } = useDashboard();
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdKey, setCreatedKey] = useState<{
    name: string;
    key: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const parsedLimit = limit ? parseFloat(limit) : null;
      // createKey calls backend POST /api-keys and updates dashboard context
      const backendApiKey = await createKey(name.trim(), parsedLimit);
      setCreatedKey({
        name: name.trim(),
        key: backendApiKey,
      });
      setName("");
      setLimit("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(createdKey.key);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Create API key
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        {extended
          ? "Add a spend limit to stop a key from using more than you expect."
          : "Give each app its own key so you can track and limit it."}
      </p>

      <form
        onSubmit={handleSubmit}
        className={`grid gap-4 ${extended ? "sm:grid-cols-[1fr_180px_auto] sm:items-end" : ""}`}
      >
        <div>
          <label
            htmlFor={`kn-${extended ? "ext" : "sm"}`}
            className="mb-1.5 block text-sm font-medium text-zinc-200"
          >
            Key name
          </label>
          <input
            id={`kn-${extended ? "ext" : "sm"}`}
            type="text"
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production backend"
            className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-base text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
          />
        </div>

        {extended && (
          <div>
            <label
              htmlFor="kl"
              className="mb-1.5 block text-sm font-medium text-zinc-200"
            >
              Spend limit (optional)
            </label>
            <input
              id="kl"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="No limit"
              className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-base text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create key"}
        </button>
      </form>

      {/* Render the created backend API key directly */}
      {createdKey && (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 animate-rise">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Backend API Key Generated
              </span>
              <p className="text-sm font-medium text-white">{createdKey.name}</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-8 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-black hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
            >
              {copied ? "Copied!" : "Copy key"}
            </button>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg bg-black/60 px-3 py-2 font-mono text-[13px] text-emerald-300 selection:bg-emerald-500/30">
              {createdKey.key}
            </code>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </section>
  );
}
