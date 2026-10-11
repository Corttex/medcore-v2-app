import { Queue } from 'bullmq';
import { connection } from './redis';

let _whatsappQueue: Queue | null = null;

export function getWhatsAppQueue(): Queue {
  if (!_whatsappQueue) {
    _whatsappQueue = new Queue('whatsappReminders', { connection });
  }
  return _whatsappQueue;
}

export const whatsappQueue = new Proxy({} as Queue, {
  get(target, prop, receiver) {
    return Reflect.get(getWhatsAppQueue(), prop, receiver);
  }
});

/**
 * Adiciona um agendamento na fila para processamento do lembrete
 * @param meetingId ID do Agendamento (Meeting)
 * @param delay Tempo em ms que o job deve aguardar antes de ser executado
 */
export async function scheduleWhatsAppReminder(meetingId: string, delay: number = 0) {
  try {
    const queue = getWhatsAppQueue();
    await queue.add('sendReminder', { meetingId }, {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000 // 5s, 25s, 125s...
      }
    });
  } catch (err) {
    console.warn('[Queue] Não foi possível enfileirar lembrete WhatsApp (Redis offline):', (err as Error)?.message || err);
  }
}

