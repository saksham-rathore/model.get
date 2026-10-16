import React from "react";

export interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps): React.JSX.Element {
  return (
    <footer className={`border-t border-white/10 pb-10 pt-14 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-9 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-full grid content-start justify-items-start gap-3.5 lg:col-span-1">
            <a
              href="#top"
              aria-label="model.get home"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
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
            <p className="max-w-[26em] text-[15.5px] text-zinc-400">
              A single API for hundreds of AI models, with routing, fallbacks and clear pricing.
            </p>
          </div>

          {/* Product navigation */}
          <nav aria-label="Product">
            <h3 className="mb-3.5 text-[15px] font-semibold text-white">Product</h3>
            <ul className="grid gap-2.5 text-[15.5px]">
              <li>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#models"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Models
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </nav>

          {/* Developers navigation */}
          <nav aria-label="Developers">
            <h3 className="mb-3.5 text-[15px] font-semibold text-white">Developers</h3>
            <ul className="grid gap-2.5 text-[15.5px]">
              <li>
                <a
                  href="#developers"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Quickstart
                </a>
              </li>
              <li>
                <a
                  href="#developers"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  API reference
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Company navigation */}
          <nav aria-label="Company">
            <h3 className="mb-3.5 text-[15px] font-semibold text-white">Company</h3>
            <ul className="grid gap-2.5 text-[15.5px]">
              <li>
                <a
                  href="#top"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#top"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#top"
                  className="text-zinc-400 hover:text-white hover:underline hover:underline-offset-[3px] transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Legal bar */}
        <div className="mt-11 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-zinc-400">
          <span>&copy; 2026 model.get</span>
          <span>An independent project, not affiliated with any model provider.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
