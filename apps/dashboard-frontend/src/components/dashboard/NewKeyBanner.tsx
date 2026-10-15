import React from "react";
import { useDashboard } from "./DashboardContext";

export function NewKeyBanner(): React.JSX.Element | null {
  const { newKey, dismissNewKey, copyToClipboard } = useDashboard();

  if (!newKey) return null;

  return (
    <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-5 animate-rise">
      <p className="font-semibold text-white">Copy your new key now</p>
      <p className="text-sm text-zinc-300">
        “{newKey.name}” is shown only once. This is a demo key, not a real
        credential.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg bg-black/60 px-3 py-2.5 font-mono text-[13px] text-white selection:bg-brand/40">
          {newKey.key}
        </code>
        <button
          type="button"
          onClick={() => copyToClipboard(newKey.key, "Key copied to clipboard")}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
        >
          Copy
        </button>
        <button
          type="button"
          onClick={dismissNewKey}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/5 cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
