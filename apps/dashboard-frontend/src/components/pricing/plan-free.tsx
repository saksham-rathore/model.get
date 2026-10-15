import React from "react";

export interface PlanFreeProps {
  onSelect?: () => void;
  className?: string;
}

export function PlanFree({
  onSelect,
  className = "",
}: PlanFreeProps): React.JSX.Element {
  return (
    <article
      className={`flex flex-col gap-[18px] rounded-3xl border border-white/10 bg-surface p-6 sm:p-9 ${className}`}
    >
      <h3 className=" text-[1.375rem] font-bold leading-tight tracking-tight text-white">
        Free
      </h3>
      <p className="flex flex-wrap items-baseline gap-2.5">
        <span className="font-display text-[2.8rem] font-bold leading-none tracking-[-0.04em] text-white">
          $0
        </span>
        <span className="text-[15px] text-zinc-400">to start</span>
      </p>
      <p className="min-h-[3.2em] text-base text-zinc-400">
        Prototype with free-tier models and a small daily limit.
      </p>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5 cursor-pointer"
        >
          Start free
        </button>
      ) : (
        <a
          href="#start"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
        >
          Start free
        </a>
      )}
      <ul className="mt-1.5 grid gap-3">
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Free-tier models
        </li>
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Community support
        </li>
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Usage dashboard
        </li>
      </ul>
    </article>
  );
}

export default PlanFree;
