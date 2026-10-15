import React, { useMemo } from "react";
import { useDashboard, formatMoney } from "./DashboardContext";
import { ProgressBar } from "./StatCard";

export function KeyBreakdownCard(): React.JSX.Element {
  const { keys, usedCredits } = useDashboard();

  const sortedKeys = useMemo(() => {
    return [...keys].sort((a, b) => b.used - a.used);
  }, [keys]);

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Per-key breakdown
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        Share of the {formatMoney(usedCredits)} used so far.
      </p>

      {sortedKeys.length > 0 ? (
        <ul className="grid gap-5">
          {sortedKeys.map((k) => {
            const percent = usedCredits > 0 ? (k.used / usedCredits) * 100 : 0;
            return (
              <li key={k.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="min-w-0 truncate font-medium text-white flex items-center gap-2">
                    <span>{k.name}</span>
                    {!k.on && (
                      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                        Revoked
                      </span>
                    )}
                  </p>
                  <p className="flex-none tabular-nums text-white text-sm">
                    {formatMoney(k.used)}{" "}
                    <span className="text-zinc-400 text-xs">
                      ({Math.round(percent)}%)
                    </span>
                  </p>
                </div>

                <ProgressBar
                  percent={percent}
                  color={k.on ? "bg-brand" : "bg-zinc-600"}
                />

                <p className="mt-1 text-xs text-zinc-400">
                  {k.reqs.toLocaleString("en-US")} requests
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-6 text-zinc-400 text-sm">No usage records yet.</p>
      )}
    </section>
  );
}
