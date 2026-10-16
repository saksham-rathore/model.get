import React, { useState, useEffect } from "react";
import { listModels } from "../lib/api";

export interface CatalogModel {
  id: string;
  provider: string;
  name: string;
  tags: string[];
  context: string;
  inputPrice: string;
  outputPrice: string;
  latency: string;
}

const CATALOG_MODELS: CatalogModel[] = [
  { id: "claude-sonnet", provider: "anthropic/", name: "claude-sonnet", tags: ["chat", "vision", "code"], context: "200K", inputPrice: "$3.00", outputPrice: "$15.00", latency: "420 ms" },
  { id: "gpt", provider: "openai/", name: "gpt", tags: ["chat", "vision", "code"], context: "128K", inputPrice: "$2.50", outputPrice: "$10.00", latency: "360 ms" },
  { id: "gemini-pro", provider: "google/", name: "gemini-pro", tags: ["chat", "vision", "code"], context: "1M", inputPrice: "$1.25", outputPrice: "$5.00", latency: "290 ms" },
  { id: "llama-3.3-70b", provider: "meta/", name: "llama-3.3-70b", tags: ["chat", "code", "open"], context: "128K", inputPrice: "$0.60", outputPrice: "$0.80", latency: "240 ms" },
  { id: "mistral-large", provider: "mistral/", name: "mistral-large", tags: ["chat", "code"], context: "128K", inputPrice: "$2.00", outputPrice: "$6.00", latency: "330 ms" },
  { id: "deepseek-v3", provider: "deepseek/", name: "deepseek-v3", tags: ["chat", "code", "open"], context: "128K", inputPrice: "$0.30", outputPrice: "$1.10", latency: "510 ms" },
  { id: "qwen-2.5-coder-32b", provider: "qwen/", name: "qwen-2.5-coder-32b", tags: ["code", "open"], context: "32K", inputPrice: "$0.20", outputPrice: "$0.20", latency: "270 ms" },
  { id: "llama-3.2-90b-vision", provider: "meta/", name: "llama-3.2-90b-vision", tags: ["vision", "open"], context: "128K", inputPrice: "$0.90", outputPrice: "$0.90", latency: "450 ms" },
];

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "chat", label: "Chat" },
  { key: "vision", label: "Vision" },
  { key: "code", label: "Code" },
  { key: "open", label: "Open weights" },
] as const;

export interface CatalogProps {
  className?: string;
}

export function Catalog({ className = "" }: CatalogProps): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [models, setModels] = useState<CatalogModel[]>(CATALOG_MODELS);

  useEffect(() => {
    let isMounted = true;
    async function loadModels() {
      try {
        const res = await listModels();
        if (
          isMounted &&
          res?.models &&
          Array.isArray(res.models) &&
          res.models.length > 0
        ) {
          const loaded: CatalogModel[] = res.models.map((m) => {
            const hasSlash = m.slug.includes("/");
            const provider =
              (hasSlash
                ? m.slug.split("/")[0] + "/"
                : (m.company?.name || "ai") + "/") || "ai/";
            const name =
              (hasSlash ? m.slug.split("/")[1] : m.name) || m.name || m.slug;
            const lower = m.slug.toLowerCase();

            const tags: string[] = ["all"];
            if (
              lower.includes("codex") ||
              lower.includes("coder") ||
              lower.includes("code")
            )
              tags.push("code");
            if (lower.includes("vision")) tags.push("vision");
            if (
              lower.includes("free") ||
              lower.includes("oss") ||
              lower.includes("gemma")
            )
              tags.push("open");
            if (!lower.includes("embedding")) tags.push("chat");

            let context = "128K";
            if (lower.includes("embedding")) context = "8K";
            else if (lower.includes("gemini")) context = "1M";
            else if (lower.includes("32b") || lower.includes("32k"))
              context = "32K";
            else if (lower.includes("claude") || lower.includes("200k"))
              context = "200K";

            const isFree = lower.includes("free");
            let inputPrice = "$1.50";
            let outputPrice = "$4.00";
            let latency = "320 ms";

            if (isFree) {
              inputPrice = "Free";
              outputPrice = "Free";
              latency = "210 ms";
            } else if (lower.startsWith("google")) {
              inputPrice = "$1.25";
              outputPrice = "$5.00";
              latency = "290 ms";
            } else if (lower.startsWith("anthropic")) {
              inputPrice = "$3.00";
              outputPrice = "$15.00";
              latency = "420 ms";
            } else if (lower.startsWith("openai")) {
              inputPrice = "$2.50";
              outputPrice = "$10.00";
              latency = "360 ms";
            }

            return {
              id: m.slug,
              provider,
              name,
              tags,
              context,
              inputPrice,
              outputPrice,
              latency,
            };
          });
          setModels(loaded);
        }
      } catch (err) {
        // Fallback to static catalog if backend offline
      }
    }
    loadModels();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredModels = models.filter((model) => {
    if (activeFilter === "all") return true;
    return model.tags.includes(activeFilter);
  });

  return (
    <section id="models" className={`pb-20 sm:pb-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <div className="mb-12 grid max-w-3xl gap-4 sm:mb-14">
          <h2 className="text-balance text-[clamp(2rem,1.4rem+2.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Browse every model in one catalog
          </h2>
          <p className="max-w-[38em] text-[1.1875rem] text-zinc-400">
            Compare context length, price and typical latency before you write a line of code.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-[18px] flex flex-wrap gap-2" role="group" aria-label="Filter models">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              aria-pressed={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className="filter h-[38px] rounded-full border border-white/15 px-4 text-[15px] font-medium text-zinc-400 transition-colors hover:border-white/40 hover:text-white aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-black cursor-pointer"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Table container */}
        <div
          role="region"
          aria-label="Model catalog"
          tabIndex={0}
          className="overflow-x-auto rounded-3xl border border-white/10 bg-surface"
        >
          <table id="catalog" className="w-full min-w-[640px] border-collapse text-[15.5px]">
            <thead>
              <tr className="bg-white/5 text-sm text-zinc-400">
                <th scope="col" className="whitespace-nowrap px-5 py-4 text-left font-medium">
                  Model
                </th>
                <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  Context
                </th>
                <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  Input / 1M
                </th>
                <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  Output / 1M
                </th>
                <th scope="col" className="whitespace-nowrap px-5 py-4 text-right font-medium">
                  Latency
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {filteredModels.map((model) => (
                <tr key={model.id} className="border-t border-white/10">
                  <th scope="row" className="whitespace-nowrap px-5 py-4 text-left font-semibold text-white">
                    <small className="text-[13px] font-normal text-zinc-400">{model.provider}</small>
                    {model.name}
                  </th>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-zinc-400">{model.context}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-white">{model.inputPrice}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-white">{model.outputPrice}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right text-zinc-400">{model.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p id="table-note" aria-live="polite" className="mt-3.5 text-sm text-zinc-400">
          Showing {filteredModels.length} {filteredModels.length === 1 ? "model" : "models"} from database.
        </p>
      </div>
    </section>
  );
}

export default Catalog;
