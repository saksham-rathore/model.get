import React, { useState } from "react";
import { RoutingConsole } from "./routing-console";

export interface HeroProps {
  isLoggedIn?: boolean;
  onGetApiKey?: () => void;
  onDashboard?: () => void;
  onSeeQuickstart?: () => void;
  className?: string;
}

export function Hero({
  isLoggedIn = false,
  onGetApiKey,
  onDashboard,
  onSeeQuickstart,
  className = "",
}: HeroProps): React.JSX.Element {
  const [activeWord, setActiveWord] = useState<"fastest" | "cheapest" | "reliable">("fastest");

  const wordMap: Record<string, string> = {
    fastest: "fastest",
    cheapest: "cheapest",
    reliable: "most reliable",
  };

  return (
    <section id="top" className={`py-12 sm:py-20 lg:py-28 ${className}`}>
      <div className="mx-auto grid w-full max-w-[1160px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
        <div className="grid justify-items-start gap-6">
          <h1
            style={{ "--i": 0 } as React.CSSProperties}
            className="text-6xl text-[clamp(2.8rem,1.5rem+5.2vw,5.2rem)] font-bold leading-none tracking-[-0.02em] text-white motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
          >
            One API for every AI model.
          </h1>

          <p
            style={{ "--i": 1 } as React.CSSProperties}
            className="max-w-[31em] text-[clamp(1.1rem,1rem+.5vw,1.3rem)] leading-[1.55] text-zinc-400 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
          >
            Send one request. model.get routes it to the{" "}
            <span className="font-semibold text-brand underline decoration-accent decoration-2 underline-offset-4">
              {wordMap[activeWord]}
            </span>{" "}
            model and falls back automatically if a provider fails.
          </p>

          <div
            style={{ "--i": 2 } as React.CSSProperties}
            className="flex flex-wrap gap-3 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
          >
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onDashboard}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
              >
                Dashboard
              </button>
            ) : onGetApiKey ? (
              <button
                type="button"
                onClick={onGetApiKey}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200 cursor-pointer"
              >
                Get your API key
              </button>
            ) : (
              <a
                href="#start"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200"
              >
                Get your API key
              </a>
            )}

            {onSeeQuickstart ? (
              <button
                type="button"
                onClick={onSeeQuickstart}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5 cursor-pointer"
              >
                See the quickstart
              </button>
            ) : (
              <a
                href="#developers"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-[22px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                See the quickstart
              </a>
            )}
          </div>

          <p
            style={{ "--i": 3 } as React.CSSProperties}
            className="text-[15px] text-zinc-400 motion-safe:animate-rise [animation-delay:calc(var(--i)*100ms)]"
          >
            Free credits on signup. No card required.
          </p>
        </div>

        {/* Embedded Routing Console demo */}
        <RoutingConsole />
      </div>
    </section>
  );
}

export default Hero;
