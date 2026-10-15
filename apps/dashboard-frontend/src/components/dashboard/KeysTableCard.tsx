import React from "react";
import { useDashboard, formatMoney } from "./DashboardContext";
import { ProgressBar } from "./StatCard";

export function KeysTableCard(): React.JSX.Element {
  const { keys, revokeKey, deleteKey } = useDashboard();

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <h2 className="mb-4 font-display text-lg font-bold tracking-tight text-white">
        Your keys
      </h2>

      {keys.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Name
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Key
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Created
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Usage
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Status
                </th>
                <th className="pb-3 text-right text-xs font-medium text-zinc-400"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const percent = k.limit ? (k.used / k.limit) * 100 : 0;
                return (
                  <tr
                    key={k.id}
                    className="border-t border-white/10 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3.5 pr-4 font-medium text-white">
                      {k.name}
                    </td>
                    <td className="pr-4 font-mono text-[13px] text-zinc-400">
                      mg-sk-••••{k.tail}
                    </td>
                    <td className="pr-4 text-zinc-400">{k.created}</td>
                    <td className="w-52 pr-4">
                      <div>
                        <span className="tabular-nums text-white font-medium">
                          {formatMoney(k.used)}
                        </span>
                        <span className="text-zinc-400">
                          {" "}
                          / {k.limit ? formatMoney(k.limit) : "No limit"}
                        </span>
                      </div>
                      {k.limit && (
                        <div className="mt-1.5">
                          <ProgressBar
                            percent={percent}
                            color={percent > 90 ? "bg-amber-400" : "bg-brand"}
                          />
                        </div>
                      )}
                    </td>
                    <td className="pr-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                          k.on
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        {k.on ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="text-right">
                      {k.on ? (
                        <button
                          type="button"
                          onClick={() => revokeKey(k.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => deleteKey(k.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-300 hover:bg-red-400/10 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-zinc-400 text-sm">
          You have no keys. Create one above.
        </p>
      )}
    </section>
  );
}
