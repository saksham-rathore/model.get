// Demo top-up: POST /payments/onramp adds a fixed 1,000 credits.
// No card, no checkout — just enough to try the Playground.
import { useState } from "react";
import { useDashboard } from "./DashboardContext";

export function AddCreditsCard(): React.JSX.Element {
  const { balance, topUp } = useDashboard();
  const [busy, setBusy] = useState(false);

  const onTopUp = async () => {
    setBusy(true);
    try {
      await topUp();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Add credits
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        Credits never expire. Demo only: no payment is taken.
      </p>

      <p className="font-display text-[2rem] font-bold leading-none tracking-tight text-white tabular-nums">
        {balance.toLocaleString()}
      </p>
      <p className="mt-2 text-sm text-zinc-400">credits available</p>

      <button
        type="button"
        onClick={() => void onTopUp()}
        disabled={busy}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50 cursor-pointer"
      >
        {busy ? "Adding…" : "Add 1,000 demo credits"}
      </button>
    </section>
  );
}
