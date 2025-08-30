"use client";
import { useState } from "react";
import LatexBlock from "@/components/LatexBlock";

type CalcResp = {
  ok: boolean;
  op: string;
  input: string;
  result: string | null;
  result_list?: string[];
  latex: string | null;
  error: string | null;
};

export default function CalculatorPage() {
  const [expr, setExpr] = useState("solve(x**2 - 4, x)");
  const [resp, setResp] = useState<CalcResp | null>(null);
  const [raw, setRaw] = useState<string>("");

  async function compute() {
    setResp(null);
    setRaw("");
    try {
      const r = await fetch("/api/calc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expr }),
      });
      const data = await r.json();
      setResp(data);
      setRaw(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setRaw(String(e));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">AI Math Calculator</h1>
      <p className="text-zinc-400">
        Try: <code>solve(x**2 - 4, x)</code> or <code>integrate(sin(x), x)</code>
      </p>

      <div className="flex gap-3">
        <input
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
        />
        <button
          onClick={compute}
          className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500"
        >
          Compute
        </button>
      </div>

      {resp?.ok && resp.latex && (
        <div>
          <h3 className="font-semibold mb-2">Result (LaTeX)</h3>
          <LatexBlock latex={resp.latex} />
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Raw Response</h3>
        <pre className="whitespace-pre-wrap rounded-md bg-zinc-900 p-4 border border-zinc-700">
{raw || (resp ? JSON.stringify(resp, null, 2) : "")}
        </pre>
      </div>
    </div>
  );
}
