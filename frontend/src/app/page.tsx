import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="text-zinc-300">
        Learn math with engineering examples, AI help, and interactive 3D/AR.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/calculator" className="block p-6 rounded-lg border border-zinc-800 hover:bg-zinc-900">
          <h2 className="text-xl font-semibold">AI Math Calculator</h2>
          <p className="text-zinc-400 mt-2">Symbolic & numeric engine with LaTeX rendering.</p>
        </Link>

        <Link href="/three-ar" className="block p-6 rounded-lg border border-zinc-800 hover:bg-zinc-900">
          <h2 className="text-xl font-semibold">3D & AR</h2>
          <p className="text-zinc-400 mt-2">Visualize calculus, vectors & fields.</p>
        </Link>

        <Link href="/ai-ml" className="block p-6 rounded-lg border border-zinc-800 hover:bg-zinc-900">
          <h2 className="text-xl font-semibold">AI / ML / NN</h2>
          <p className="text-zinc-400 mt-2">Math for models: LA, calculus, probability.</p>
        </Link>

        <div className="p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-semibold">Roadmap</h2>
          <p className="text-zinc-400 mt-2">More APIs, AR demos, and curriculum.</p>
        </div>
      </div>
    </div>
  );
}
