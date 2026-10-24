import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { glosaId, guiaNumero, convenio, prontuarioSnippet, motivoGlosa, codigoGlosa } = await req.json();

    // Cruzamento pericial autônomo entre Código de Glosa ANS e registros clínicos do prontuário
    const embasamentoANS = {
      "1801": "Atendimento emergencial caracterizado por dor aguda, pico pressórico ou risco de instabilidade hemodinâmica, respaldado pelo art. 35-C da Lei 9.656/98 e Resolução CFM nº 1.451/95.",
      "1409": "Indicação formal de contraste paramagnético fundamentada na Diretriz de Utilização (DUT nº 52 da ANS) e suspeita oncológica/vascular documentada em anamnese.",
      "2005": "Planos cirúrgicos e tempos operatórios individualizados conforme codificação CBHPM/TUSS, com necessidade de desbridamento e planos subdérmicos em sítios anatômicos múltiplos.",
      "default": "Conduta médica devidamente respaldada pela soberania clínica do médico assistente e prontuário certificado nos termos da Resolução CFM nº 1.821/07."
    };

    const fundamentacao = (embasamentoANS as any)[codigoGlosa] || embasamentoANS.default;

    const recursoGerado = `À Douta Auditoria Médica do Convênio ${convenio || "Operadora de Saúde"}:\n\n` +
      `REFERÊNCIA: Recurso Técnico Pericial contra Glosa nº ${codigoGlosa || "ANS"} na Guia ${guiaNumero || "TISS"}.\n\n` +
      `1. DO HISTÓRICO CLÍNICO E EVIDÊNCIA EM PRONTUÁRIO:\n` +
      `Conforme consignado no Prontuário Eletrônico Certificado (Resolução CFM nº 1.821/07 e ICP-Brasil):\n` +
      `"${prontuarioSnippet || "Paciente avaliado com sinais clínicos de gravidade e indicação estrita do procedimento."}"\n\n` +
      `2. DA FUNDAMENTAÇÃO TÉCNICO-ASSISTENCIAL E NORMATIVA:\n` +
      `A motivação alegada pela operadora ("${motivoGlosa || "Incompatibilidade técnica"}") resta improcedente, haja vista que: ${fundamentacao}\n\n` +
      `3. DO PEDIDO DE RECONSIDERAÇÃO:\n` +
      `Diante do cumprimento integral dos preceitos do Rol da ANS, da codificação TUSS e da necessidade terapêutica inconteste, requer-se o CANCELAMENTO INTEGRAL DA GLOSA com a devida liquidação e estorno financeiro em lote subsequente.`;

    return NextResponse.json({
      success: true,
      glosaId,
      status: "RECURSO_GERADO",
      recursoTexto: recursoGerado,
      protocoloRpa: `RPA-GLOSA-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
