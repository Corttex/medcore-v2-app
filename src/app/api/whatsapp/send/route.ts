import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { telefone, mensagem, tipo = "teste" } = await req.json();

    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    const cleanPhone = (telefone || "5511999998888").replace(/\D/g, "");

    // Simula resposta da Dra. Conte
    const aiResponse = `🤖 *Dra. Conte Responde:* Olá! Recebemos sua mensagem "${mensagem.slice(0, 30)}...". Seu atendimento foi qualificado com sucesso e a equipe médica foi acionada.`;

    return NextResponse.json({
      success: true,
      messageId: `wamid_${Date.now()}`,
      status: "DELIVERED",
      destinatario: cleanPhone,
      mensagemEnviada: mensagem,
      draConteResposta: aiResponse,
      whatsappDirectUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagem)}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
