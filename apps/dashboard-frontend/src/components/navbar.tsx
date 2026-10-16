import React, { useState, useEffect } from "react";

export interface NavbarProps {
  isLoggedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onGetApiKey?: () => void;
  onDashboard?: () => void;
  className?: string;
}

export function Navbar({
  isLoggedIn = false,
  onSignIn,
  onSignOut,
  onGetApiKey,
  onDashboard,
  className = "",
}: NavbarProps): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`sticky z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl ${className}`}
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="relative mx-auto flex h-[68px] w-full max-w-[1160px] items-center justify-between gap-5 px-5 sm:px-8">
        <a
          href="#top"
          aria-label="model.get home"
          className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
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

        <nav
          id="nav-menu"
          aria-label="Primary"
          data-open={mobileMenuOpen}
          className="absolute inset-x-0 top-full hidden flex-col gap-0.5 border-b border-white/10 bg-black px-5 pb-5 pt-2 data-[open=true]:flex md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0"
        >
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:py-2"
          >
            Features
          </a>
          <a
            href="#developers"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:py-2"
          >
            Developers
          </a>
          <a
            href="#models"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:py-2"
          >
            Models
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:py-2"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:py-2"
          >
            FAQ
          </a>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onDashboard) {
                  e.preventDefault();
                  onDashboard();
                }
              }}
              className="text-left rounded-lg px-3 py-3.5 text-[15px] font-medium text-brand hover:text-brand-strong transition-colors hover:bg-white/5 md:py-2 cursor-pointer"
            >
              Dashboard
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Sign in to access dashboard"
              className="text-left rounded-lg px-3 py-3.5 text-[15px] font-medium text-zinc-500 opacity-40 cursor-not-allowed md:py-2"
            >
              Dashboard
            </button>
          )}

          {/* Mobile-only menu items for Sign in / Sign out */}
          <div className="mt-2 flex flex-col gap-1 border-t border-white/10 pt-2 md:hidden">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  disabled
                  title="Already signed in"
                  className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-zinc-500 opacity-40 cursor-not-allowed"
                >
                  Sign in
                </button>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    Sign out
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn?.();
                }}
                className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-zinc-400 hover:bg-white/5 hover:text-white cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                disabled
                title="Already signed in"
                className="hidden rounded-lg px-3 py-2 text-[15px] font-medium text-zinc-500 opacity-40 cursor-not-allowed sm:inline-block"
              >
                Sign in
              </button>
              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-lg px-3 py-2 text-[15px] font-medium text-zinc-400 transition-colors hover:text-white cursor-pointer"
                >
                  Sign out
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="hidden rounded-lg px-3 py-2 text-[15px] font-medium text-zinc-400 transition-colors hover:text-white sm:inline-block cursor-pointer"
            >
              Sign in
            </button>
          )}

          {onGetApiKey ? (
            <button
              type="button"
              onClick={onGetApiKey}
              className="inline-flex h-10 items-center rounded-[10px] bg-white px-4 text-[15px] font-semibold text-black transition-colors hover:bg-zinc-200 max-[400px]:hidden cursor-pointer"
            >
              Get API key
            </button>
          ) : (
            <a
              href="#start"
              className="inline-flex h-10 items-center rounded-[10px] bg-white px-4 text-[15px] font-semibold text-black transition-colors hover:bg-zinc-200 max-[400px]:hidden"
            >
              Get API key
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="nav-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/15 text-white transition-colors hover:bg-white/10 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
