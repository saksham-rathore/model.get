import React from "react";
import {
  DashboardLayout,
  NewKeyBanner,
  CreateKeyCard,
  KeysTableCard,
} from "../components/dashboard";

export interface ApiKeysPageProps {
  onNavigate?: (page: "dashboard" | "keys" | "credits" | "landing") => void;
  className?: string;
}

export function ApiKeysContent(): React.JSX.Element {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.4rem)] font-bold leading-tight tracking-[-0.03em] text-white">
          API keys
        </h1>
        <p className="mt-1 text-zinc-400">
          Create keys for each app and see what each one spends.
        </p>
      </div>

      {/* New Key Banner */}
      <NewKeyBanner />

      {/* Extended Create Key Form (with Spend Limit) */}
      <CreateKeyCard extended={true} />

      {/* Full Keys Table */}
      <KeysTableCard />
    </>
  );
}

export function Aplikeys({ onNavigate }: ApiKeysPageProps): React.JSX.Element {
  return (
    <DashboardLayout activePage="keys" onNavigate={onNavigate}>
      <ApiKeysContent />
    </DashboardLayout>
  );
}

export const ApiKeys = Aplikeys;
export default Aplikeys;
