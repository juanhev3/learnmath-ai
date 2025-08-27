export default function ThreeAR() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">3D &amp; AR</h2>
      <p className="text-slate-300">
        Here we’ll add WebGL/WebXR demos (surfaces, vector fields, gradients) and an AR button (compatible phones/goggles).
      </p>

      <div className="rounded border border-slate-800 bg-slate-900 p-4">
        <ul className="list-disc pl-5 text-slate-300">
          <li>3D surface plot: z = f(x,y)</li>
          <li>Curve/area visuals for integrals</li>
          <li>AR overlay to see math in real objects</li>
        </ul>
      </div>

      <p className="text-xs text-slate-400">
        Coming soon: a minimal WebXR prototype and a fallback 3D viewer for non-AR devices.
      </p>
    </section>
  );
}
