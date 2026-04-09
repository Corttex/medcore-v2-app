export default function BioFlowDashboard() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Meu Bio Flow</h1>
        <p className='text-zinc-500'>Seu histórico de saúde e prontuários centralizados.</p>
      </div>
      <div className='p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center text-zinc-500'>
        Seu histórico de saúde será carregado aqui.
      </div>
    </div>
  )
}
