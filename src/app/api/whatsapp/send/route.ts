import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "https://wa.gestaocomercial360.com.br";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "medcore_secret_key_2026";
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "medcore";

export async function POST(req: Request) {
  try {
    const { telefone, mensagem } = await req.json();

    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem obrigatória" }, { status: 400 });
    }

    const cleanPhone = (telefone || "5511999998888").replace(/\D/g, "");

    // 1. Tentar disparo real via Evolution API
    try {
      const evoRes = await fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE_NAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_KEY
        },
        body: JSON.stringify({
          number: cleanPhone,
          text: mensagem,
          options: {
            delay: 1200,
            presence: "composing",
            linkPreview: false
          }
        })
      });

      if (evoRes.ok) {
        const evoData = await evoRes.json();
        return NextResponse.json({
          success: true,
          realDispatched: true,
          evolutionResponse: evoData,
          message: `Disparo efetuado com sucesso via Evolution API para ${cleanPhone}!`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (evoErr: any) {
      console.warn("Evolution API sendText fallback:", evoErr.message);
    }

    // 2. Se a instância ainda não estiver conectada ao celular, retorna aviso amigável
    return NextResponse.json({
      success: true,
      realDispatched: false,
      message: `Mensagem pronta. Conecte o WhatsApp escaneando o QR Code acima para entregar diretamente no número ${cleanPhone}.`,
      destinatario: cleanPhone,
      whatsappDirectUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensagem)}`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
