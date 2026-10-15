import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

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
  provider: string;
  name: string;
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

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: 1,
    name: "Production backend",
    tail: "3f9a",
    created: "Sep 12, 2026",
    limit: 200,
    used: 18.42,
    reqs: 12480,
    on: true,
  },
  {
    id: 2,
    name: "Staging",
    tail: "b71c",
    created: "Sep 28, 2026",
    limit: 50,
    used: 4.9,
    reqs: 1820,
    on: true,
  },
  {
    id: 3,
    name: "Local dev",
    tail: "9d02",
    created: "Oct 02, 2026",
    limit: null,
    used: 1.15,
    reqs: 410,
    on: true,
  },
  {
    id: 4,
    name: "Old prototype",
    tail: "ae55",
    created: "Jun 01, 2026",
    limit: null,
    used: 3.4,
    reqs: 960,
    on: false,
  },
];

const INITIAL_MODELS: ModelItem[] = [
  {
    provider: "anthropic",
    name: "claude-sonnet",
    context: "200K",
    inputCost: 3,
    outputCost: 15,
    latency: 420,
  },
  {
    provider: "openai",
    name: "gpt",
    context: "128K",
    inputCost: 2.5,
    outputCost: 10,
    latency: 360,
  },
  {
    provider: "google",
    name: "gemini-pro",
    context: "1M",
    inputCost: 1.25,
    outputCost: 5,
    latency: 290,
  },
  {
    provider: "meta",
    name: "llama-3.3-70b",
    context: "128K",
    inputCost: 0.6,
    outputCost: 0.8,
    latency: 240,
  },
  {
    provider: "mistral",
    name: "mistral-large",
    context: "128K",
    inputCost: 2,
    outputCost: 6,
    latency: 330,
  },
  {
    provider: "deepseek",
    name: "deepseek-v3",
    context: "128K",
    inputCost: 0.3,
    outputCost: 1.1,
    latency: 510,
  },
  {
    provider: "qwen",
    name: "qwen-2.5-coder-32b",
    context: "32K",
    inputCost: 0.2,
    outputCost: 0.2,
    latency: 270,
  },
  {
    provider: "meta",
    name: "llama-3.2-90b-vision",
    context: "128K",
    inputCost: 0.9,
    outputCost: 0.9,
    latency: 450,
  },
];

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
  const [seq, setSeq] = useState(4);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [newKey, setNewKey] = useState<NewKeyData | null>(null);
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

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
      const bytes = new Uint8Array(16);
      if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
      }
      const hex = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");
      const generatedKey = `mg-sk-${hex}`;
      const newId = seq + 1;
      setSeq(newId);

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
    [seq, showToast],
  );

  const revokeKey = useCallback(
    (id: number) => {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, on: false } : k)),
      );
      showToast("Key revoked");
    },
    [showToast],
  );

  const deleteKey = useCallback(
    (id: number) => {
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
      models: INITIAL_MODELS,
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
