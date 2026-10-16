// Data for every dashboard page. Everything here comes from the backend
// (see ../../lib/api) — no fake totals, prices, or latency.
//
//   profile balance  <- GET /auth/profile (via useAuth)
//   keys             <- GET /api-keys
//   models           <- GET /models
//   providers        <- GET /models/providers
//   model costs      <- GET /models/:id/providers (loaded on demand)
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../auth";
import {
  addCredits,
  createKey as apiCreateKey,
  deleteKey as apiDeleteKey,
  listKeys,
  listModelProviders,
  listModels,
  listProviders,
  setKeyEnabled,
} from "../../lib/api";
import type {
  ApiKey,
  BackendModel,
  ModelProvider,
  Provider,
} from "../../lib/api";

export interface NewKeyData {
  name: string;
  key: string;
}

interface DashboardContextValue {
  // raw backend data
  keys: ApiKey[];
  models: BackendModel[];
  providers: Provider[];
  // derived numbers
  balance: number;
  usedCredits: number;
  activeKeys: ApiKey[];
  // per-model provider costs, loaded on demand by model id
  providersByModel: Record<string, ModelProvider[]>;
  loadModelProviders: (modelId: string) => Promise<void>;
  // actions
  newKey: NewKeyData | null;
  createKey: (name: string) => Promise<void>;
  setKeyOn: (id: string, on: boolean) => Promise<void>;
  removeKey: (id: string) => Promise<void>;
  topUp: () => Promise<void>;
  refresh: () => Promise<void>;
  // little helpers
  toastMessage: string | null;
  showToast: (msg: string) => void;
  copyToClipboard: (text: string, label?: string) => Promise<void>;
  dismissNewKey: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, refresh: refreshAuth } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [models, setModels] = useState<BackendModel[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersByModel, setProvidersByModel] = useState<
    Record<string, ModelProvider[]>
  >({});
  const [newKey, setNewKey] = useState<NewKeyData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, label = "Copied to clipboard") => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(label);
      } catch {
        showToast("Copy blocked. Select and copy manually.");
      }
    },
    [showToast],
  );

  // Load everything the dashboard shows. Runs on login, skipped when logged out.
  const refresh = useCallback(async () => {
    if (!user) {
      setKeys([]);
      setModels([]);
      setProviders([]);
      return;
    }
    const [keysRes, modelsRes, providersRes] = await Promise.all([
      listKeys().catch(() => ({ apiKeys: [] as ApiKey[] })),
      listModels().catch(() => ({ models: [] as BackendModel[] })),
      listProviders().catch(() => ({ providers: [] as Provider[] })),
    ]);
    setKeys(keysRes.apiKeys);
    setModels(modelsRes.models);
    setProviders(providersRes.providers);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const loadModelProviders = useCallback(async (modelId: string) => {
    const res = await listModelProviders(modelId);
    setProvidersByModel((prev) => ({ ...prev, [modelId]: res.providers }));
  }, []);

  const createKey = useCallback(
    async (name: string) => {
      const created = await apiCreateKey(name); // { id, apiKey }
      setNewKey({ name, key: created.apiKey });
      showToast("Key created — copy it now, it won't be shown again");
      await refresh();
    },
    [refresh, showToast],
  );

  const setKeyOn = useCallback(
    async (id: string, on: boolean) => {
      await setKeyEnabled(id, on);
      showToast(on ? "Key enabled" : "Key revoked");
      await refresh();
    },
    [refresh, showToast],
  );

  const removeKey = useCallback(
    async (id: string) => {
      await apiDeleteKey(id);
      showToast("Key deleted");
      await refresh();
    },
    [refresh, showToast],
  );

  // Demo top-up: backend adds a fixed 1,000 credits, then we re-read the balance.
  const topUp = useCallback(async () => {
    const res = await addCredits();
    await refreshAuth();
    showToast(`Balance is now ${res.credits.toLocaleString()} credits`);
  }, [refreshAuth, showToast]);

  const dismissNewKey = useCallback(() => setNewKey(null), []);

  const balance = user?.credits ?? 0;
  const usedCredits = useMemo(
    () => keys.reduce((sum, k) => sum + (k.credisConsumed || 0), 0),
    [keys],
  );
  const activeKeys = useMemo(() => keys.filter((k) => !k.disabled), [keys]);

  return (
    <DashboardContext.Provider
      value={{
        keys,
        models,
        providers,
        balance,
        usedCredits,
        activeKeys,
        providersByModel,
        loadModelProviders,
        newKey,
        createKey,
        setKeyOn,
        removeKey,
        topUp,
        refresh,
        toastMessage,
        showToast,
        copyToClipboard,
        dismissNewKey,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
