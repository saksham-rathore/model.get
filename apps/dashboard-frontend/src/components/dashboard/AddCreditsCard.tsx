import React, { useState } from "react";
import { useDashboard } from "./DashboardContext";

const PRESETS = [10, 25, 50, 100];

export function AddCreditsCard(): React.JSX.Element {
  const { selectedAmount, setSelectedAmount, addCredits } = useDashboard();
  const [customAmount, setCustomAmount] = useState<string>(
    String(selectedAmount),
  );

  const handlePreset = (v: number) => {
    setSelectedAmount(v);
    setCustomAmount(String(v));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Math.round(Number(customAmount));
    addCredits(val);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Add credits
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        Credits never expire. Demo only: no payment is taken.
      </p>

      <div
        className="mb-4 grid grid-cols-4 gap-2"
        role="group"
        aria-label="Amount"
      >
        {PRESETS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handlePreset(v)}
            aria-pressed={v === selectedAmount}
            className={`h-11 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
              v === selectedAmount
                ? "border-white bg-white text-black"
                : "border-white/15 text-zinc-300 hover:border-white/40"
            }`}
          >
            ${v}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd}>
        <label
          htmlFor="amt"
          className="mb-1.5 block text-sm font-medium text-zinc-200"
        >
          Amount (USD)
        </label>
        <input
          id="amt"
          type="number"
          min={5}
          max={10000}
          step={1}
          inputMode="numeric"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            const n = Number(e.target.value);
            if (!isNaN(n)) setSelectedAmount(n);
          }}
          className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-base text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
        />

        <button
          type="submit"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
        >
          Add credits
        </button>
      </form>
    </section>
  );
}
