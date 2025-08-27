export default function Home() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold">Welcome</h2>
      <p className="text-slate-300">
        This site will teach math with real engineering examples, AI-powered help, and interactive 3D/AR visualizations.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="rounded-lg border border-slate-800 bg-slate-850/50 p-4">
          <h3 className="text-lg font-semibold">AI Math Calculator</h3>
          <p className="text-sm text-slate-300">Symbolic + numeric engine, step-by-step, and hints.</p>
        </li>
        <li className="rounded-lg border border-slate-800 bg-slate-850/50 p-4">
          <h3 className="text-lg font-semibold">3D &amp; AR</h3>
          <p className="text-sm text-slate-300">Visualize calculus, vectors, fields, and real designs in AR.</p>
        </li>
        <li className="rounded-lg border border-slate-800 bg-slate-850/50 p-4">
          <h3 className="text-lg font-semibold">AI / ML / NN</h3>
          <p className="text-sm text-slate-300">Math you need for models: LA, calculus for optimization, probability.</p>
        </li>
        <li className="rounded-lg border border-slate-800 bg-slate-850/50 p-4">
          <h3 className="text-lg font-semibold">Roadmap</h3>
          <p className="text-sm text-slate-300">We’ll add backend APIs, AR demos, and curriculum modules.</p>
        </li>
      </ul>
    </section>
  );
}
