import React from "react";

export interface PlanEnterpriseProps {
  onSelect?: () => void;
  className?: string;
}

export function PlanEnterprise({
  onSelect,
  className = "",
}: PlanEnterpriseProps): React.JSX.Element {
  return (
    <article
      className={`flex flex-col gap-[18px] rounded-3xl border border-white/10 bg-surface p-6 sm:p-9 ${className}`}
    >
      <h3 className=" text-[1.375rem] font-bold leading-tight tracking-tight text-white">
        Enterprise
      </h3>
      <p className="flex flex-wrap items-baseline gap-2.5">
        <span className=" text-[2.8rem] font-bold leading-none tracking-[-0.04em] text-white">
          Custom
        </span>
      </p>
      <p className="min-h-[3.2em] text-base text-zinc-400">
        Volume pricing and controls for teams with compliance needs.
      </p>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5 cursor-pointer"
        >
          Talk to us
        </button>
      ) : (
        <a
          href="#start"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
        >
          Talk to us
        </a>
      )}
      <ul className="mt-1.5 grid gap-3">
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Volume discounts
        </li>
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          SSO and audit logs
        </li>
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Private routing rules
        </li>
        <li className="relative pl-[30px] text-zinc-400 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
          Dedicated support channel
        </li>
      </ul>
    </article>
  );
}

export default PlanEnterprise;
