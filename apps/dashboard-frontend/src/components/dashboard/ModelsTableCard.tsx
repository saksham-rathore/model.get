import React, { useState, useMemo } from "react";
import { useDashboard, formatMoney } from "./DashboardContext";

export function ModelsTableCard(): React.JSX.Element {
  const { models, copyToClipboard } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return models;
    return models.filter((m) =>
      `${m.provider}/${m.name} ${m.slug || ""}`.toLowerCase().includes(q),
    );
  }, [models, searchQuery]);

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-white">
            Available models
          </h2>
          <p className="text-sm text-zinc-400">
            Live models loaded from database. Prices per 1M tokens.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label htmlFor="ms" className="sr-only">
            Search models
          </label>
          <input
            id="ms"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models"
            className="h-10 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-zinc-500 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm tabular-nums">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                Model
              </th>
              <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                Context
              </th>
              <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                Input
              </th>
              <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                Output
              </th>
              <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                Latency
              </th>
              <th className="pb-3 text-right text-xs font-medium text-zinc-400"></th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.length > 0 ? (
              filteredModels.map((m) => {
                const modelId = m.slug || `${m.provider}/${m.name}`;
                return (
                  <tr
                    key={modelId}
                    className="border-t border-white/10 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3.5 pr-4">
                      <span className="text-zinc-400">{m.provider}/</span>
                      <span className="font-semibold text-white">{m.name}</span>
                    </td>
                    <td className="pr-4 text-zinc-400">{m.context}</td>
                    <td className="pr-4 text-white font-medium">
                      {m.inputCost === 0 ? "Free" : formatMoney(m.inputCost)}
                    </td>
                    <td className="pr-4 text-white font-medium">
                      {m.outputCost === 0 ? "Free" : formatMoney(m.outputCost)}
                    </td>
                    <td className="pr-4 text-zinc-400">{m.latency} ms</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(modelId, `Copied ${modelId}`)
                        }
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                      >
                        Copy ID
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-zinc-400 text-sm"
                >
                  No models match “{searchQuery}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
