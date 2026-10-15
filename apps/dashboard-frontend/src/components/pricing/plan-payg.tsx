import React from "react";

export interface PlanPaygProps {
  onSelect?: () => void;
  className?: string;
}

export function PlanPayg({ onSelect, className = "" }: PlanPaygProps): React.JSX.Element {
  return (
    <article
      className={`flex flex-col gap-[18px] rounded-3xl border border-brand/60 bg-raised p-6 shadow-[0_0_0_1px_rgba(107,147,255,.25),0_30px_80px_-40px_rgba(107,147,255,.45)] sm:p-9 ${className}`}
    >
      <h3 className=" text-[1.375rem] font-bold leading-tight tracking-tight text-white">
        Pay as you go
      </h3>
      <p className="flex flex-wrap items-baseline gap-2.5">
        <span className="font-display text-[2.8rem] font-bold leading-none tracking-[-0.04em] text-white">
          +5%
        </span>
        <span className="text-[15px] text-zinc-400">on provider prices</span>
      </p>
      <p className="min-h-[3.2em] text-base text-zinc-400">
        Every model and provider, billed per token from your credit balance.
      </p>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
        >
          Get your API key
        </button>
      ) : (
        <a
          href="#start"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200"
        >
          Get your API key
        </a>
      )}
      <ul className="mt-1.5 grid gap-3">
        <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          All models and providers
        </li>
        <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Automatic routing and fallbacks
        </li>
        <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Per-key limits and privacy rules
        </li>
        <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Email support
        </li>
      </ul>
    </article>
  );
}

export default PlanPayg;
