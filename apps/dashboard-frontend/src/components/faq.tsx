import React from "react";

export interface FaqItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is model.get compatible with the OpenAI SDK?",
    answer: "Yes. Point the SDK's base URL at model.get and use your model.get key. Chat completions, streaming, tool calls and JSON mode work the same way.",
    defaultOpen: true,
  },
  {
    question: "How does routing choose a model?",
    answer: 'If you name a model, we use it. If you send "auto", you choose the priority: fastest, cheapest or most reliable. We pick from the models you allow, using live latency, price and uptime.',
  },
  {
    question: "What happens when a provider goes down?",
    answer: "The request moves to the next model in your fallback list, and the response tells you which model answered. If every option fails, you get a clear error that lists what was tried.",
  },
  {
    question: "Do you store my prompts?",
    answer: "By default we log only metadata: model, token counts, latency and cost. Prompt logging is opt-in per key, and you can restrict a key to zero-retention providers.",
  },
  {
    question: "How is pricing calculated?",
    answer: "You pay each provider's per-token price plus a flat platform fee on credits. The cost of every request is returned in the response and listed in your dashboard.",
  },
];

export interface FaqProps {
  className?: string;
}

export function Faq({ className = "" }: FaqProps): React.JSX.Element {
  return (
    <section id="faq" className={`pb-20 sm:pb-28 ${className}`}>
      <div className="mx-auto grid w-full max-w-[1160px] items-start gap-8 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div
          className="grid gap-4 lg:sticky"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 100px)" }}
        >
          <h2 className="text-balance text-[clamp(2rem,1.4rem+2.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Questions developers ask first
          </h2>
          <p className="max-w-[38em] text-[1.1875rem] text-zinc-400">
            Can't find your answer? The docs go deeper on every one of these.
          </p>
        </div>

        <div className="border-b border-white/10">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="group border-t border-white/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-1 py-[22px] text-[1.1875rem] font-semibold leading-snug tracking-tight text-white [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex-none text-3xl font-normal leading-none text-zinc-400 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[40em] px-1 pb-6 pr-10 text-zinc-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
