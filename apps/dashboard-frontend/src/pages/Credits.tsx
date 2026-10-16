import {
  useDashboard,
  DashboardLayout,
  StatCard,
  ProgressBar,
  AddCreditsCard,
  KeyBreakdownCard,
} from "../components/dashboard";
import type { DashboardPage } from "../components/dashboard/DashboardLayout";

export interface CreditsPageProps {
  onNavigate?: (page: DashboardPage | "landing") => void;
  onSignOut?: () => void;
}

export function CreditsContent(): React.JSX.Element {
  const { balance, usedCredits } = useDashboard();
  const total = balance + usedCredits;
  const percentUsed = total > 0 ? (usedCredits / total) * 100 : 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          Credits
        </h1>
        <p className="mt-1 text-zinc-400">
          Top up your balance and see which key spends it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Balance"
          value={balance.toLocaleString()}
          note="Available to spend"
        />
        <StatCard
          label="Used credits"
          value={usedCredits.toLocaleString()}
          note={`${Math.round(percentUsed)}% of all credits`}
        >
          <div className="mt-3">
            <ProgressBar percent={percentUsed} />
          </div>
        </StatCard>
        <StatCard
          label="Ever added"
          value={total.toLocaleString()}
          note="Balance + used"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <AddCreditsCard />
        <KeyBreakdownCard />
      </div>
    </>
  );
}

export function Credits({
  onNavigate,
  onSignOut,
}: CreditsPageProps): React.JSX.Element {
  return (
    <DashboardLayout
      activePage="credits"
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <CreditsContent />
    </DashboardLayout>
  );
}

export default Credits;
