// Short list of enabled keys with what each one spent.
import { useDashboard } from "./DashboardContext";

export function ActiveKeysCard({
  onManageClick,
}: {
  onManageClick?: () => void;
}): React.JSX.Element {
  const { activeKeys } = useDashboard();

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-white">
            Active API keys
          </h2>
          {onManageClick ? (
            <button
              type="button"
              onClick={onManageClick}
              className="text-sm font-medium text-brand hover:underline cursor-pointer"
            >
              Manage
            </button>
          ) : (
            <a
              href="#keys"
              className="text-sm font-medium text-brand hover:underline"
            >
              Manage
            </a>
          )}
        </div>

        {activeKeys.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {activeKeys.map((k) => (
              <li
                key={k.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{k.name}</p>
                  <p className="font-mono text-[13px] text-zinc-400">
                    …{k.apiKey.slice(-4)}
                  </p>
                </div>
                <p className="flex-none text-sm tabular-nums text-zinc-300 font-medium">
                  {k.credisConsumed.toLocaleString()} credits
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-zinc-400 text-sm">
            No active keys yet. Create your first one.
          </p>
        )}
      </div>
    </section>
  );
}
