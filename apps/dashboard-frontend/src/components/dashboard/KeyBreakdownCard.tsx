// Which key spent what share of total usage.
import { useMemo } from "react";
import { useDashboard } from "./DashboardContext";
import { ProgressBar } from "./StatCard";

export function KeyBreakdownCard(): React.JSX.Element {
  const { keys, usedCredits } = useDashboard();

  const sorted = useMemo(
    () => [...keys].sort((a, b) => b.credisConsumed - a.credisConsumed),
    [keys],
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        Per-key breakdown
      </h2>
      <p className="mb-4 mt-1 text-sm text-zinc-400">
        Share of the {usedCredits.toLocaleString()} credits used so far.
      </p>

      {sorted.length > 0 ? (
        <ul className="grid gap-5">
          {sorted.map((k) => {
            const percent =
              usedCredits > 0 ? (k.credisConsumed / usedCredits) * 100 : 0;
            return (
              <li key={k.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="min-w-0 truncate font-medium text-white flex items-center gap-2">
                    <span>{k.name}</span>
                    {k.disabled && (
                      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                        Revoked
                      </span>
                    )}
                  </p>
                  <p className="flex-none tabular-nums text-white text-sm">
                    {k.credisConsumed.toLocaleString()}{" "}
                    <span className="text-zinc-400 text-xs">
                      ({Math.round(percent)}%)
                    </span>
                  </p>
                </div>

                <ProgressBar
                  percent={percent}
                  color={k.disabled ? "bg-zinc-600" : "bg-brand"}
                />
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
