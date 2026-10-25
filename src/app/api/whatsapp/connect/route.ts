import { NextResponse } from "next/server";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL || "https://wa.gestaocomercial360.com.br";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY || "medcore_secret_key_2026";
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "medcore";

export async function GET() {
  try {
    // 1. Verificar estado da conexão na Evolution API
    const stateRes = await fetch(`${EVOLUTION_URL}/instance/connectionState/${INSTANCE_NAME}`, {
      method: "GET",
      headers: {
        "apikey": EVOLUTION_KEY
      },
      cache: "no-store"
    });

    let connectionState = "disconnected";
    let stateData = null;

    if (stateRes.ok) {
      stateData = await stateRes.json();
      connectionState = stateData?.instance?.state || "disconnected";
    }

    // Se já estiver conectado
    if (connectionState === "open") {
      return NextResponse.json({
        success: true,
        status: "connected",
        instanceName: INSTANCE_NAME,
        phone: stateData?.instance?.ownerJid?.replace(/\D/g, "") || "5511998765432",
        profileName: "Atendimento MedCore Integrado",
        connectedAt: new Date().toISOString(),
        skillsActive: 6
      });
    }

    // 2. Se não estiver conectado, obter QR Code ativo
    const connectRes = await fetch(`${EVOLUTION_URL}/instance/connect/${INSTANCE_NAME}`, {
      method: "GET",
      headers: {
        "apikey": EVOLUTION_KEY
      },
      cache: "no-store"
    });

    if (connectRes.ok) {
      const connectData = await connectRes.json();
      return NextResponse.json({
        success: true,
        status: "qrcode",
        instanceName: INSTANCE_NAME,
        base64: connectData.base64 || null,
        code: connectData.code || null,
        pairingCode: connectData.pairingCode || null,
        count: connectData.count || 1
      });
    }

    // Caso a instância precise ser criada
    return NextResponse.json({
      success: true,
      status: "disconnected",
      instanceName: INSTANCE_NAME,
      message: "Instância aguardando inicialização."
    });

  } catch (error: any) {
    console.error("Erro na integração Evolution API:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      status: "disconnected"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create" || action === "restart") {
      const createRes = await fetch(`${EVOLUTION_URL}/instance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_KEY
        },
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });
      const data = await createRes.json();
      return NextResponse.json({ success: true, data });
    }

    if (action === "disconnect" || action === "logout") {
      await fetch(`${EVOLUTION_URL}/instance/logout/${INSTANCE_NAME}`, {
        method: "DELETE",
        headers: { "apikey": EVOLUTION_KEY }
      });
      return NextResponse.json({ success: true, message: "Desconectado com sucesso." });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
