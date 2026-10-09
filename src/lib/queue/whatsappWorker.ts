import { Worker, Job } from 'bullmq';
import { connection } from './redis';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';

const prisma = new PrismaClient();

// As credenciais devem vir do .env (Usando Sandbox da Twilio para Dev)
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_EXAMPLE';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'AUTH_TOKEN';
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886'; // Sandbox number

const twilioClient = twilio(accountSid, authToken);

export const whatsappWorker = new Worker('whatsappReminders', async (job: Job) => {
  const { meetingId } = job.data;
  console.log(`Processando lembrete de WhatsApp para o Meeting: ${meetingId}`);

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        paciente: true,
        user: { select: { fullName: true } } // Relação User <-> Meeting criada recentemente
      }
    });

    if (!meeting || meeting.status === 'cancelado') {
      console.log('Agendamento não existe ou foi cancelado. Abortando envio.');
      return;
    }

    if (!meeting.paciente?.telefone) {
      console.log('Paciente não possui telefone. Abortando.');
      return;
    }

    // Usar o telefone do paciente, e formatar para whatsapp padrão da twilio
    let userPhone = meeting.paciente.telefone.replace(/\D/g, ''); // Limpar pontuação
    if (!userPhone.startsWith('55')) {
      userPhone = `55${userPhone}`; // Forçar DDI Brasil se não tiver
    }
    const to = `whatsapp:+${userPhone}`;

    // Aqui definimos qual notificação estamos enviando (24h ou 2h)
    // Para simplificar o MVP, vamos checar e enviar a que falta
    let messageText = '';
    
    if (!meeting.notificacao24hEnviada) {
      messageText = `Olá ${meeting.paciente.nome}, lembrete da sua consulta amanhã às ${meeting.time} com Dr(a). ${meeting.user?.fullName || 'Profissional'}. Responda CONFIRMO para confirmar ou CANCELO para cancelar. Link: http://localhost:3000/agendar/${meeting.tokenPublico}`;
      await prisma.meeting.update({ where: { id: meeting.id }, data: { notificacao24hEnviada: true } });
    } else if (!meeting.notificacao2hEnviada) {
      messageText = `Olá ${meeting.paciente.nome}, falta pouco! Sua consulta é hoje às ${meeting.time}. Até breve!`;
      await prisma.meeting.update({ where: { id: meeting.id }, data: { notificacao2hEnviada: true } });
    } else {
      console.log('Todas as notificações já enviadas.');
      return;
    }

    // Disparo oficial na API da Twilio
    // Em DEV, só funcionará se o número de destino tiver entrado no Sandbox da Twilio
    const message = await twilioClient.messages.create({
      body: messageText,
      from: twilioNumber,
      to: to
    });

    console.log(`Mensagem enviada com sucesso! SID: ${message.sid}`);

  } catch (error) {
    console.error('Falha no Worker de WhatsApp:', error);
    throw error; // Fazer o BullMQ tentar novamente
  }
}, { connection });

whatsappWorker.on('completed', job => {
  console.log(`${job.id} finalizou com sucesso`);
});

whatsappWorker.on('failed', (job, err) => {
  console.log(`${job?.id} falhou com o erro ${err.message}`);
});
