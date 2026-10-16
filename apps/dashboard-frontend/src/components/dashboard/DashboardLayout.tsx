import React, { useState, useEffect } from "react";
import { useDashboard } from "./DashboardContext";

export interface DashboardLayoutProps {
  activePage: "dashboard" | "keys" | "credits";
  onNavigate?: (page: "dashboard" | "keys" | "credits" | "landing") => void;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  activePage,
  onNavigate,
  onSignOut,
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toastMessage } = useDashboard();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLinkClick = (
    page: "dashboard" | "keys" | "credits",
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page;
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onSignOut) {
      onSignOut();
    } else if (onNavigate) {
      onNavigate("landing");
    } else {
      window.location.hash = "";
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-[15px] leading-relaxed text-zinc-100 antialiased">
      <div className="lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
        {/* Mobile Scrim */}
        <div
          id="scrim"
          aria-hidden={!mobileMenuOpen}
          onClick={() => setMobileMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Sidebar */}
        <aside
          id="side"
          aria-label="Sidebar"
          data-open={mobileMenuOpen}
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-black p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
        >
          {/* Logo */}
          <a
            href="#dashboard"
            onClick={(e) => handleLinkClick("dashboard", e)}
            className="mb-6 inline-flex items-center gap-2.5 px-2 font-display text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
            aria-label="model.get dashboard"
          >
            <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
              <rect width="30" height="30" rx="9" fill="#fff" />
              <path
                d="M6.5 15H11.5M11.5 15C16 15 15 9.5 19.5 9.5H22M11.5 15C16 15 15 20.5 19.5 20.5H22"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="23" cy="9.5" r="2" fill="#0E9F8E" />
              <circle cx="23" cy="20.5" r="2" fill="#2757E8" />
            </svg>
            <span>
              model<span className="text-accent">.</span>get
            </span>
          </a>

          {/* Navigation */}
          <nav className="grid gap-1" aria-label="Main">
            <a
              href="#dashboard"
              onClick={(e) => handleLinkClick("dashboard", e)}
              data-nav="dashboard"
              aria-current={activePage === "dashboard" ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors cursor-pointer ${
                activePage === "dashboard"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              Dashboard
            </a>

            <a
              href="#keys"
              onClick={(e) => handleLinkClick("keys", e)}
              data-nav="keys"
              aria-current={activePage === "keys" ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors cursor-pointer ${
                activePage === "keys"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="8" cy="15" r="4.5" />
                <path d="M11.2 11.8 20 3m-4 4 3 3m-5-1 2 2" />
              </svg>
              API keys
            </a>

            <a
              href="#credits"
              onClick={(e) => handleLinkClick("credits", e)}
              data-nav="credits"
              aria-current={activePage === "credits" ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors cursor-pointer ${
                activePage === "credits"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                <path d="M2.5 10h19M6.5 15h4" />
              </svg>
              Credits
            </a>
          </nav>

          {/* User profile chip */}
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand/20 font-semibold text-brand"
                  aria-hidden="true"
                >
                  A
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    Ada Lovelace
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    ada@company.com
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleHomeClick}
                title="Back to Landing / Sign out"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="min-w-0">
          {/* Mobile topbar */}
          <header
            className="sticky z-30 flex h-14 items-center justify-between border-b border-white/10 bg-black/85 px-4 backdrop-blur lg:hidden"
            style={{ top: "env(safe-area-inset-top, 0px)" }}
          >
            <a
              href="#dashboard"
              onClick={(e) => handleLinkClick("dashboard", e)}
              className="font-display text-lg font-bold tracking-tight text-white"
            >
              model<span className="text-accent">.</span>get
            </a>
            <button
              id="burger"
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="side"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </header>

          {/* Views render here */}
          <main
            id="view"
            className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-8 lg:py-12"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Toast */}
      <div
        id="toast"
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl border border-white/15 bg-raised px-4 py-2.5 text-sm text-white shadow-xl transition-all duration-300 ${
          toastMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {toastMessage}
      </div>
    </div>
  );
}
