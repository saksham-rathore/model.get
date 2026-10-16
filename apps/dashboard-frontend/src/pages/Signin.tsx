import React, { useState } from "react";
import { useAuth } from "../auth";

export interface SignInProps {
  onSuccess?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateHome?: () => void;
  className?: string;
}

export function SignIn({
  onSuccess,
  onNavigateToSignup,
  onNavigateHome,
  className = "",
}: SignInProps): React.JSX.Element {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password); // POST /auth/sign-in, then GET /auth/profile
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    if (onNavigateToSignup) {
      e.preventDefault();
      onNavigateToSignup();
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-black font-sans text-[17px] leading-relaxed text-zinc-100 antialiased ${className}`}
    >
      {/* SIGN IN: two-column layout. Left = form, right = product preview (desktop only). */}
      <main className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="flex min-h-svh min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-14">
          <header className="flex items-center justify-between gap-4">
            {/* Auth logo: mark + wordmark, links home. */}
            <a
              href="/"
              onClick={handleHomeClick}
              aria-label="model.get home"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                aria-hidden="true"
              >
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
            <a
              href="/"
              onClick={handleHomeClick}
              className="text-[15px] font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Back to home
            </a>
          </header>

          <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center gap-7 py-12">
            <div
              style={{ "--i": 0 } as React.CSSProperties}
              className="grid gap-2.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              <h1 className="text-balance text-[clamp(2rem,1.4rem+2vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                Welcome back
              </h1>
              <p className="text-base text-zinc-400">
                Sign in to manage your keys, models and usage.
              </p>
            </div>

            <div
              style={{ "--i": 1 } as React.CSSProperties}
              className="grid gap-7 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              {/* Sign-in form */}
              <form
                id="signin-form"
                onSubmit={handleSubmit}
                className="grid gap-5"
              >
                {/* Form-level error banner */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </div>
                )}

                <div className="grid gap-2">
                  <label
                    htmlFor="si-email"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Email
                  </label>
                  <input
                    id="si-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-base text-white placeholder:text-zinc-500 transition-colors hover:border-white/30 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400/20"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="si-password"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="si-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] pl-4 pr-12 text-base text-white placeholder:text-zinc-500 transition-colors hover:border-white/30 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-controls="si-password"
                      aria-pressed={showPassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="group absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      {showPassword ? (
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
                          <path d="M17.9 17.9A10.1 10.1 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 4.1-5.1M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.2 3.2M1 1l22 22M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </svg>
                      ) : (
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
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white font-semibold text-black transition-colors hover:bg-zinc-200 active:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>

            <p
              style={{ "--i": 3 } as React.CSSProperties}
              className="text-center text-[15px] text-zinc-400 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              New to model.get?{" "}
              <a
                href="/signup"
                onClick={handleSignupClick}
                data-link="signup"
                className="font-semibold text-white underline-offset-4 hover:underline"
              >
                Create an account
              </a>
            </p>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span>&copy; 2026 model.get</span>
            <span className="flex gap-5">
              <a href="#terms" className="transition-colors hover:text-white">
                Terms
              </a>
              <a href="#privacy" className="transition-colors hover:text-white">
                Privacy
              </a>
            </span>
          </footer>
        </section>

        {/* Sign-in side panel: a live request feed (sample data). Hidden below lg. */}
        <aside
          aria-label="Product preview"
          className="relative hidden min-w-0 overflow-hidden border-l border-white/10 bg-surface lg:flex"
        >
          {/* Decorative background: the logo's routing mark, drawn huge and very faint. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-32 h-[680px] w-[680px] text-white/[0.07]"
            viewBox="4 6 22 18"
            fill="none"
            stroke="currentColor"
            strokeWidth=".09"
            strokeLinecap="round"
          >
            <path d="M6.5 15H11.5M11.5 15C16 15 15 9.5 19.5 9.5H22M11.5 15C16 15 15 20.5 19.5 20.5H22" />
            <circle cx="23" cy="9.5" r="1.1" />
            <circle cx="23" cy="20.5" r="1.1" />
          </svg>

          <div className="relative flex w-full flex-col justify-between gap-12 p-12 xl:p-16">
            <div
              style={{ "--i": 1 } as React.CSSProperties}
              className="grid max-w-[30rem] gap-4 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              <h2 className="text-balance text-[clamp(2rem,1.2rem+1.8vw,3rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                Pick up where your routing left off.
              </h2>
              <p className="text-[1.0625rem] text-zinc-400">
                Watch requests land on the right model, check what they cost,
                and tune fallbacks from one dashboard.
              </p>
            </div>

            <div
              style={{ "--i": 3 } as React.CSSProperties}
              className="w-full max-w-[540px] overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-[0_30px_80px_-40px_rgba(107,147,255,.4)] backdrop-blur motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="relative flex h-2.5 w-2.5"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                  <span className="text-sm font-medium text-white">
                    Live requests
                  </span>
                </div>
                <span className="text-xs text-zinc-400">Sample data</span>
              </div>

              <ul>
                <li
                  style={{ "--i": 5 } as React.CSSProperties}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-white">
                      anthropic/claude-sonnet
                    </p>
                    <p className="text-xs text-zinc-400">
                      Most reliable, 2s ago
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tabular-nums text-white">
                      412 ms
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      $0.0084
                    </p>
                  </div>
                </li>
                <li
                  style={{ "--i": 6 } as React.CSSProperties}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 px-5 py-3.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-white">
                      meta/llama-3.3-70b
                    </p>
                    <p className="text-xs text-zinc-400">Fastest, 5s ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tabular-nums text-white">
                      238 ms
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      $0.0006
                    </p>
                  </div>
                </li>
                <li
                  style={{ "--i": 7 } as React.CSSProperties}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 px-5 py-3.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-white">
                      deepseek/deepseek-v3
                    </p>
                    <p className="text-xs text-zinc-400">Cheapest, 9s ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tabular-nums text-white">
                      506 ms
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      $0.0003
                    </p>
                  </div>
                </li>
                <li
                  style={{ "--i": 8 } as React.CSSProperties}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 px-5 py-3.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      <span className="truncate font-mono text-[13px] text-white">
                        openai/gpt
                      </span>
                      <span className="flex-none rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-300">
                        fallback
                      </span>
                    </p>
                    <p className="text-xs text-zinc-400">
                      After a timeout on google/gemini-pro, 14s ago
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tabular-nums text-white">
                      357 ms
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      $0.0051
                    </p>
                  </div>
                </li>
                <li
                  style={{ "--i": 9 } as React.CSSProperties}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 px-5 py-3.5 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[13px] text-white">
                      google/gemini-pro
                    </p>
                    <p className="text-xs text-zinc-400">Fastest, 21s ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tabular-nums text-white">
                      291 ms
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      $0.0021
                    </p>
                  </div>
                </li>
              </ul>

              <dl className="grid grid-cols-3 border-t border-white/10 bg-white/[0.03]">
                <div className="px-5 py-4">
                  <dt className="text-xs text-zinc-400">Requests today</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-white">
                    12,480
                  </dd>
                </div>
                <div className="border-l border-white/10 px-5 py-4">
                  <dt className="text-xs text-zinc-400">Spend</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-white">
                    $18.42
                  </dd>
                </div>
                <div className="border-l border-white/10 px-5 py-4">
                  <dt className="text-xs text-zinc-400">Success rate</dt>
                  <dd className="mt-0.5 text-lg font-semibold tabular-nums text-white">
                    99.97%
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export const Signin = SignIn;
export default SignIn;
