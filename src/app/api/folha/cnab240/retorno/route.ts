import { NextResponse } from "next/server";
import { parseCNAB240Retorno } from "@/lib/banking/cnab240";
import { recordWormLog } from "@/lib/security/auditLog";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const contentType = request.headers.get("content-type") || "";
    let retornoContent = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      retornoContent = body.retornoContent || "";
    } else {
      retornoContent = await request.text();
    }

    if (!retornoContent || retornoContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Conteúdo do arquivo de retorno bancário (.RET) não informado." },
        { status: 400 }
      );
    }

    const resultado = parseCNAB240Retorno(retornoContent);

    const actor = {
      id: session?.user?.id || "admin-system",
      fullName: session?.user?.fullName || "Conciliação Bancária Master",
      email: session?.user?.email || "admin@medcore.com.br",
      role: session?.user?.role || "super_admin"
    };

    const wormRecord = await recordWormLog({
      actor,
      action: "PROCESSAMENTO_RETORNO_CNAB240",
      entityType: "CONCILIACAO_BANCARIA",
      entityId: `RET-${resultado.dataArquivo.replace(/\D/g, "")}`,
      previousState: { status: "AGUARDANDO_CONCILIACAO" },
      newState: {
        status: "CONCILIADO",
        banco: resultado.bancoCodigo,
        totalLiquidados: resultado.pagamentosLiquidados.length,
        totalRejeitados: resultado.pagamentosRejeitados.length,
        totalValorPago: resultado.totalValorPago
      },
      ipAddress: "127.0.0.1"
    });

    return NextResponse.json({
      success: true,
      message: `Arquivo de retorno processado. ${resultado.pagamentosLiquidados.length} pagamentos confirmados como pagos.`,
      resultado,
      wormHash: wormRecord.currentHash
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
