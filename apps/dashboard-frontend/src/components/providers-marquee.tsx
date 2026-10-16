import React from "react";

const PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral",
  "DeepSeek",
  "Qwen",
  "Cohere",
  "xAI",
  "Perplexity",
];

export interface ProvidersMarqueeProps {
  className?: string;
}

export function ProvidersMarquee({ className = "" }: ProvidersMarqueeProps): React.JSX.Element {
  return (
    <section aria-label="Supported providers" className={`pb-10 pt-2 sm:pb-16 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <p className="mb-10 text-[15px] text-zinc-400">Models from the providers your team already uses.</p>
      </div>
      <div className="overflow-hidden [-webkit-mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div
          className="flex w-max gap-12 pr-12 animate-marquee hover:[animation-play-state:paused]"
          style={{
            animation: "marquee 30s linear infinite",
            willChange: "transform",
          }}
        >
          <ul className="flex flex-none gap-12 text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-semibold tracking-tight text-zinc-500">
            {PROVIDERS.map((provider) => (
              <li key={`p1-${provider}`} className="whitespace-nowrap">
                {provider}
              </li>
            ))}
          </ul>
          <ul
            aria-hidden="true"
            className="flex flex-none gap-12 text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-semibold tracking-tight text-zinc-500"
          >
            {PROVIDERS.map((provider) => (
              <li key={`p2-${provider}`} className="whitespace-nowrap">
                {provider}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ProvidersMarquee;
