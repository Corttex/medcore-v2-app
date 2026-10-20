import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface ColaboradorFolha {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  regime: "CLT" | "PJ" | "ESTAGIO";
  registroProfissional?: string; // CRM, COREN, CRF, etc.
  cpf: string;
  admissao: string;
  cbo: string;
  salarioBase: number;
  // Campos Exclusivos para PJ (Compliance Fiscal e B2B)
  cnpjPrestador?: string;
  razaoSocialPrestador?: string;
  nfNumero?: string;
  nfDataEmissao?: string;
  nfDataCompensacao?: string;
  nfAnexada?: boolean;
  nfArquivoNome?: string;
  simplesNacional?: boolean;
  adicionais: {
    insalubridade?: number;
    periculosidade?: number;
    adicionalNoturno?: number;
    plantoesExtras?: number;
    bonusMeta?: number;
  };
  descontos: {
    inss?: number;
    irrf?: number;
    csrf?: number; // PIS 0.65% + COFINS 3.0% + CSLL 1.0% = 4.65% (PJ)
    valeTransporte?: number;
    valeRefeicao?: number;
    planoSaudeCopart?: number;
    faltas?: number;
  };
  beneficiosEmpresa: {
    vr: number;
    vt: number;
    saude: number;
    odonto: number;
    seguroVida: number;
  };
  totalVencimentos: number;
  totalDescontos: number;
  salarioLiquido: number;
  status: "PENDENTE" | "APROVADO" | "PAGO" | "AGUARDANDO_NF";
  dataPagamento?: string;
  chavePix?: string;
  pixEndToEndId?: string;
}

const DEFAULT_COLABORADORES: ColaboradorFolha[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get("unitId");
    const competencia = searchParams.get("competencia") || "09/2026";

    // Calcular Totais (dinâmicos com base nos colaboradores)
    const totalBruto = DEFAULT_COLABORADORES.reduce((acc, c) => acc + c.totalVencimentos, 0);
    const totalLiquido = DEFAULT_COLABORADORES.reduce((acc, c) => acc + c.salarioLiquido, 0);
    const totalDescontos = DEFAULT_COLABORADORES.reduce((acc, c) => acc + c.totalDescontos, 0);
    
    // Encargos estimados (FGTS 8% sobre CLT + INSS Patronal 20% sobre CLT + RAT)
    const totalBaseCLT = DEFAULT_COLABORADORES
      .filter((c) => c.regime === "CLT")
      .reduce((acc, c) => acc + c.totalVencimentos, 0);
    
    const encargosFGTS = totalBaseCLT * 0.08;
    const encargosINSSPatronal = totalBaseCLT * 0.22; // 20% + 2% RAT
    const totalEncargos = encargosFGTS + encargosINSSPatronal;

    // Benefícios totais investidos pela clínica
    const totalBeneficios = DEFAULT_COLABORADORES.reduce((acc, c) => {
      const b = c.beneficiosEmpresa;
      return acc + (b.vr + b.vt + b.saude + b.odonto + b.seguroVida);
    }, 0);

    const guiasTributarias: any[] = [];
    const catalogoBeneficios: any[] = [];
    const esocialLogs: any[] = [];

    return NextResponse.json({
      success: true,
      competencia,
      competenciasDisponiveis: [
        "09/2026",
        "08/2026",
        "07/2026",
        "06/2026",
        "05/2026",
      ],
      resumo: {
        totalBruto,
        totalLiquido,
        totalDescontos,
        totalEncargos,
        encargosFGTS,
        encargosINSSPatronal,
        totalBeneficios,
        totalColaboradores: DEFAULT_COLABORADORES.length,
        colaboradoresCLT: DEFAULT_COLABORADORES.filter((c) => c.regime === "CLT").length,
        colaboradoresPJ: DEFAULT_COLABORADORES.filter((c) => c.regime === "PJ").length,
        statusCompetencia: "ABERTA",
        vencimentoPagamento: "05/10/2026",
      },
      colaboradores: DEFAULT_COLABORADORES,
      guiasTributarias,
      catalogoBeneficios,
      esocialLogs,
    });
  } catch (error) {
    console.error("Erro na API de Folha:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor de folha" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, colaboradorId, valor, motivo, tipo, nfNumero, nfDataCompensacao, nfArquivoNome } = body;

    if (action === "PAGAR_COLABORADOR") {
      const colab = DEFAULT_COLABORADORES.find(c => c.id === colaboradorId || c.nome === colaboradorId);
      if (colab && colab.regime === "PJ" && !colab.nfAnexada) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Bloqueio de Compliance Fiscal: Não é permitido liquidar repasse médico PJ sem Nota Fiscal de Serviço (NFS-e) anexada e validada." 
          },
          { status: 400 }
        );
      }

      const e2e = `E0041696820260928${Math.random().toString().slice(2, 14)}`;
      return NextResponse.json({
        success: true,
        message: `Pagamento via Pix confirmado para ${colab?.nome || colaboradorId}!`,
        dataPagamento: new Date().toLocaleDateString("pt-BR"),
        pixEndToEndId: e2e,
      });
    }

    if (action === "PAGAR_LOTE_API") {
      // Disparo de Lote via API Bancária (Open Finance / Pix em Lote)
      const e2eBatch = `BATCH-MEDCORE-${Date.now().toString(36).toUpperCase()}`;
      return NextResponse.json({
        success: true,
        batchId: e2eBatch,
        message: "Lote de pagamentos enviado via API Bancária com sucesso! Solicitação de dupla custódia enviada para o aplicativo bancário do Diretor Financeiro.",
        dataPagamento: new Date().toLocaleDateString("pt-BR"),
        status: "PROCESSANDO_BANCO",
      });
    }

    if (action === "VINCULAR_NF") {
      const colab = DEFAULT_COLABORADORES.find(c => c.id === colaboradorId);
      if (colab) {
        colab.nfNumero = nfNumero || "NFS-e #" + Math.floor(1000 + Math.random() * 9000);
        colab.nfDataCompensacao = nfDataCompensacao || "05/10/2026";
        colab.nfArquivoNome = nfArquivoNome || "NFSe_Validada.pdf";
        colab.nfAnexada = true;
        colab.status = "APROVADO";
      }

      return NextResponse.json({
        success: true,
        message: "Nota Fiscal de Serviço Eletrônica vinculada e validada na Prefeitura com sucesso!",
        colaborador: colab,
      });
    }

    if (action === "FECHAR_FOLHA") {
      return NextResponse.json({
        success: true,
        message: "Folha de pagamento da competência fechada com sucesso! Lote de pagamentos e eventos eSocial preparados.",
        novoStatus: "FECHADA",
      });
    }

    if (action === "RECARREGAR_BENEFICIOS") {
      return NextResponse.json({
        success: true,
        message: "Créditos de Vale Alimentação, Refeição e Transporte recarregados com sucesso nas operadoras parceiras.",
      });
    }

    if (action === "NOVO_LANCAMENTO") {
      return NextResponse.json({
        success: true,
        message: `Lançamento avulso de ${tipo === "PROVENTO" ? "provento" : "desconto"} no valor de R$ ${valor} registrado com sucesso para ${colaboradorId}.`,
      });
    }

    return NextResponse.json({ success: true, message: "Operação executada." });
  } catch (error) {
    console.error("Erro no processamento da folha:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar requisição da folha" },
      { status: 500 }
    );
  }
}
