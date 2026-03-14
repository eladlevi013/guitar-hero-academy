import Tuner from "@/components/Tuner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          🎸 Guitar Hero Academy
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Real-time pitch detection · Open source · Free forever
        </p>
      </div>

      <Tuner />

      <p className="text-xs text-gray-700 text-center max-w-xs">
        MVP — Tuner only. Worlds, levels, and game modes coming next.
      </p>
    </main>
  );
}
