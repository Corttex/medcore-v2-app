import { NextResponse } from "next/server";
import { captureDarfAndFgtsPix } from "@/lib/skills/captureDarfPix";
import { recordWormLog } from "@/lib/security/auditLog";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competencia = searchParams.get("competencia") || "09/2026";

    const impostos = captureDarfAndFgtsPix(competencia, {
      totalInss: 3450.40,
      totalIrrf: 1820.60,
      totalFgts: 2980.00
    });

    return NextResponse.json({
      success: true,
      competencia,
      guias: impostos
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tipoGuia, competencia, valor } = body;
    const session = await getSession();

    const actor = {
      id: session?.user?.id || "admin-system",
      fullName: session?.user?.fullName || "Administrador Geral",
      email: session?.user?.email || "admin@medcore.com.br",
      role: session?.user?.role || "super_admin"
    };

    // Registra evento no log WORM imutável
    const wormRecord = await recordWormLog({
      actor,
      action: `LIQUIDACAO_IMPOSTO_${tipoGuia}`,
      entityType: "TRIBUTO_FEDERAL",
      entityId: `${tipoGuia}-${competencia}`,
      previousState: { status: "PENDENTE", valor },
      newState: { status: "PAGO", dataPagamento: new Date().toISOString(), canal: "PIX_BACEN" },
      ipAddress: "127.0.0.1"
    });

    return NextResponse.json({
      success: true,
      message: `Guia ${tipoGuia} liquidada com sucesso via Pix. Registro WORM gerado.`,
      wormHash: wormRecord.currentHash
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
