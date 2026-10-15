import React from "react";

export interface CtaProps {
  onCreateAccount?: () => void;
  onReadQuickstart?: () => void;
  className?: string;
}

export function Cta({ onCreateAccount, onReadQuickstart, className = "" }: CtaProps): React.JSX.Element {
  return (
    <section id="start" className={`pb-20 sm:pb-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <div className="grid justify-items-start gap-5 rounded-[28px] bg-brand-strong p-8 text-white sm:p-14 lg:p-20">
          <h2 className="max-w-[16em] text-balance text-[clamp(2rem,1.3rem+3vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.035em]">
            Get your API key and make your first call today.
          </h2>
          <p className="text-[1.1875rem] text-white/85">Free credits on signup. No card required.</p>
          <div className="mt-2.5 flex flex-wrap gap-3">
            {onCreateAccount ? (
              <button
                type="button"
                onClick={onCreateAccount}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200 focus-visible:outline-white cursor-pointer"
              >
                Create free account
              </button>
            ) : (
              <a
                href="#signup"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-[22px] font-semibold text-black transition-colors hover:bg-zinc-200 focus-visible:outline-white"
              >
                Create free account
              </a>
            )}

            {onReadQuickstart ? (
              <button
                type="button"
                onClick={onReadQuickstart}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/45 px-[22px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-white cursor-pointer"
              >
                Read the quickstart
              </button>
            ) : (
              <a
                href="#developers"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/45 px-[22px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-white"
              >
                Read the quickstart
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
