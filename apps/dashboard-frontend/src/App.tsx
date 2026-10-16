// App shell: tiny hash router + auth gate. No localStorage —
// `useAuth().user` (backed by the `auth` cookie + GET /auth/profile)
// is the only thing that decides logged-in vs logged-out.
import { useEffect, useState } from "react";
import "./index.css";
import { FontLinks } from "./fonts";
import { AuthProvider, useAuth } from "./auth";
import {
  SignIn,
  SignUp,
  Landing,
  Dashboard,
  ApiKeys,
  Credits,
  Playground,
} from "./pages";
import { DashboardProvider } from "./components/dashboard";

export type Page =
  | "landing"
  | "signin"
  | "signup"
  | "dashboard"
  | "keys"
  | "credits"
  | "playground";

const PROTECTED: Page[] = ["dashboard", "keys", "credits", "playground"];

function readHash(): Page {
  const hash = window.location.hash.toLowerCase().replace("#", "");
  if (hash === "dashboard" || hash === "keys" || hash === "credits") {
    return hash;
  }
  if (hash === "playground" || hash === "api" || hash === "apikeys") {
    return hash === "apikeys" ? "keys" : "playground";
  }
  if (hash === "signup" || hash === "signin") return hash;
  return "landing";
}

function Shell(): React.JSX.Element {
  const { user, loading, signOut } = useAuth();
  const [page, setPage] = useState<Page>(() => readHash());

  useEffect(() => {
    const onHash = () => setPage(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (next: Page) => {
    setPage(next);
    window.location.hash = next === "landing" ? "" : next;
  };

  const handleSignOut = async () => {
    await signOut();
    go("landing");
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-zinc-400">
        Loading…
      </div>
    );
  }

  // Logged-out users may only see landing / signin / signup.
  if (!user && PROTECTED.includes(page)) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-black">
        <FontLinks />
        <SignIn
          onSuccess={() => go("dashboard")}
          onNavigateToSignup={() => go("signup")}
          onNavigateHome={() => go("landing")}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-black">
      <FontLinks />
      {page === "signup" ? (
        <SignUp
          onSuccess={() => go("dashboard")}
          onNavigateToSignin={() => go("signin")}
          onNavigateHome={() => go("landing")}
        />
      ) : page === "signin" ? (
        <SignIn
          onSuccess={() => go("dashboard")}
          onNavigateToSignup={() => go("signup")}
          onNavigateHome={() => go("landing")}
        />
      ) : page === "dashboard" ? (
        <Dashboard onNavigate={go} onSignOut={handleSignOut} />
      ) : page === "keys" ? (
        <ApiKeys onNavigate={go} onSignOut={handleSignOut} />
      ) : page === "credits" ? (
        <Credits onNavigate={go} onSignOut={handleSignOut} />
      ) : page === "playground" ? (
        <Playground onNavigate={go} onSignOut={handleSignOut} />
      ) : (
        <Landing
          isLoggedIn={user !== null}
          onSignIn={() => go("signin")}
          onSignOut={handleSignOut}
          onSignUp={() => go("signup")}
          onDashboard={() => go("dashboard")}
        />
      )}
    </div>
  );
}

export function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Shell />
      </DashboardProvider>
    </AuthProvider>
  );
}

export default App;
