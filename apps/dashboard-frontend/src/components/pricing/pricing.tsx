import React from "react";
import { PlanFree } from "./plan-free";
import { PlanPayg } from "./plan-payg";
import { PlanEnterprise } from "./plan-enterprise";

export interface PricingProps {
  isLoggedIn?: boolean;
  onSelectFree?: () => void;
  onSelectPayg?: () => void;
  onSelectEnterprise?: () => void;
  className?: string;
}

export function Pricing({
  isLoggedIn = false,
  onSelectFree,
  onSelectPayg,
  onSelectEnterprise,
  className = "",
}: PricingProps): React.JSX.Element {
  return (
    <section id="pricing" className={`pb-20 sm:pb-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <div className="mb-12 grid max-w-3xl gap-4 sm:mb-14">
          <h2 className="text-balance text-[clamp(2rem,1.4rem+2.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Pay for tokens, not for seats
          </h2>
          <p className="max-w-[38em] text-[1.1875rem] text-zinc-400">
            Top up credits and pay per request. No subscriptions and no minimums.
          </p>
        </div>

        <div className="grid max-w-[520px] gap-4 md:max-w-none md:grid-cols-3">
          <PlanFree onSelect={onSelectFree} />
          <PlanPayg isLoggedIn={isLoggedIn} onSelect={onSelectPayg} />
          <PlanEnterprise onSelect={onSelectEnterprise} />
        </div>
      </div>
    </section>
  );
}

export default Pricing;
