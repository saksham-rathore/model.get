import {
  useDashboard,
  DashboardLayout,
  StatCard,
  ProgressBar,
  NewKeyBanner,
  CreateKeyCard,
  ActiveKeysCard,
  ModelsTableCard,
} from "../components/dashboard";
import type { DashboardPage } from "../components/dashboard/DashboardLayout";

export interface DashboardPageProps {
  onNavigate?: (page: DashboardPage | "landing") => void;
  onSignOut?: () => void;
}

export function DashboardContent({
  onNavigate,
}: {
  onNavigate?: (page: DashboardPage | "landing") => void;
}): React.JSX.Element {
  const { balance, usedCredits, activeKeys, keys } = useDashboard();
  const total = balance + usedCredits;
  const percentUsed = total > 0 ? (usedCredits / total) * 100 : 0;
  const revokedCount = keys.length - activeKeys.length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-zinc-400">
            Your credits, keys and models at a glance.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onNavigate ? onNavigate("credits") : (window.location.hash = "credits")
          }
          className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
        >
          Add credits
        </button>
      </div>

      <NewKeyBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Credits remaining"
          value={balance.toLocaleString()}
          note={`${total.toLocaleString()} ever added`}
        />
        <StatCard
          label="Credits used"
          value={usedCredits.toLocaleString()}
          note={`${Math.round(percentUsed)}% of all credits`}
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <CreateKeyCard />
        <ActiveKeysCard
          onManageClick={() =>
            onNavigate ? onNavigate("keys") : (window.location.hash = "keys")
          }
        />
      </div>

      <ModelsTableCard />
    </>
  );
}

export function Dashboard({
  onNavigate,
  onSignOut,
}: DashboardPageProps): React.JSX.Element {
  return (
    <DashboardLayout
      activePage="dashboard"
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <DashboardContent onNavigate={onNavigate} />
    </DashboardLayout>
  );
}

export default Dashboard;
