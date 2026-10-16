// Form: create an api-key (POST /api-keys). The full key is shown once
// in NewKeyBanner — the backend never returns it again.
import { useState } from "react";
import type { FormEvent } from "react";
import { useDashboard } from "./DashboardContext";

export function CreateKeyCard(): React.JSX.Element {
  const { createKey } = useDashboard();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createKey(name.trim());
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Create API key
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        Give each app its own key so you can track and revoke it.
      </p>

      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label
            htmlFor="key-name"
            className="mb-1.5 block text-sm font-medium text-zinc-200"
          >
            Key name
          </label>
          <input
            id="key-name"
            type="text"
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production backend"
            className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-base text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Creating…" : "Create key"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </section>
  );
}
