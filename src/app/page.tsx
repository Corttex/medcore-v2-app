import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Bem-vindo ao&nbsp;
          <code className="font-bold">MEDCORE.app.br</code>
        </p>
      </div>

      <div className="relative flex place-items-center mt-20">
        <div className="logo-icon w-20 h-20 bg-gradient-to-br from-violet-600 to-lavender-500 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(168,85,247,0.5)]">
          ⚕
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold mt-8 tracking-tighter">
        CONTE CORE
      </h1>
      <p className="text-text3 mt-2">Tecnologia e Cuidado na Saúde</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full max-w-6xl">
        <Link href="/(admin)" className="card p-6 hover:border-lavender transition-all group">
          <h3 className="text-lg font-bold mb-2 group-hover:text-lavender">Painel Geral</h3>
          <p className="text-sm text-text3">Gestão global da plataforma (SuperAdmin).</p>
        </Link>
        <Link href="/(company)" className="card p-6 hover:border-lavender transition-all group">
          <h3 className="text-lg font-bold mb-2 group-hover:text-lavender">Empresa</h3>
          <p className="text-sm text-text3">Gestão de hospitais e clínicas contratantes.</p>
        </Link>
        <Link href="/(employee)" className="card p-6 hover:border-lavender transition-all group">
          <h3 className="text-lg font-bold mb-2 group-hover:text-lavender">Funcionário</h3>
          <p className="text-sm text-text3">Painel operacional para staff clínico.</p>
        </Link>
        <Link href="/(user)" className="card p-6 hover:border-lavender transition-all group">
          <h3 className="text-lg font-bold mb-2 group-hover:text-lavender">Bio Flow</h3>
          <p className="text-sm text-text3">Painel para usuários individuais (B2C).</p>
        </Link>
      </div>

      <div className="mt-16 card p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} className="bg-white/5 border border-white/10 rounded-xl py-4 font-mono text-xl hover:bg-white/10 transition-colors">
              {num}
            </button>
          ))}
          <div />
          <button className="bg-white/5 border border-white/10 rounded-xl py-4 font-mono text-xl hover:bg-white/10 transition-colors">0</button>
          <div />
        </div>
        <button className="w-full mt-6 py-4 bg-gradient-to-r from-violet-700 to-lavender-600 rounded-xl font-bold shadow-lg hover:shadow-lavender/40 transition-all">
          ENTRAR
        </button>
      </div>
    </main>
  );
}
