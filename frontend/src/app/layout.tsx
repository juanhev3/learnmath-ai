import "./globals.css";
import Link from "next/link";
import 'katex/dist/katex.min.css';

export const metadata = {
  title: "LearnMath-AI",
  description: "Math + AI + 3D/AR learning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 sticky top-0 z-50">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
            <div className="font-semibold text-xl">LearnMath-AI</div>
            <div className="flex-1" />
            <Link className="px-3 py-1 rounded hover:bg-zinc-800" href="/">Home</Link>
            <Link className="px-3 py-1 rounded hover:bg-zinc-800" href="/calculator">Calculator</Link>
            <Link className="px-3 py-1 rounded hover:bg-zinc-800" href="/three-ar">3D &amp; AR</Link>
            <Link className="px-3 py-1 rounded hover:bg-zinc-800" href="/ai-ml">AI / ML / NN</Link>
          </div>
        </nav>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
