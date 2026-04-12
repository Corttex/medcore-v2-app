export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
          Medcore V2
        </h1>
        <p className="mt-4 text-zinc-400">
          Estrutura Modular & Performance Ultra-Leve
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-teal-500 transition-all">
          <h2 className="text-xl font-semibold mb-2">Core</h2>
          <p className="text-zinc-500 text-sm">Design System e Infraestrutura Supabase.</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-teal-500 transition-all">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-zinc-500 text-sm">Interface de alta performance para times.</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-teal-500 transition-all">
          <h2 className="text-xl font-semibold mb-2">Admin</h2>
          <p className="text-zinc-500 text-sm">Gestão de assinantes e auditoria.</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-teal-500 transition-all">
          <h2 className="text-xl font-semibold mb-2">Módulos</h2>
          <p className="text-zinc-500 text-sm">Ativador de funcionalidades via Billing.</p>
        </div>
      </div>
    </main>
  );
}
