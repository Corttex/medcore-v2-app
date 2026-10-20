export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Previne encerramento do processo por erro de escrita no stdout/stderr no Windows (EPIPE/UNKNOWN write)
    process.stdout?.on?.('error', (err: any) => {
      if (err?.code === 'EPIPE' || err?.code === 'UNKNOWN' || err?.errno === -4094) return;
    });
    process.stderr?.on?.('error', (err: any) => {
      if (err?.code === 'EPIPE' || err?.code === 'UNKNOWN' || err?.errno === -4094) return;
    });
    process.on('uncaughtException', (err: any) => {
      if (err?.code === 'UNKNOWN' && err?.syscall === 'write') {
        // Ignora pipe quebrado no console do Windows
        return;
      }
      console.error('Unhandled Exception:', err);
    });
  }
}
