import { NextResponse } from "next/server";

// Simulação de Instância em Memória / Configuração do Gateway WhatsApp
let instanceState = {
  status: "connected", // "connected" | "qrcode" | "disconnected"
  instanceName: "MedCore-Clinica-Alpha",
  phone: "5511998765432",
  profileName: "Atendimento MedCore Integrado",
  battery: "94%",
  webhookUrl: "https://medcore.com.br/api/webhooks/twilio",
  pairingCode: "MEDC-9821",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=MEDCORE_WHATSAPP_SESSION_ACTIVE_TOKEN_AUTH_V2_PROD",
  connectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  messagesSentToday: 142,
  messagesReceivedToday: 89,
  skillsActive: {
    draConteCopilot: true,
    agendamentoAutomatico: true,
    confirmacaoConsultas: true,
    resgateFaltosos: true,
    npsPosConsulta: true,
    auditoriaPreviaTiss: true
  }
};

export async function GET() {
  return NextResponse.json({
    success: true,
    instance: instanceState
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, phone } = body;

    if (action === "disconnect") {
      instanceState.status = "disconnected";
      return NextResponse.json({
        success: true,
        message: "Sessão do WhatsApp desconectada com sucesso.",
        instance: instanceState
      });
    }

    if (action === "generate_qrcode") {
      const timestamp = Date.now();
      instanceState.status = "qrcode";
      instanceState.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=MEDCORE_SESSION_${timestamp}`;
      instanceState.pairingCode = `MEDC-${Math.floor(1000 + Math.random() * 9000)}`;
      return NextResponse.json({
        success: true,
        message: "Novo QR Code gerado. Aponte a câmera do WhatsApp para conectar.",
        instance: instanceState
      });
    }

    if (action === "connect" || action === "simulate_scan") {
      instanceState.status = "connected";
      if (phone) {
        instanceState.phone = phone.replace(/\D/g, "");
      }
      instanceState.connectedAt = new Date().toISOString();
      return NextResponse.json({
        success: true,
        message: "WhatsApp sincronizado com sucesso! Todas as Skills da Dra. Conte estão operacionais.",
        instance: instanceState
      });
    }

    if (action === "toggle_skill") {
      const { skillName, enabled } = body;
      if (skillName && instanceState.skillsActive.hasOwnProperty(skillName)) {
        (instanceState.skillsActive as any)[skillName] = !!enabled;
      }
      return NextResponse.json({
        success: true,
        message: `Habilidade ${skillName} atualizada.`,
        instance: instanceState
      });
    }

    return NextResponse.json({ success: true, instance: instanceState });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
