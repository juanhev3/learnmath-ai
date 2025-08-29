"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  latex: string | null | undefined;
  displayMode?: boolean; // true = block, false = inline
  className?: string;
};

export default function LatexBlock({ latex, displayMode = true, className = "" }: Props) {
  if (!latex || !latex.trim()) {
    return null;
  }

  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
      trust: true,
      output: "html",
    });
  } catch (err) {
    // If KaTeX fails, just show the raw text (non-blocking)
    html = `<code>${(latex || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>`;
  }

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
