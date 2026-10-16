// Full keys table: revoke/enable (PUT /api-keys) and delete (DELETE /api-keys/:id).
import { useDashboard } from "./DashboardContext";

function lastUsedLabel(lastUsed: string | null): string {
  if (!lastUsed) return "Never";
  return new Date(lastUsed).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function KeysTableCard(): React.JSX.Element {
  const { keys, setKeyOn, removeKey } = useDashboard();

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
                  Last used
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Spent
                </th>
                <th className="pb-3 pr-4 text-left text-xs font-medium text-zinc-400">
                  Status
                </th>
                <th className="pb-3 text-right text-xs font-medium text-zinc-400"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const on = !k.disabled;
                return (
                  <tr
                    key={k.id}
                    className="border-t border-white/10 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="py-3.5 pr-4 font-medium text-white">
                      {k.name}
                    </td>
                    <td className="pr-4 font-mono text-[13px] text-zinc-400">
                      …{k.apiKey.slice(-4)}
                    </td>
                    <td className="pr-4 text-zinc-400">
                      {lastUsedLabel(k.lastUsed)}
                    </td>
                    <td className="pr-4 tabular-nums text-white font-medium">
                      {k.credisConsumed.toLocaleString()}
                    </td>
                    <td className="pr-4">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                          on
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/10 text-zinc-400"
                        }`}
                      >
                        {on ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => void setKeyOn(k.id, !on)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
                      >
                        {on ? "Revoke" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeKey(k.id)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-300 hover:bg-red-400/10 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
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
