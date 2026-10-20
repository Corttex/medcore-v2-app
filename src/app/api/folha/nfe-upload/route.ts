import { NextResponse } from "next/server";
import { parseNfeMedica } from "@/lib/skills/parseNfeMedica";
import { recordWormLog } from "@/lib/security/auditLog";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const contentType = request.headers.get("content-type") || "";
    let rawContent = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      rawContent = body.xmlContent || JSON.stringify(body);
    } else {
      rawContent = await request.text();
    }

    if (!rawContent || rawContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Conteúdo da Nota Fiscal (XML ou JSON) não fornecido." },
        { status: 400 }
      );
    }

    // Executa a skill parse_nfe_medica
    const parsedNfe = parseNfeMedica(rawContent);

    const actor = {
      id: session?.user?.id || "medico-pj",
      fullName: session?.user?.fullName || "Portal do Médico Parceiro",
      email: session?.user?.email || "prestador@medcore.com.br",
      role: session?.user?.role || "prestador_pj"
    };

    // Registra evento de upload e validação fiscal na trilha WORM
    const wormRecord = await recordWormLog({
      actor,
      action: "UPLOAD_VALIDACAO_NFSE_MEDICA",
      entityType: "NOTA_FISCAL_SERVICO",
      entityId: parsedNfe.numeroNfe,
      previousState: null,
      newState: {
        numeroNfe: parsedNfe.numeroNfe,
        prestadorCnpj: parsedNfe.prestador.cnpj,
        valorBruto: parsedNfe.valorBruto,
        valorLiquido: parsedNfe.valorLiquido,
        retencaoIRRF: parsedNfe.retencoes.irrf.valor,
        retencaoCSRF: parsedNfe.retencoes.csrf.valor,
        eventoEfdReinf: parsedNfe.efdReinfR4020.tipoEvento
      },
      ipAddress: "127.0.0.1"
    });

    return NextResponse.json({
      success: true,
      message: "Nota Fiscal de Serviços Médicos processada com sucesso.",
      data: parsedNfe,
      wormHash: wormRecord.currentHash
    });
  } catch (error: any) {
    console.error("Erro no processamento da NFS-e:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
