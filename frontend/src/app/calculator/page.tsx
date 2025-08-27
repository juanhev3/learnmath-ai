"use client";

import { useState } from "react";

export default function Calculator() {
  const [expr, setExpr] = useState("integrate(sin(x), x)");
  const [out, setOut] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOut("");
    try {
      const r = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr }),
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: unknown = await r.json();

      // We’ll do a minimal runtime check
      if (
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        (data as { ok: unknown }).ok === true
      ) {
        setOut(JSON.stringify(data, null, 2));
      } else {
        const msg =
          typeof data === "object" && data && "error" in data
            ? String((data as { error?: unknown }).error)
            : "Unexpected response";
        setErr(msg);
      }
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Math Calculator</h2>
      <p className="text-slate-300">
        Try: <code>solve(x**2 - 4, x)</code> or <code>integrate(sin(x), x)</code>
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-2xl">
        <input
          value={expr}
          onChange={(ev) => setExpr(ev.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
          placeholder="Enter SymPy expression"
        />
        <button
          disabled={loading}
          className="w-fit rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Computing..." : "Compute"}
        </button>
      </form>
      {err && (
        <div className="rounded border border-red-700 bg-red-900/30 p-3 text-sm text-red-200">
          Error: {err}
        </div>
      )}
      {out && (
        <pre className="rounded border border-slate-800 bg-slate-950 p-3 text-sm overflow-auto">
          {out}
        </pre>
      )}
    </section>
  );
}

