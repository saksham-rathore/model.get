import React, { useRef, type FormEvent } from "react";

export function APITester(): React.JSX.Element {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const endpoint = formData.get("endpoint") as string;
      const url = new URL(endpoint, location.href);
      const method = formData.get("method") as string;
      const res = await fetch(url, { method });

      const data = await res.json();
      responseInputRef.current!.value = JSON.stringify(data, null, 2);
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 rounded-xl border border-white/10 bg-surface">
      <form onSubmit={testEndpoint} className="flex items-center gap-2">
        <label htmlFor="method" className="sr-only">
          Method
        </label>
        <select
          id="method"
          name="method"
          defaultValue="GET"
          className="h-10 rounded-lg border border-white/15 bg-raised px-3 text-sm text-white focus:outline-none"
        >
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
        <label htmlFor="endpoint" className="sr-only">
          Endpoint
        </label>
        <input
          id="endpoint"
          type="text"
          name="endpoint"
          defaultValue="/api/hello"
          placeholder="/api/hello"
          className="h-10 flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm text-white focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors"
        >
          Send
        </button>
      </form>
      <label htmlFor="response" className="sr-only">
        Response
      </label>
      <textarea
        ref={responseInputRef}
        id="response"
        readOnly
        placeholder="Response will appear here..."
        className="min-h-[140px] rounded-lg border border-white/15 bg-black/50 p-3 font-mono text-xs text-zinc-300 resize-y"
      />
    </div>
  );
}
