import React from "react";
import {
  useDashboard,
  formatMoney,
  DashboardLayout,
  StatCard,
  ProgressBar,
  NewKeyBanner,
  CreateKeyCard,
  ActiveKeysCard,
  ModelsTableCard,
} from "../components/dashboard";

export interface DashboardPageProps {
  onNavigate?: (page: "dashboard" | "keys" | "credits" | "landing") => void;
  onSignOut?: () => void;
  className?: string;
}

export function DashboardContent({ onNavigate }: { onNavigate?: (page: "dashboard" | "keys" | "credits" | "landing") => void }): React.JSX.Element {
  const { total, usedCredits, remainingCredits, keys, activeKeys } = useDashboard();
  const percentUsed = total > 0 ? (usedCredits / total) * 100 : 0;
  const revokedCount = keys.length - activeKeys.length;

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-zinc-400">Your credits, keys and models at a glance.</p>
        </div>
        <button
          type="button"
          onClick={() => (onNavigate ? onNavigate("credits") : (window.location.hash = "credits"))}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
        >
          Add credits
        </button>
      </div>

      {/* New Key Banner */}
      <NewKeyBanner />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Credits remaining"
          value={formatMoney(remainingCredits)}
          note={`of ${formatMoney(total)} purchased`}
        />

        <StatCard
          label="Credits used"
          value={formatMoney(usedCredits)}
          note={`${Math.round(percentUsed)}% of your balance`}
        >
          <div className="mt-3">
            <ProgressBar percent={percentUsed} />
          </div>
        </StatCard>

        <StatCard
          label="Active API keys"
          value={activeKeys.length}
          note={`${revokedCount} revoked`}
        />
      </div>

      {/* Forms & Active keys */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <CreateKeyCard extended={false} />
        <ActiveKeysCard onManageClick={() => (onNavigate ? onNavigate("keys") : (window.location.hash = "keys"))} />
      </div>

      {/* Models Table */}
      <ModelsTableCard />
    </>
  );
}

export function Dashboard({ onNavigate, onSignOut }: DashboardPageProps): React.JSX.Element {
  return (
    <DashboardLayout activePage="dashboard" onNavigate={onNavigate} onSignOut={onSignOut}>
      <DashboardContent onNavigate={onNavigate} />
    </DashboardLayout>
  );
}

export default Dashboard;
