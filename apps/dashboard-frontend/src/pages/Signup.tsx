import React, { useState } from "react";

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

export interface SignUpProps {
  onSubmit?: (data: SignUpFormData) => Promise<void> | void;
  onGoogleSignUp?: () => Promise<void> | void;
  onGitHubSignUp?: () => Promise<void> | void;
  onNavigateToSignin?: () => void;
  onNavigateHome?: () => void;
  error?: string | null;
  isLoading?: boolean;
  className?: string;
}

export function SignUp({
  onSubmit,
  onGoogleSignUp,
  onGitHubSignUp,
  onNavigateToSignin,
  onNavigateHome,
  error: externalError,
  isLoading: externalLoading = false,
  className = "",
}: SignUpProps): React.JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const displayError = externalError ?? localError;
  const isLoading = externalLoading || localLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long.");
      return;
    }

    if (!terms) {
      setLocalError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (onSubmit) {
      try {
        setLocalLoading(true);
        await onSubmit({ name, email, password, terms });
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : "Failed to create account. Please try again.");
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleCopyKey = async () => {
    const sampleKey = "mg-sk-live9f82b71a04ec3f9a";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(sampleKey);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  const handleSigninClick = (e: React.MouseEvent) => {
    if (onNavigateToSignin) {
      e.preventDefault();
      onNavigateToSignin();
    }
  };

  return (
    <div className={`w-full min-h-screen bg-black font-sans text-[17px] leading-relaxed text-zinc-100 antialiased ${className}`}>
      {/* SIGN UP: two-column layout. Left = form, right = quickstart preview (desktop only). */}
      <main className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="flex min-h-svh min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-14">
          <header className="flex items-center justify-between gap-4">
            {/* Auth logo: mark + wordmark, links home. */}
            <a
              href="/"
              onClick={handleHomeClick}
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
              <h1 className="text-balance font-display text-[clamp(2rem,1.4rem+2vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                Create your account
              </h1>
              <p className="text-base text-zinc-400">Free credits on signup. No card required.</p>
            </div>

            <div
              style={{ "--i": 1 } as React.CSSProperties}
              className="motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              {/* Social sign-in buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onGitHubSignUp}
                  aria-label="Continue with GitHub"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.03] px-4 font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/[0.07] active:translate-y-px cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  GitHub
                </button>
                <button
                  type="button"
                  onClick={onGoogleSignUp}
                  aria-label="Continue with Google"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.03] px-4 font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/[0.07] active:translate-y-px cursor-pointer"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.7 4.1-5.35 4.1-3.2 0-5.85-2.65-5.85-5.9s2.65-5.9 5.85-5.9c1.85 0 3.05.8 3.75 1.45l2.55-2.45C16.65 3.8 14.55 2.9 12 2.9 6.95 2.9 2.9 6.95 2.9 12s4.05 9.1 9.1 9.1c5.25 0 8.75-3.7 8.75-8.9 0-.6-.05-1.05-.15-1.5z" />
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <div
              style={{ "--i": 2 } as React.CSSProperties}
              className="grid gap-7 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              {/* Divider with a label in the middle. */}
              <div role="separator" className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="h-px flex-1 bg-white/10" />
                <span>or use your email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Sign-up form */}
              <form id="signup-form" onSubmit={handleSubmit} className="grid gap-5">
                {/* Form-level error banner */}
                {displayError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {displayError}
                  </div>
                )}

                <div className="grid gap-2">
                  <label htmlFor="su-name" className="text-sm font-medium text-zinc-200">
                    Full name
                  </label>
                  <input
                    id="su-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-base text-white placeholder:text-zinc-500 transition-colors hover:border-white/30 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400/20"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="su-email" className="text-sm font-medium text-zinc-200">
                    Work email
                  </label>
                  <input
                    id="su-email"
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
                  <label htmlFor="su-password" className="text-sm font-medium text-zinc-200">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="su-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder="Create a password"
                      aria-describedby="su-password-hint"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] pl-4 pr-12 text-base text-white placeholder:text-zinc-500 transition-colors hover:border-white/30 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20 aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-controls="su-password"
                      aria-pressed={showPassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                  <p id="su-password-hint" className="text-[13px] text-zinc-400">
                    Use 8 or more characters.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-zinc-300 select-none">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 h-[18px] w-[18px] flex-none cursor-pointer rounded accent-brand"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#terms" className="font-medium text-white underline underline-offset-4 hover:text-brand">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" className="font-medium text-white underline underline-offset-4 hover:text-brand">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white font-semibold text-black transition-colors hover:bg-zinc-200 active:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-black" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
            </div>

            <p
              style={{ "--i": 3 } as React.CSSProperties}
              className="text-center text-[15px] text-zinc-400 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              Already have an account?{" "}
              <a
                href="/signin"
                onClick={handleSigninClick}
                data-link="signin"
                className="font-semibold text-white underline-offset-4 hover:underline"
              >
                Sign in
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

        {/* Sign-up side panel: your key + a first request (sample values). Hidden below lg. */}
        <aside
          aria-label="Quickstart preview"
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
              <h2 className="text-balance font-display text-[clamp(2rem,1.2rem+1.8vw,3rem)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                Your first API call is a minute away.
              </h2>
              <p className="text-[1.0625rem] text-zinc-400">
                Create an account, copy your key, and send a request. Switching models later is one string.
              </p>
            </div>

            <div
              style={{ "--i": 3 } as React.CSSProperties}
              className="w-full max-w-[540px] overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-[0_30px_80px_-40px_rgba(107,147,255,.4)] backdrop-blur motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-xs text-zinc-400">Your API key</p>
                  <p className="mt-1 truncate font-mono text-[14px] text-white">
                    mg-sk-••••••••••••3f9a
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="flex-none rounded-lg bg-white/10 px-3 py-2 text-[13px] font-medium text-white transition-all hover:bg-white/20 active:scale-95 cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="m-0 overflow-x-auto whitespace-pre bg-[#050506] px-5 py-5 font-mono text-[13px] leading-[1.75] text-zinc-200">
                <code>
                  <span className="text-brand">curl</span>{" "}
                  <span className="text-accent">"https://api.model.get/v1/chat/completions"</span> \{"\n"}
                  {"  "}-H <span className="text-accent">"Authorization: Bearer $MODELGET_API_KEY"</span> \{"\n"}
                  {"  "}-d <span className="text-accent">'{"{"}"model": "auto", "route": "cheapest",{"\n"}</span>
                  <span className="text-accent">       "messages": [{"{"}"role": "user", "content": "Hello"{"}"}]'</span>
                </code>
              </pre>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3.5 text-[13px]">
                <span className="text-zinc-400">
                  Response from <span className="font-mono text-white">deepseek/deepseek-v3</span>
                </span>
                <span className="tabular-nums text-accent">200 in 506 ms</span>
              </div>
            </div>

            <ul
              style={{ "--i": 5 } as React.CSSProperties}
              className="grid gap-3 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
            >
              <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
                Free credits on signup
              </li>
              <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
                No card required
              </li>
              <li className="relative pl-[30px] text-zinc-300 before:absolute before:left-1.5 before:top-[.38em] before:h-3 before:w-1.5 before:rotate-45 before:border-b-2 before:border-r-2 before:border-accent before:content-['']">
                Works with the OpenAI SDK you already use
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}

export const Signup = SignUp;
export default SignUp;