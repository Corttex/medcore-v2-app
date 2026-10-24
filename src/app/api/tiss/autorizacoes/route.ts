import { NextResponse } from "next/server";
import { rpaAutorizadorService } from "@/lib/rpa/rpaAutorizador";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { convenio, carteirinha, codigoTUSS, pacienteNome, procedimentoDesc } = body;

    if (!convenio || !carteirinha || !codigoTUSS) {
      return NextResponse.json(
        { success: false, error: "Parâmetros obrigatórios ausentes (convenio, carteirinha, codigoTUSS)." },
        { status: 400 }
      );
    }

    // Executa a automação RPA em background ou sincronicamente para a UI
    const resultado = await rpaAutorizadorService.autorizarGuiaSADT({
      convenio,
      carteirinha,
      codigoTUSS,
      pacienteNome,
      procedimentoDesc,
    });

    return NextResponse.json({
      success: resultado.success,
      data: resultado,
    });
  } catch (error: any) {
    console.error("[API TISS Autorizações RPA] Erro:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno no motor RPA" },
      { status: 500 }
    );
  }
}
