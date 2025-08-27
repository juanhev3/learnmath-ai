export default function AIML() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">AI / ML / NN</h2>
      <p className="text-slate-300">
        Core math you’ll use in AI: linear algebra, calculus for optimization, probability, information theory.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Linear Algebra</h3>
          <p className="text-sm text-slate-300">Vectors, matrices, eigenvalues, SVD — with code snippets.</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Calculus</h3>
          <p className="text-sm text-slate-300">Gradients, Jacobians, Hessians, backprop intuition.</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Probability</h3>
          <p className="text-sm text-slate-300">Random variables, Bayes, likelihoods, estimators.</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h3 className="font-semibold">Optimization</h3>
          <p className="text-sm text-slate-300">GD/SGD/Adam, convexity, constraints, regularization.</p>
        </div>
      </div>
    </section>
  );
}
