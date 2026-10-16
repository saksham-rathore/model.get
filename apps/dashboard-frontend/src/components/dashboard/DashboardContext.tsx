import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  createApiKeyApi,
  getApiKeysApi,
  updateApiKeyApi,
  deleteApiKeyApi,
  getModelsApi,
} from "../../lib/auth";

export interface ApiKeyItem {
  id: number;
  name: string;
  tail: string;
  key?: string;
  created: string;
  limit: number | null;
  used: number;
  reqs: number;
  on: boolean;
}

export interface ModelItem {
  id: string;
  provider: string;
  name: string;
  slug: string;
  context: string;
  inputCost: number;
  outputCost: number;
  latency: number;
}

export interface NewKeyData {
  name: string;
  key: string;
}

export interface DashboardContextType {
  total: number;
  keys: ApiKeyItem[];
  models: ModelItem[];
  newKey: NewKeyData | null;
  selectedAmount: number;
  setSelectedAmount: (amt: number) => void;
  usedCredits: number;
  remainingCredits: number;
  activeKeys: ApiKeyItem[];
  toastMessage: string | null;
  showToast: (msg: string) => void;
  createKey: (name: string, limit?: number | null) => Promise<string>;
  revokeKey: (id: number) => void;
  deleteKey: (id: number) => void;
  addCredits: (amount: number) => boolean;
  dismissNewKey: () => void;
  copyToClipboard: (text: string, label?: string) => Promise<void>;
}

export const formatMoney = (n: number): string =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getTodayFormatted = (): string =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = useState(100);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [newKey, setNewKey] = useState<NewKeyData | null>(null);
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadApiKeys() {
      try {
        const res = await getApiKeysApi();
        if (isMounted && res?.apiKeys && Array.isArray(res.apiKeys)) {
          const loadedKeys: ApiKeyItem[] = res.apiKeys.map((k) => ({
            id: Number(k.id) || Date.now(),
            name: k.name,
            tail: k.apiKey.slice(-4),
            key: k.apiKey,
            created: k.lastUsed
              ? new Date(k.lastUsed).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : getTodayFormatted(),
            limit: null,
            used: (k.credisConsumed || 0) / 100,
            reqs: 0,
            on: !k.disabled,
          }));
          setKeys(loadedKeys);
        }
      } catch (err) {
        // Not authenticated yet or server error
      }
    }

    async function loadModels() {
      try {
        const res = await getModelsApi();
        if (isMounted && res?.models && Array.isArray(res.models)) {
          const loadedModels: ModelItem[] = res.models.map((m) => {
            const hasSlash = m.slug.includes("/");
            const provider =
              (hasSlash
                ? m.slug.split("/")[0]
                : m.company?.name?.toLowerCase()) || "ai";
            const modelName =
              (hasSlash
                ? m.slug.split("/")[1]
                : m.name.replace(/^[^:]+:\s*/, "")) ||
              m.name ||
              m.slug;

            const lower = m.slug.toLowerCase();
            let context = "128K";
            if (lower.includes("embedding")) context = "8K";
            else if (lower.includes("gemini")) context = "1M";
            else if (lower.includes("32b") || lower.includes("32k"))
              context = "32K";
            else if (lower.includes("claude") || lower.includes("200k"))
              context = "200K";

            const isFree = lower.includes("free");
            let inputCost = 1.5;
            let outputCost = 4.0;
            let latency = 320;

            if (isFree) {
              inputCost = 0;
              outputCost = 0;
              latency = 210;
            } else if (provider === "google") {
              inputCost = 1.25;
              outputCost = 5.0;
              latency = 290;
            } else if (provider === "anthropic") {
              inputCost = 3.0;
              outputCost = 15.0;
              latency = 420;
            } else if (provider === "openai") {
              inputCost = 2.5;
              outputCost = 10.0;
              latency = 360;
            }

            return {
              id: m.id,
              provider,
              name: modelName,
              slug: m.slug,
              context,
              inputCost,
              outputCost,
              latency,
            };
          });
          setModels(loadedModels);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
      }
    }

    loadApiKeys();
    loadModels();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = useCallback(
    (msg: string) => {
      if (toastTimer) clearTimeout(toastTimer);
      setToastMessage(msg);
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2200);
      setToastTimer(timer);
    },
    [toastTimer],
  );

  const copyToClipboard = useCallback(
    async (text: string, label = "Copied to clipboard") => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          showToast(label);
        } else {
          showToast("Clipboard unavailable");
        }
      } catch {
        showToast("Copy blocked. Select and copy manually.");
      }
    },
    [showToast],
  );

  const usedCredits = useMemo(() => {
    return keys.reduce((acc, k) => acc + k.used, 0);
  }, [keys]);

  const remainingCredits = useMemo(() => {
    return Math.max(0, total - usedCredits);
  }, [total, usedCredits]);

  const activeKeys = useMemo(() => {
    return keys.filter((k) => k.on);
  }, [keys]);

  const createKey = useCallback(
    async (name: string, limit: number | null = null): Promise<string> => {
      // Call backend API to create real API key in database
      const backendRes = await createApiKeyApi({ name });
      const generatedKey = backendRes.apiKey;
      const newId = Number(backendRes.id) || Date.now();

      const newItem: ApiKeyItem = {
        id: newId,
        name,
        tail: generatedKey.slice(-4),
        key: generatedKey,
        created: getTodayFormatted(),
        limit: limit ? Math.max(1, Math.round(limit)) : null,
        used: 0,
        reqs: 0,
        on: true,
      };

      setKeys((prev) => [newItem, ...prev]);
      setNewKey({ name, key: generatedKey });
      showToast("Key created");
      return generatedKey;
    },
    [showToast],
  );

  const revokeKey = useCallback(
    async (id: number) => {
      try {
        await updateApiKeyApi({ id: id.toString(), disabled: true });
      } catch (err) {
        console.error("Failed to revoke key on backend:", err);
      }
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, on: false } : k)),
      );
      showToast("Key revoked");
    },
    [showToast],
  );

  const deleteKey = useCallback(
    async (id: number) => {
      try {
        await deleteApiKeyApi(id.toString());
      } catch (err) {
        console.error("Failed to delete key on backend:", err);
      }
      setKeys((prev) => prev.filter((k) => k.id !== id));
      showToast("Key deleted");
    },
    [showToast],
  );

  const addCredits = useCallback(
    (amount: number): boolean => {
      if (isNaN(amount) || amount < 5 || amount > 10000) {
        showToast("Enter an amount from $5 to $10,000");
        return false;
      }
      setTotal((prev) => prev + amount);
      setSelectedAmount(amount);
      showToast(`${formatMoney(amount)} added to your balance`);
      return true;
    },
    [showToast],
  );

  const dismissNewKey = useCallback(() => {
    setNewKey(null);
  }, []);

  const value = useMemo(
    () => ({
      total,
      keys,
      models,
      newKey,
      selectedAmount,
      setSelectedAmount,
      usedCredits,
      remainingCredits,
      activeKeys,
      toastMessage,
      showToast,
      createKey,
      revokeKey,
      deleteKey,
      addCredits,
      dismissNewKey,
      copyToClipboard,
    }),
    [
      total,
      keys,
      models,
      newKey,
      selectedAmount,
      usedCredits,
      remainingCredits,
      activeKeys,
      toastMessage,
      showToast,
      createKey,
      revokeKey,
      deleteKey,
      addCredits,
      dismissNewKey,
      copyToClipboard,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextType {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
