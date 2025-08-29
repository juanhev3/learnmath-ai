"use client";

import { useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type ApiResp = {
  ok: boolean;
  op?: string;
  input?: string;
  result?: string;
  result_list?: string[];
  latex?: string;
  error?: string;
};

function LatexBlock({ latex }: { latex: string }) {
  // Render safely with KaTeX; don't throw on parse errors
  const html = useMemo(() => {
    try {
      // latex from backend already has proper backslashes
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return "";
    }
  }, [latex]);

  if (!html) return null;
  return (
    <div
      className="p-3 rounded bg-neutral-900/30 border border-neutral-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function CalculatorPage() {
  const [expr, setExpr] = useState("integrate(sin(x), x)");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onCompute() {
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      const r = await fetch("/api/compute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr }),
      });

      const data = (await r.json()) as ApiResp;
      if (!data.ok) {
        setErr(data.error ?? "Unknown error");
      } else {
        setResp(data);
      }
    } catch (e: unknown) {
      // no `any` — use a type guard
      if (e instanceof Error) setErr(e.message);
      else setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Math Calculator</h1>

      <p className="text-neutral-400">
        Try: <code>solve(x**2 - 4, x)</code>, <code>integrate(sin(x), x)</code>,{" "}
        <code>diff(x**3, x)</code>, <code>simplify((x**2-1)/(x-1))</code>,{" "}
        <code>eval(sin(x)+x, x=1.2)</code>
      </p>

      <input
        className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="integrate(sin(x), x)"
      />

      <button
        onClick={onCompute}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded"
      >
        {loading ? "Computing…" : "Compute"}
      </button>

      {err && (
        <div className="border border-red-800 bg-red-900/40 text-red-200 rounded p-3">
          Error: {err}
        </div>
      )}

      {resp && (
        <div className="border border-neutral-700 rounded p-4 space-y-3 bg-neutral-900/40">
          <div className="text-sm text-neutral-400">Operation: {resp.op}</div>
          {resp.input && (
            <div className="text-sm text-neutral-400">
              Input: <span className="font-mono">{resp.input}</span>
            </div>
          )}

          {resp.result_list ? (
            <>
              <div className="text-neutral-400 text-sm">Solutions</div>
              <ul className="list-disc pl-5">
                {resp.result_list.map((s, i) => (
                  <li key={i} className="font-mono">{s}</li>
                ))}
              </ul>
            </>
          ) : (
            resp.result && (
              <>
                <div className="text-neutral-400 text-sm">Result</div>
                <div className="font-mono text-green-400 break-words">
                  {resp.result}
                </div>
              </>
            )
          )}

          {resp.latex && (
            <>
              <div className="text-neutral-400 text-sm">Math (LaTeX)</div>
              <LatexBlock latex={resp.latex} />
            </>
          )}
        </div>
      )}
    </main>
  );
}
