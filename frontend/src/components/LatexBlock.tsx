"use client";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function LatexBlock({ latex }: { latex: string }) {
  if (!latex) return null;
  return (
    <div className="rounded-md bg-zinc-900 p-4 border border-zinc-700 overflow-x-auto">
      <BlockMath math={latex} />
    </div>
  );
}
