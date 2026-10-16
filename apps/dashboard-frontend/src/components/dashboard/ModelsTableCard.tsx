// Models from the database (GET /models). Click a row to load which
// providers serve it and at what token cost (GET /models/:id/providers).
import { Fragment, useMemo, useState } from "react";
import { useDashboard } from "./DashboardContext";

export function ModelsTableCard(): React.JSX.Element {
  const { models, providersByModel, loadModelProviders, copyToClipboard } =
    useDashboard();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return models;
    return models.filter((m) =>
      `${m.slug} ${m.name} ${m.company.name}`.toLowerCase().includes(q),
    );
  }, [models, search]);

  const toggle = (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (!providersByModel[id]) void loadModelProviders(id).catch(() => {});
  };

  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-white">
            Available models
          </h2>
          <p className="text-sm text-zinc-400">
            Live from the database. Click a row for provider pricing.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label htmlFor="model-search" className="sr-only">
            Search models
          </label>
          <input
            id="model-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                Company
              </th>
              <th className="pb-3 text-right text-xs font-medium text-zinc-400"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <Fragment key={m.id}>
                <tr
                  onClick={() => toggle(m.id)}
                  className="cursor-pointer border-t border-white/10 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-3.5 pr-4 font-mono text-[13px] text-white">
                    {m.slug}
                  </td>
                  <td className="pr-4 text-zinc-400">
                    <a
                      href={m.company.website}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-white hover:underline"
                    >
                      {m.company.name}
                    </a>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void copyToClipboard(m.slug, `Copied ${m.slug}`);
                      }}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      Copy slug
                    </button>
                  </td>
                </tr>
                {openId === m.id && (
                  <tr className="border-t border-white/10">
                    <td colSpan={3} className="py-3 pr-4">
                      {(providersByModel[m.id] ?? []).length > 0 ? (
                        <ul className="grid gap-2">
                          {providersByModel[m.id]?.map((p) => (
                            <li
                              key={p.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/40 px-3 py-2 text-xs"
                            >
                              <span className="font-medium text-white">
                                {p.providerName}
                              </span>
                              <span className="tabular-nums text-zinc-400">
                                in {p.inputTokenCost} / out{" "}
                                {p.outputTokenCost} per token
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-zinc-500">
                          Loading providers…
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-zinc-400 text-sm">
                  No models match “{search}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
