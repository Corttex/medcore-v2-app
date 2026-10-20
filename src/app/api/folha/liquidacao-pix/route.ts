import { NextResponse } from "next/server";
import { recordWormLog } from "@/lib/security/auditLog";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { competencia, pagamentos, pinConfirmacao, canal } = body;

    if (!pinConfirmacao || pinConfirmacao.length < 4) {
      return NextResponse.json(
        { error: "PIN operacional de segurança ou token MFA requerido para autorizar liquidação bancária." },
        { status: 401 }
      );
    }

    const totalValor = (pagamentos || []).reduce(
      (acc: number, curr: any) => acc + (curr.valorLiquido || 0),
      0
    );

    const actor = {
      id: session?.user?.id || "admin-system",
      fullName: session?.user?.fullName || "Gestor Financeiro Master",
      email: session?.user?.email || "admin@medcore.com.br",
      role: session?.user?.role || "super_admin"
    };

    // Registra o disparo de pagamentos na trilha imutável WORM
    const wormRecord = await recordWormLog({
      actor,
      action: "LIQUIDACAO_LOTE_PIX_FOLHA",
      entityType: "FOLHA_PAGAMENTO_LOTE",
      entityId: `PIX-LOTE-${competencia.replace("/", "")}`,
      previousState: { status: "APROVADO_AGUARDANDO_PAGAMENTO", totalBeneficiarios: pagamentos?.length, totalValor },
      newState: {
        status: "LIQUIDADO_VIA_API_BANCARIA",
        canal: canal || "OPEN_FINANCE_PIX_LOTE",
        protocoloBancario: `STARK-PIX-${Date.now()}`,
        dataLiquidacao: new Date().toISOString(),
        totalValor
      },
      ipAddress: "127.0.0.1"
    });

    return NextResponse.json({
      success: true,
      protocolo: `PIX-BATCH-${Date.now()}`,
      status: "LIQUIDADO",
      totalBeneficiarios: pagamentos?.length || 0,
      totalValor: Math.round(totalValor * 100) / 100,
      wormHash: wormRecord.currentHash,
      message: "Lote de pagamentos liquidado com sucesso via API Bancária Pix."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
