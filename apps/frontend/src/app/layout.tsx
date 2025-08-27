import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LearnMath-AI",
  description: "A friendly place to learn mathematics with AI, 3D & AR.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/70">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold">
              <Link href="/">LearnMath-AI</Link>
            </h1>
            <nav className="flex gap-2 text-sm">
              <Link className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700" href="/">Home</Link>
              <Link className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700" href="/calculator">Calculator</Link>
              <Link className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700" href="/three-ar">3D &amp; AR</Link>
              <Link className="px-3 py-2 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700" href="/ai-ml">AI / ML / NN</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-10 border-t border-slate-800 px-4 py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} LearnMath-AI
        </footer>
      </body>
    </html>
  );
}
