'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type LatexBlockProps = {
  latex: string;          // KaTeX string, e.g. "\\int_0^1 x^2 \\, dx"
  block?: boolean;        // true = display mode (centered, larger)
  errorColor?: string;    // color for KaTeX error text
};

/**
 * Renders LaTeX using KaTeX on the client.
 * Safe for Next.js App Router (uses 'use client' + useEffect).
 */
export default function LatexBlock({
  latex,
  block = true,
  errorColor = '#cc0000',
}: LatexBlockProps) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    try {
      katex.render(latex, elRef.current, {
        throwOnError: false,
        displayMode: block,
        errorColor,
        strict: 'warn',
        trust: false,
      });
    } catch (err) {
      // If something unexpected happens, show the raw string
      elRef.current.innerText = latex;
    }
  }, [latex, block, errorColor]);

  return <span ref={elRef} aria-label="latex" />;
}
