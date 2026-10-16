// Login state for the whole app.
//
// No localStorage here on purpose: the session lives in the httpOnly
// `auth` cookie, and GET /auth/profile is the source of truth.
// Reload the page and this provider simply asks the backend "who am I?"
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getProfile,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
} from "./lib/api";
import type { Profile } from "./lib/api";

interface AuthContextValue {
  /** null = logged out (or still unknown while `loading`). */
  user: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Ask the backend who we are. 401 (logged out) just means user = null.
  const refresh = useCallback(async () => {
    try {
      setUser(await getProfile());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await apiSignIn(email, password);
      await refresh();
    },
    [refresh],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      await apiSignUp(email, password); // backend logs you in right away
      await refresh();
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    try {
      await apiSignOut();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
