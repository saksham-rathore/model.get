import React, { useState, useEffect } from "react";
import "./index.css";
import { FontLinks } from "./fonts";
import { SignIn, SignUp, Landing, Dashboard, Aplikeys, Credits } from "./pages";
import { DashboardProvider } from "./components/dashboard";

export type PageRoute = "landing" | "signin" | "signup" | "dashboard" | "keys" | "credits";

function resolveRoute(): PageRoute {
  if (typeof window !== "undefined") {
    const hash = window.location.hash.toLowerCase().replace("#", "");
    const path = window.location.pathname.toLowerCase();

    if (hash === "dashboard" || path === "/dashboard") return "dashboard";
    if (
      hash === "keys" ||
      hash === "apikeys" ||
      hash === "api-keys" ||
      hash === "api" ||
      path === "/keys" ||
      path === "/apikeys"
    )
      return "keys";
    if (hash === "credits" || path === "/credits") return "credits";
    if (hash === "signup" || path === "/signup") return "signup";
    if (hash === "signin" || path === "/signin") return "signin";
  }
  return "landing";
}

export function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<PageRoute>(resolveRoute);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPage(resolveRoute());
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.location.hash = page === "landing" ? "" : page;
    }
  };

  return (
    <DashboardProvider>
      <div className="w-full min-h-screen flex flex-col bg-black">
        <FontLinks />
        {currentPage === "signup" ? (
          <SignUp
            onNavigateToSignin={() => navigateTo("signin")}
            onNavigateHome={() => navigateTo("landing")}
            onSubmit={() => navigateTo("dashboard")}
            onGoogleSignUp={() => navigateTo("dashboard")}
            onGitHubSignUp={() => navigateTo("dashboard")}
          />
        ) : currentPage === "signin" ? (
          <SignIn
            onNavigateToSignup={() => navigateTo("signup")}
            onNavigateHome={() => navigateTo("landing")}
            onSubmit={() => navigateTo("dashboard")}
            onGoogleSignIn={() => navigateTo("dashboard")}
            onGitHubSignIn={() => navigateTo("dashboard")}
          />
        ) : currentPage === "dashboard" ? (
          <Dashboard onNavigate={navigateTo} />
        ) : currentPage === "keys" ? (
          <Aplikeys onNavigate={navigateTo} />
        ) : currentPage === "credits" ? (
          <Credits onNavigate={navigateTo} />
        ) : (
          <Landing
            onSignIn={() => navigateTo("signin")}
            onSignUp={() => navigateTo("signup")}
            onDashboard={() => navigateTo("dashboard")}
          />
        )}
      </div>
    </DashboardProvider>
  );
}

export default App;
