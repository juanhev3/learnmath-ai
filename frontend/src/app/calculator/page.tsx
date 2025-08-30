/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import katex from 'katex';

export default function CalculatorPage() {
  const [expr, setExpr] = useState('integrate(sin(x), x)');
  const [raw, setRaw] = useState<any>(null);

  async function compute() {
    setRaw(null);
    const r = await fetch('/api/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expr }),
    });
    const j = await r.json();
    setRaw(j);
  }

  const latexHtml =
    raw?.latex ? katex.renderToString(String(raw.latex), { throwOnError: false }) : '';

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Math Calculator</h1>
      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        className="w-full rounded border px-3 py-2 mb-3 bg-slate-900 text-slate-100"
      />
      <button onClick={compute} className="px-4 py-2 rounded bg-emerald-600 text-white">
        Compute
      </button>

      {raw && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          {latexHtml ? (
            <div className="bg-slate-900 text-slate-100 p-4 rounded" dangerouslySetInnerHTML={{ __html: latexHtml }} />
          ) : (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded">{JSON.stringify(raw, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
