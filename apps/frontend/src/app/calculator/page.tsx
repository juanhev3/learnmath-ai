"use client";

import { useState } from "react";

export default function Calculator() {
  const [expr, setExpr] = useState("integrate(sin(x), x)");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCompute(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult("");
    try {
      // Placeholder: when we add FastAPI, change /api/compute
      // For now, just eval locally in a safe mock (no real eval!)
      const mock = `Submitted: ${expr}\n(Backend API coming next)`;
      await new Promise((r) => setTimeout(r, 500));
      setResult(mock);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Math Calculator</h2>
      <p className="text-slate-300">Enter an expression (e.g., <code>solve(x^2-4, x)</code> or <code>integrate(sin(x), x)</code>).</p>

      <form onSubmit={onCompute} className="flex flex-col gap-3 max-w-2xl">
        <input
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-slate-500"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="your expression"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-fit rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? "Computing..." : "Compute"}
        </button>
      </form>

      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 p-3 text-sm text-red-200">
          Error: {error}
        </div>
      )}

      {result && (
        <pre className="rounded border border-slate-800 bg-slate-950 p-3 text-sm overflow-auto">{result}</pre>
      )}

      <div className="mt-6 rounded border border-slate-800 bg-slate-900 p-4">
        <b>Next step:</b> hook this form to our backend <code>FastAPI</code> endpoint (<code>/api/compute</code>) using <code>fetch</code>.
      </div>
    </section>
  );
}
