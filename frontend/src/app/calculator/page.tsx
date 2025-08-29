"use client";

import React, { useState } from "react";
import LatexBlock from "@/components/LatexBlock";

type CalcResponse = {
  ok: boolean;
  op: string;
  input: string;
  result?: string;
  result_list?: string[];
  latex?: string | null;
  error?: string | null;
};

export default function CalculatorPage() {
  const [expr, setExpr] = useState("solve(x**2 - 4, x)");
  const [data, setData] = useState<CalcResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onCompute() {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const res = await fetch("/api/calc?expr=" + encodeURIComponent(expr), {
        method: "GET",
      });
      const json = (await res.json()) as CalcResponse;
      setData(json);
      if (!json.ok && json.error) setErr(json.error);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">AI Math Calculator</h1>
      <p className="mb-4 text-zinc-300">
        Try: <code>solve(x**2 - 4, x)</code> or <code>integrate(sin(x), x)</code>
      </p>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded bg-zinc-900 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-500"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder="Enter expression..."
        />
        <button
          onClick={onCompute}
          disabled={loading}
          className="rounded bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Computing…" : "Compute"}
        </button>
      </div>

      {err && (
        <div className="rounded border border-red-600 bg-red-900/30 p-3 text-red-200 mb-4">
          Error: {err}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {/* Pretty LaTeX result */}
          {data.latex && (
            <div className="rounded border border-zinc-700 bg-zinc-900 p-4">
              <h2 className="font-semibold mb-2">Result (LaTeX)</h2>
              <LatexBlock latex={data.latex} displayMode />
            </div>
          )}

          {/* Raw JSON for debugging */}
          <div className="rounded border border-zinc-700 bg-zinc-900 p-4">
            <h2 className="font-semibold mb-2">Raw Response</h2>
            <pre className="whitespace-pre-wrap break-all text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
