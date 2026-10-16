import React, { useState, useEffect } from "react";
import "./index.css";
import { FontLinks } from "./fonts";
import { SignIn, SignUp, Landing, Dashboard, Aplikeys, Credits } from "./pages";
import { DashboardProvider } from "./components/dashboard";

export type PageRoute =
  "landing" | "signin" | "signup" | "dashboard" | "keys" | "credits";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const initialRoute = resolveRoute();
    const storedLoggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("isLoggedIn") === "true";
    const isDashboardRoute =
      initialRoute === "dashboard" ||
      initialRoute === "keys" ||
      initialRoute === "credits";
    if (!storedLoggedIn && isDashboardRoute) {
      return "signin";
    }
    return initialRoute;
  });

  const checkIsLoggedIn = () => {
    return (
      isLoggedIn ||
      (typeof window !== "undefined" &&
        localStorage.getItem("isLoggedIn") === "true")
    );
  };

  useEffect(() => {
    const handleNavigation = () => {
      const nextRoute = resolveRoute();
      const isDashboardRoute =
        nextRoute === "dashboard" ||
        nextRoute === "keys" ||
        nextRoute === "credits";

      const authed = checkIsLoggedIn();

      if (!authed && isDashboardRoute) {
        setCurrentPage("signin");
        if (typeof window !== "undefined") {
          window.location.hash = "signin";
        }
      } else {
        setCurrentPage(nextRoute);
      }
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, [isLoggedIn]);

  const navigateTo = (page: PageRoute) => {
    const authed = checkIsLoggedIn();
    if (
      !authed &&
      (page === "dashboard" || page === "keys" || page === "credits")
    ) {
      setCurrentPage("signin");
      if (typeof window !== "undefined") {
        window.location.hash = "signin";
      }
      return;
    }

    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.location.hash = page === "landing" ? "" : page;
    }
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      window.location.hash = "dashboard";
    }
    setCurrentPage("dashboard");
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    navigateTo("landing");
  };

  return (
    <DashboardProvider>
      <div className="w-full min-h-screen flex flex-col bg-black">
        <FontLinks />
        {currentPage === "signup" ? (
          <SignUp
            onNavigateToSignin={() => navigateTo("signin")}
            onNavigateHome={() => navigateTo("landing")}
            onSubmit={handleSignInSuccess}
            onGoogleSignUp={handleSignInSuccess}
            onGitHubSignUp={handleSignInSuccess}
          />
        ) : currentPage === "signin" ? (
          <SignIn
            onNavigateToSignup={() => navigateTo("signup")}
            onNavigateHome={() => navigateTo("landing")}
            onSubmit={handleSignInSuccess}
            onGoogleSignIn={handleSignInSuccess}
            onGitHubSignIn={handleSignInSuccess}
          />
        ) : currentPage === "dashboard" ? (
          <Dashboard onNavigate={navigateTo} onSignOut={handleSignOut} />
        ) : currentPage === "keys" ? (
          <Aplikeys onNavigate={navigateTo} onSignOut={handleSignOut} />
        ) : currentPage === "credits" ? (
          <Credits onNavigate={navigateTo} onSignOut={handleSignOut} />
        ) : (
          <Landing
            isLoggedIn={isLoggedIn}
            onSignIn={() => navigateTo("signin")}
            onSignOut={handleSignOut}
            onSignUp={() => navigateTo("signup")}
            onDashboard={() => navigateTo("dashboard")}
          />
        )}
      </div>
    </DashboardProvider>
  );
}

export default App;
