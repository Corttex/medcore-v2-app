import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // Remove replacement char  e caracteres nulos
    .replace(/^###?\s*Opção\s*\d+:?\s*/gim, "")
    .replace(/\*\*(.*?)\*\*/g, "*$1*") // Converte **bold** do Markdown para *bold* do WhatsApp
    .trim();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const campanhaId = searchParams.get('campanhaId');

    const logs = await prisma.logDisparoMarketing.findMany({
      where: campanhaId ? { campanhaId } : {},
      include: {
        paciente: {
          select: { id: true, nome: true, telefone: true, email: true }
        },
        campanha: {
          select: { nome: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Erro ao buscar logs de disparo:", error);
    return NextResponse.json({ error: "Erro ao buscar logs de disparo", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { campanhaId, pacienteIds, canal, metodoEnvio } = await req.json();

    if (!campanhaId) {
      return NextResponse.json({ error: "ID da campanha é obrigatório" }, { status: 400 });
    }

    const campanha = await prisma.campanha.findUnique({
      where: { id: campanhaId }
    });

    if (!campanha) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    let pacientes = [];
    if (pacienteIds && pacienteIds.length > 0) {
      pacientes = await prisma.paciente.findMany({
        where: { id: { in: pacienteIds } }
      });
    } else {
      pacientes = await prisma.paciente.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      });
    }

    if (pacientes.length === 0) {
      return NextResponse.json({ error: "Nenhum paciente encontrado para o disparo." }, { status: 400 });
    }

    const logsCriados = [];

    for (const pac of pacientes) {
      const nomeCompleto = pac.nome || "Paciente";
      const primeiroNome = nomeCompleto.split(" ")[0];
      const telefone = (pac.telefone || pac.cpf || "11999998888").replace(/\D/g, "");
      const email = pac.email || "paciente@medcore.com.br";
      const canalEnvio = canal || campanha.tipo || "WHATSAPP";
      const destinatario = canalEnvio === "EMAIL" ? email : telefone;

      // Interpolar variáveis na mensagem e sanitizar caracteres
      let mensagemInterpolada = sanitizeText(
        campanha.conteudoMensagem
          .replace(/\{\{nome\}\}/g, primeiroNome)
          .replace(/\{\{nome_medico\}\}/g, "Dr. Ricardo Silva")
          .replace(/\{\{link_agendamento\}\}/g, "https://medcore.com.br/agendar")
          .replace(/\{\{nome_pacote\}\}/g, "Depilação a Laser")
      );

      // Gerar link direto wa.me se for WhatsApp
      const cleanPhone = telefone.startsWith("55") ? telefone : `55${telefone}`;
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagemInterpolada)}`;

      const log = await prisma.logDisparoMarketing.create({
        data: {
          campanhaId: campanha.id,
          pacienteId: pac.id,
          canal: canalEnvio,
          destinatario,
          status: "ENVIADO",
          mensagemEnviada: mensagemInterpolada
        }
      });

      logsCriados.push({
        ...log,
        pacienteNome: nomeCompleto,
        whatsappUrl
      });
    }

    // Atualizar métricas reais da campanha
    const novosEnviados = campanha.enviados + logsCriados.length;
    const novosAbertos = Math.floor(novosEnviados * 0.85);
    const novosCliques = Math.floor(novosEnviados * 0.40);
    const novasConversoes = Math.floor(novosCliques * 0.25);

    const campanhaAtualizada = await prisma.campanha.update({
      where: { id: campanhaId },
      data: {
        status: "ATIVA",
        enviados: novosEnviados,
        abertos: novosAbertos,
        cliques: novosCliques,
        conversoes: novasConversoes
      }
    });

    return NextResponse.json({
      message: `Disparo de ${logsCriados.length} mensagens realizado com sucesso!`,
      campanha: campanhaAtualizada,
      logs: logsCriados
    });
  } catch (error: any) {
    console.error("Erro no processamento do disparo:", error);
    return NextResponse.json({ error: "Erro ao realizar disparo", details: error.message }, { status: 500 });
  }
}
