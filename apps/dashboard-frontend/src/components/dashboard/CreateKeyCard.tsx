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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      setIsSubmitting(true);
      const parsedLimit = limit ? parseFloat(limit) : null;
      await createKey(trimmed, parsedLimit);
      setName("");
      setLimit("");
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create key"}
        </button>
      </form>
    </section>
  );
}
