import React from "react";

export interface StepsProps {
  className?: string;
}

const STEPS = [
  {
    step: 1,
    title: "Create a key",
    description: "Sign up, add credits if you want them, and generate an API key with its own limits.",
    code: "MODELGET_API_KEY=mg-...",
  },
  {
    step: 2,
    title: "Pick a model, or let us pick",
    description: (
      <>
        Name a model directly, or use <em>auto</em> and tell us whether to favor speed, price or uptime.
      </>
    ),
    code: '"model": "auto"',
  },
  {
    step: 3,
    title: "Ship, then watch usage",
    description: "Track spend, latency and errors per key. Change models any time without a redeploy.",
    code: 'route: "cheapest"',
  },
];

export function Steps({ className = "" }: StepsProps): React.JSX.Element {
  return (
    <section id="how" className={`pb-20 sm:pb-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <div className="mb-12 grid max-w-3xl gap-4 sm:mb-14">
          <h2 className="text-balance text-[clamp(2rem,1.4rem+2.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            From sign-up to first response in three steps
          </h2>
        </div>

        <ol className="grid gap-8 md:grid-cols-3 md:gap-9">
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="relative grid content-start gap-3 pt-16 before:absolute before:left-[52px] before:right-[-36px] before:top-[22px] before:h-px before:bg-white/10 before:content-[''] last:before:hidden max-md:pl-[66px] max-md:pt-0 max-md:before:bottom-[-28px] max-md:before:left-[21px] max-md:before:right-auto max-md:before:top-[52px] max-md:before:h-auto max-md:before:w-px"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black text-lg font-bold text-white"
              >
                {item.step}
              </span>
              <h3 className="text-[1.375rem] font-bold leading-tight tracking-tight text-white">
                {item.title}
              </h3>
              <p className="max-w-[24em] text-base text-zinc-400">{item.description}</p>
              <code className="mt-1 inline-block max-w-full justify-self-start break-words rounded-lg bg-white/10 px-2.5 py-1.5 font-mono text-[13px] text-white">
                {item.code}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Steps;
