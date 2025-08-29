import type { Metadata } from "next";
import "./globals.css";
// Global KaTeX CSS (safe to import here)
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "LearnMath-AI",
  description: "Math learning with real examples, AI, 3D & AR",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
