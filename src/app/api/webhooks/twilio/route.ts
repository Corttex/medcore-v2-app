import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assumindo que você tem isso exportado

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const Body = formData.get('Body') as string;
    const From = formData.get('From') as string; // Ex: "whatsapp:+5511999999999"
    
    if (!Body || !From) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const messageText = Body.trim();
    
    // 1. Limpar o prefixo "whatsapp:" e buscar o paciente (CRM Omnichannel)
    const providerId = From.replace('whatsapp:', '');

    // 2. Busca Inteligente: O paciente já existe?
    let paciente = await prisma.paciente.findFirst({
      where: {
        OR: [
          { providerId: providerId },
          { telefone: { contains: providerId } }
        ]
      }
    });

    // 3. Se NÃO existir (Novo Lead), cria automaticamente
    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: {
          nome: "Lead WhatsApp (" + providerId + ")", // Nome temporário
          telefone: providerId,
          providerId: providerId,
          leadSource: "whatsapp"
        }
      });
      console.log("Novo Lead Omnichannel Criado:", paciente.id);
      
      // Aqui, o Frontend pode escutar via Socket/Pusher para avisar a recepcionista
    } else {
      console.log("Paciente Recorrente Identificado:", paciente.nome);
    }

    // Lógica antiga de confirmação de consulta (MVP)
    const nextMeeting = await prisma.meeting.findFirst({
      where: { pacienteId: paciente.id, status: 'agendado' },
      orderBy: { date: 'asc' }
    });

    let twiMLResponse = '';

    if (nextMeeting) {
      if (messageText.toLowerCase().includes('confirm')) {
        await prisma.meeting.update({
          where: { id: nextMeeting.id },
          data: { status: 'confirmado' }
        });
        twiMLResponse = '<Response><Message>Sua consulta foi confirmada com sucesso! Te esperamos lá.</Message></Response>';
      } else if (messageText.toLowerCase().includes('cancel')) {
        await prisma.meeting.update({
          where: { id: nextMeeting.id },
          data: { 
            status: 'cancelado',
            motivoCancelamento: 'Cancelado pelo paciente via WhatsApp'
          }
        });
        twiMLResponse = '<Response><Message>Sua consulta foi cancelada. Agradecemos por avisar.</Message></Response>';
      }
    }

    // Resposta padrão (Caso seja apenas um "Oi" do Lead)
    if (!twiMLResponse) {
      twiMLResponse = '<Response><Message>Olá! Recebemos sua mensagem. Nossa recepção já foi notificada e vai te atender em instantes!</Message></Response>';
    }

    return new NextResponse(twiMLResponse, {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Erro no Webhook Twilio:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
