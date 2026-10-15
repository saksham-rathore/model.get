import React, { useState, useEffect, useRef } from "react";

export interface ModelRow {
  id: string;
  name: string;
  provider: string;
  lat: number;
  price: number;
  up: number;
}

const MODELS: ModelRow[] = [
  {
    id: "anthropic/claude-sonnet",
    name: "claude-sonnet",
    provider: "anthropic",
    lat: 420,
    price: 3.0,
    up: 99.97,
  },
  {
    id: "openai/gpt",
    name: "gpt",
    provider: "openai",
    lat: 360,
    price: 2.5,
    up: 99.95,
  },
  {
    id: "google/gemini-pro",
    name: "gemini-pro",
    provider: "google",
    lat: 290,
    price: 1.25,
    up: 99.9,
  },
  {
    id: "meta/llama-3.3-70b",
    name: "llama-3.3-70b",
    provider: "meta",
    lat: 240,
    price: 0.6,
    up: 99.8,
  },
  {
    id: "deepseek/deepseek-v3",
    name: "deepseek-v3",
    provider: "deepseek",
    lat: 510,
    price: 0.3,
    up: 99.6,
  },
];

const DEFAULT_MODEL: ModelRow = {
  id: "anthropic/claude-sonnet",
  name: "claude-sonnet",
  provider: "anthropic",
  lat: 420,
  price: 3.0,
  up: 99.97,
};

const CRITERIA = [
  { key: "fastest", label: "Fastest", metric: "lat", winnerIndex: 3 }, // meta/llama-3.3-70b
  { key: "cheapest", label: "Cheapest", metric: "price", winnerIndex: 4 }, // deepseek/deepseek-v3
  { key: "reliable", label: "Most reliable", metric: "up", winnerIndex: 0 }, // anthropic/claude-sonnet
] as const;

export interface RoutingConsoleProps {
  onCriteriaChange?: (criterion: "fastest" | "cheapest" | "reliable") => void;
  className?: string;
}

export function RoutingConsole({
  onCriteriaChange,
  className = "",
}: RoutingConsoleProps = {}): React.JSX.Element {
  const [activeCriterion, setActiveCriterion] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = CRITERIA[activeCriterion] ?? CRITERIA[0];
  const winner: ModelRow = MODELS[current.winnerIndex] ?? MODELS[0] ?? DEFAULT_MODEL;

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveCriterion((prev) => {
        const next = (prev + 1) % CRITERIA.length;
        if (onCriteriaChange) {
          const c = CRITERIA[next];
          if (c) onCriteriaChange(c.key);
        }
        return next;
      });
    }, 3400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, onCriteriaChange]);

  const handleSelectCriterion = (index: number) => {
    setActiveCriterion(index);
    setIsPaused(true);
    const c = CRITERIA[index];
    if (onCriteriaChange && c) {
      onCriteriaChange(c.key);
    }
  };

  return (
    <div
      role="group"
      aria-label="Routing demo using sample data"
      style={{ "--i": 3 } as React.CSSProperties}
      className={`min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_30px_80px_-40px_rgba(107,147,255,.35)] motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)] ${className}`}
    >
      {/* Top action bar with criteria tabs and play/pause button */}
      <div className="flex items-center justify-between gap-2.5 border-b border-white/10 px-3.5 py-3 max-sm:flex-wrap">
        <div
          className="flex gap-1 rounded-xl bg-white/5 p-1"
          role="group"
          aria-label="Routing priority"
        >
          {CRITERIA.map((crit, idx) => (
            <button
              key={crit.key}
              type="button"
              aria-pressed={activeCriterion === idx}
              onClick={() => handleSelectCriterion(idx)}
              className="chip h-8 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white aria-pressed:bg-white aria-pressed:text-black max-sm:px-2.5 max-sm:text-[13px] cursor-pointer"
            >
              {crit.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          data-state={isPaused ? "paused" : "playing"}
          aria-label={isPaused ? "Play demo" : "Pause demo"}
          onClick={() => setIsPaused((prev) => !prev)}
          className="group grid h-10 w-10 place-items-center rounded-[10px] border border-white/15 text-white transition-colors hover:bg-white/10 cursor-pointer"
        >
          {isPaused ? (
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5z" />
            </svg>
          ) : (
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
      </div>

      {/* Code snippet showing request routing */}
      <pre className="m-0 overflow-x-auto whitespace-pre bg-[#050506] px-[18px] py-3.5 font-mono text-[13px] leading-[1.75] text-zinc-200">
        <code>
          <span className="text-brand">POST</span> /v1/chat/completions{"\n"}
          {"{ "}
          <span className="text-accent">"model"</span>:{" "}
          <span className="text-accent">"auto"</span>,{" "}
          <span className="text-accent">"route"</span>:{" "}
          <span className="text-accent">"{current.key}"</span>
          {" }"}
        </code>
      </pre>

      {/* Model comparison table */}
      <div className="overflow-x-auto">
        <table
          id="route-table"
          className="w-full border-collapse text-sm max-sm:text-[13px]"
        >
          <thead>
            <tr className="text-xs font-medium text-zinc-400">
              <th
                scope="col"
                className="px-3.5 pb-2 pt-3 text-left font-medium max-sm:px-2"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-3.5 pb-2 pt-3 text-right font-medium max-sm:px-2"
              >
                Latency
              </th>
              <th
                scope="col"
                className="px-3.5 pb-2 pt-3 text-right font-medium max-sm:px-2"
              >
                $ / 1M in
              </th>
              <th
                scope="col"
                className="px-3.5 pb-2 pt-3 text-right font-medium max-sm:px-2"
              >
                Uptime
              </th>
            </tr>
          </thead>
          <tbody>
            {MODELS.map((model, idx) => {
              const isWin = idx === current.winnerIndex;
              return (
                <tr
                  key={model.id}
                  data-win={isWin}
                  className={`group/row border-t border-white/10 transition-colors duration-500 ${
                    isWin ? "bg-brand/10" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className={`px-3.5 py-3 text-left font-semibold text-white transition-shadow max-sm:px-2 ${
                      isWin ? "shadow-[inset_3px_0_0_#6B93FF]" : ""
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {model.name}
                      <svg
                        className={`h-[15px] w-[15px] flex-none text-brand ${isWin ? "visible" : "invisible"}`}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-label="Selected"
                      >
                        <path d="M3 8.5l3.2 3.2L13 4.8" />
                      </svg>
                    </span>
                    <span className="block text-xs font-normal text-zinc-400">
                      {model.provider}
                    </span>
                  </th>
                  <td
                    data-k="lat"
                    data-focus={current.metric === "lat"}
                    className={`px-3.5 py-3 text-right tabular-nums transition-colors max-sm:px-2 ${
                      current.metric === "lat"
                        ? "font-semibold text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    {model.lat} ms
                  </td>
                  <td
                    data-k="price"
                    data-focus={current.metric === "price"}
                    className={`px-3.5 py-3 text-right tabular-nums transition-colors max-sm:px-2 ${
                      current.metric === "price"
                        ? "font-semibold text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    ${model.price.toFixed(2)}
                  </td>
                  <td
                    data-k="up"
                    data-focus={current.metric === "up"}
                    className={`px-3.5 py-3 text-right tabular-nums transition-colors max-sm:px-2 ${
                      current.metric === "up"
                        ? "font-semibold text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    {model.up.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer result banner */}
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1.5 border-t border-white/10 px-[18px] py-3.5 text-sm text-zinc-400">
        <span>
          Routed to{" "}
          <strong className="font-semibold text-white">{winner.id}</strong> in{" "}
          <strong className="font-semibold text-white">{winner.lat} ms</strong>
        </span>
        <span>Sample data</span>
      </div>
    </div>
  );
}

export default RoutingConsole;
