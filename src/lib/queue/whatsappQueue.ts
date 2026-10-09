import { Queue } from 'bullmq';
import { connection } from './redis';

export const whatsappQueue = new Queue('whatsappReminders', { connection });

/**
 * Adiciona um agendamento na fila para processamento do lembrete
 * @param meetingId ID do Agendamento (Meeting)
 * @param delay Tempo em ms que o job deve aguardar antes de ser executado
 */
export async function scheduleWhatsAppReminder(meetingId: string, delay: number = 0) {
  await whatsappQueue.add('sendReminder', { meetingId }, {
    delay,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000 // 5s, 25s, 125s...
    }
  });
}
