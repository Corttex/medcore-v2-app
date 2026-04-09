export default function EmployeeDashboard() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Área Clínica</h1>
        <p className='text-zinc-500'>Acesso rápido aos seus pacientes e prontuários.</p>
      </div>
      <div className='p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center'>
        <p className='text-zinc-500 font-mono'>Seus atendimentos de hoje aparecerão aqui.</p>
      </div>
    </div>
  )
}
