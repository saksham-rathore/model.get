import {
  DashboardLayout,
  NewKeyBanner,
  CreateKeyCard,
  KeysTableCard,
} from "../components/dashboard";
import type { DashboardPage } from "../components/dashboard/DashboardLayout";

export interface ApiKeysPageProps {
  onNavigate?: (page: DashboardPage | "landing") => void;
  onSignOut?: () => void;
}

export function ApiKeysContent(): React.JSX.Element {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          API keys
        </h1>
        <p className="mt-1 text-zinc-400">
          Create keys for each app and see what each one spends.
        </p>
      </div>

      <NewKeyBanner />
      <CreateKeyCard />
      <KeysTableCard />
    </>
  );
}

export function ApiKeys({
  onNavigate,
  onSignOut,
}: ApiKeysPageProps): React.JSX.Element {
  return (
    <DashboardLayout
      activePage="keys"
      onNavigate={onNavigate}
      onSignOut={onSignOut}
    >
      <ApiKeysContent />
    </DashboardLayout>
  );
}

export default ApiKeys;
