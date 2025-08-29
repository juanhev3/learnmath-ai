'use client';

import React, { useState } from 'react';
import LatexBlock from '@/components/LatexBlock';

type ApiOk = {
  ok: true;
  input: string;
  result: string | number;
  latex: string;
};

type ApiErr = {
  ok: false;
  error: string;
};

export default function CalculatorPage() {
  const [expr, setExpr] = useState('integrate(sin(x), x)');
  const [res, setRes] = useState<ApiOk | ApiErr | null>(null);
  const [busy, setBusy] = useState(false);

  const compute = async () => {
    setBusy(true);
    setRes(null);
    try {
      const r = await fetch('/api/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr }),
      });
      const j: ApiOk | ApiErr = await r.json();
      setRes(j);
    } catch (e: any) {
      setRes({ ok: false, error: String(e?.message ?? e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">AI Math Calculator</h1>

        <p className="text-zinc-400 mb-4">
          Try: <code className="text-zinc-200">solve(x**2 - 4, x)</code> or{' '}
          <code className="text-zinc-200">integrate(sin(x), x)</code>
        </p>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 rounded-md bg-zinc-900 px-3 py-3 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="integrate(sin(x), x)"
          />
          <button
            onClick={compute}
            disabled={busy}
            className="rounded-md bg-emerald-600 px-4 py-3 font-medium hover:bg-emerald-500 disabled:opacity-50"
          >
            {busy ? 'Computing…' : 'Compute'}
          </button>
        </div>

        {/* Result */}
        {res && (
          <div className="mt-4">
            {res.ok ? (
              <>
                <div className="rounded-md bg-zinc-900 p-4 ring-1 ring-zinc-800">
                  <div className="text-zinc-400 text-sm mb-2">LaTeX</div>
                  <div className="bg-black/30 rounded p-3 overflow-x-auto">
                    <LatexBlock tex={res.latex} display />
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-zinc-900 p-4 ring-1 ring-zinc-800">
                  <div className="text-zinc-400 text-sm mb-1">Raw JSON</div>
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(res, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="rounded-md bg-red-900/30 p-4 ring-1 ring-red-800">
                <div className="font-medium text-red-300">Error</div>
                <div className="text-red-200">{res.error}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
