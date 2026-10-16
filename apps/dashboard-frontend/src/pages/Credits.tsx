import React from "react";
import {
  useDashboard,
  formatMoney,
  DashboardLayout,
  StatCard,
  ProgressBar,
  AddCreditsCard,
  KeyBreakdownCard,
} from "../components/dashboard";

export interface CreditsPageProps {
  onNavigate?: (page: "dashboard" | "keys" | "credits" | "landing") => void;
  onSignOut?: () => void;
  className?: string;
}

export function CreditsContent(): React.JSX.Element {
  const { total, usedCredits, remainingCredits } = useDashboard();
  const percentUsed = total > 0 ? (usedCredits / total) * 100 : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          Credits
        </h1>
        <p className="mt-1 text-zinc-400">
          Top up your balance and see which key spends it.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total credits"
          value={formatMoney(total)}
          note="Purchased to date"
        />

        <StatCard
          label="Used credits"
          value={formatMoney(usedCredits)}
          note={`${Math.round(percentUsed)}% of total`}
        >
          <div className="mt-3">
            <ProgressBar percent={percentUsed} />
          </div>
        </StatCard>

        <StatCard
          label="Remaining"
          value={formatMoney(remainingCredits)}
          note="Available to spend"
        />
      </div>

      {/* Add Credits & Per-key breakdown */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <AddCreditsCard />
        <KeyBreakdownCard />
      </div>
    </>
  );
}

export function Credits({ onNavigate, onSignOut }: CreditsPageProps): React.JSX.Element {
  return (
    <DashboardLayout activePage="credits" onNavigate={onNavigate} onSignOut={onSignOut}>
      <CreditsContent />
    </DashboardLayout>
  );
}

export default Credits;
