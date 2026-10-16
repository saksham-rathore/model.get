// Dashboard frame: sidebar nav + user chip + content area.
// The user chip reads the logged-in user from useAuth (cookie session) —
/// no localStorage anywhere.
import { useEffect, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { useAuth } from "../../auth";
import { useDashboard } from "./DashboardContext";

export type DashboardPage = "dashboard" | "keys" | "credits" | "playground";

export interface DashboardLayoutProps {
  activePage: DashboardPage;
  onNavigate?: (page: DashboardPage | "landing") => void;
  onSignOut?: () => void;
  children: ReactNode;
}

/** "john.doe@x.com" -> "John Doe". Fallback when we only know the email. */
function nameFromEmail(email: string): string {
  const words = (email.split("@")[0] ?? "")
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.length > 0 ? words.join(" ") : "User";
}

const NAV: { page: DashboardPage; label: string; hash: string }[] = [
  { page: "dashboard", label: "Dashboard", hash: "dashboard" },
  { page: "keys", label: "API keys", hash: "keys" },
  { page: "credits", label: "Credits", hash: "credits" },
  { page: "playground", label: "Playground", hash: "playground" },
];

export function DashboardLayout({
  activePage,
  onNavigate,
  onSignOut,
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toastMessage } = useDashboard();
  const { user } = useAuth();

  const email = user?.email ?? "";
  const displayName = email ? nameFromEmail(email) : "User";
  const displayInitial = (displayName.charAt(0) || "U").toUpperCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (page: DashboardPage | "landing", e: MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(page);
    else window.location.hash = page === "landing" ? "" : page;
  };

  return (
    <div className="min-h-screen bg-black font-sans text-[15px] leading-relaxed text-zinc-100 antialiased">
      <div className="lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
        {/* Mobile scrim */}
        <div
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
          aria-label="Sidebar"
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-black p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
        >
          <a
            href="#dashboard"
            onClick={(e) => go("dashboard", e)}
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

          <nav className="grid gap-1" aria-label="Main">
            {NAV.map((item) => (
              <a
                key={item.page}
                href={`#${item.hash}`}
                onClick={(e) => go(item.page, e)}
                aria-current={activePage === item.page ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors cursor-pointer ${
                  activePage === item.page
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Logged-in user */}
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand/20 font-semibold text-brand"
                  aria-hidden="true"
                >
                  {displayInitial}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium text-white"
                    title={displayName}
                  >
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-zinc-400" title={email}>
                    {email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSignOut?.()}
                title="Sign out"
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
            <button
              type="button"
              onClick={() => onSignOut?.()}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <header className="sticky z-30 flex h-14 items-center justify-between border-b border-white/10 bg-black/85 px-4 backdrop-blur lg:hidden">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              model<span className="text-accent">.</span>get
            </span>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
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

          <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-8 lg:py-12">
            {children}
          </main>
        </div>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-xl border border-white/15 bg-raised px-4 py-2.5 text-sm text-white shadow-xl transition-all duration-300 ${
          toastMessage ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}
