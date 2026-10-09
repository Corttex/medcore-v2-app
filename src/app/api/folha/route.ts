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
  status: "PENDENTE" | "APROVADO" | "PAGO";
  dataPagamento?: string;
  chavePix?: string;
}

const DEFAULT_COLABORADORES: ColaboradorFolha[] = [
  {
    id: "colab-1",
    nome: "Dr. Felipe Azevedo",
    email: "felipe.azevedo@medcore.com.br",
    cargo: "Diretor Clínico & Cirurgião Geral",
    departamento: "Corpo Clínico",
    regime: "PJ",
    registroProfissional: "CRM-SP 124.890",
    cpf: "284.912.438-02",
    admissao: "15/01/2023",
    cbo: "2251-20",
    salarioBase: 24000.0,
    adicionais: {
      plantoesExtras: 6000.0,
      bonusMeta: 2500.0,
    },
    descontos: {
      irrf: 3250.0,
    },
    beneficiosEmpresa: {
      vr: 0,
      vt: 0,
      saude: 850.0,
      odonto: 85.0,
      seguroVida: 220.0,
    },
    totalVencimentos: 32500.0,
    totalDescontos: 3250.0,
    salarioLiquido: 29250.0,
    status: "APROVADO",
    chavePix: "felipe.azevedo@medcore.com.br",
  },
  {
    id: "colab-2",
    nome: "Dra. Beatriz Albuquerque",
    email: "beatriz.albuquerque@medcore.com.br",
    cargo: "Cardiologista & Ecocardiografia",
    departamento: "Ambulatório",
    regime: "PJ",
    registroProfissional: "CRM-SP 98.452",
    cpf: "192.441.768-15",
    admissao: "03/05/2023",
    cbo: "2251-20",
    salarioBase: 18500.0,
    adicionais: {
      plantoesExtras: 4200.0,
    },
    descontos: {
      irrf: 2450.0,
    },
    beneficiosEmpresa: {
      vr: 0,
      vt: 0,
      saude: 650.0,
      odonto: 85.0,
      seguroVida: 190.0,
    },
    totalVencimentos: 22700.0,
    totalDescontos: 2450.0,
    salarioLiquido: 20250.0,
    status: "PAGO",
    dataPagamento: "25/09/2026",
    chavePix: "192.441.768-15",
  },
  {
    id: "colab-3",
    nome: "Dra. Mariana Vasconcellos",
    email: "mariana.vasconcellos@medcore.com.br",
    cargo: "Dermatologista Clínica & Procedimentos",
    departamento: "Estética & Dermatologia",
    regime: "PJ",
    registroProfissional: "CRM-SP 112.034",
    cpf: "349.882.115-44",
    admissao: "10/11/2023",
    cbo: "2251-35",
    salarioBase: 16000.0,
    adicionais: {
      bonusMeta: 3800.0,
    },
    descontos: {
      irrf: 2120.0,
    },
    beneficiosEmpresa: {
      vr: 0,
      vt: 0,
      saude: 650.0,
      odonto: 85.0,
      seguroVida: 190.0,
    },
    totalVencimentos: 19800.0,
    totalDescontos: 2120.0,
    salarioLiquido: 17680.0,
    status: "APROVADO",
    chavePix: "mariana.vasc@medcore.com.br",
  },
  {
    id: "colab-4",
    nome: "Enfª Camila Nogueira",
    email: "camila.nogueira@medcore.com.br",
    cargo: "Enfermeira Chefe / CTI & Triagem",
    departamento: "Enfermagem",
    regime: "CLT",
    registroProfissional: "COREN-SP 45.210",
    cpf: "411.238.990-87",
    admissao: "01/02/2022",
    cbo: "2235-05",
    salarioBase: 5800.0,
    adicionais: {
      insalubridade: 282.4, // 20% salário mínimo
      adicionalNoturno: 480.0,
      plantoesExtras: 900.0,
    },
    descontos: {
      inss: 785.45,
      irrf: 412.3,
      valeTransporte: 240.0,
      valeRefeicao: 110.0,
      planoSaudeCopart: 95.0,
    },
    beneficiosEmpresa: {
      vr: 850.0,
      vt: 240.0,
      saude: 420.0,
      odonto: 55.0,
      seguroVida: 75.0,
    },
    totalVencimentos: 7462.4,
    totalDescontos: 1642.75,
    salarioLiquido: 5819.65,
    status: "APROVADO",
    chavePix: "camila.coren@gmail.com",
  },
  {
    id: "colab-5",
    nome: "Lucas Ribeiro Mendes",
    email: "lucas.ribeiro@medcore.com.br",
    cargo: "Técnico em Radiologia & Tomografia",
    departamento: "Diagnóstico por Imagem",
    regime: "CLT",
    registroProfissional: "CRTR-SP 8.741",
    cpf: "518.773.120-03",
    admissao: "14/08/2023",
    cbo: "3241-15",
    salarioBase: 3400.0,
    adicionais: {
      periculosidade: 1360.0, // 40% sobre base (Raio-X/Radiação ionizante)
      plantoesExtras: 450.0,
    },
    descontos: {
      inss: 521.8,
      irrf: 245.5,
      valeTransporte: 204.0,
      valeRefeicao: 90.0,
    },
    beneficiosEmpresa: {
      vr: 750.0,
      vt: 210.0,
      saude: 380.0,
      odonto: 55.0,
      seguroVida: 75.0,
    },
    totalVencimentos: 5210.0,
    totalDescontos: 1061.3,
    salarioLiquido: 4148.7,
    status: "PENDENTE",
    chavePix: "lucas.rad@hotmail.com",
  },
  {
    id: "colab-6",
    nome: "Juliana Mendonça",
    email: "juliana.mendonca@medcore.com.br",
    cargo: "Recepcionista Líder / Atendimento",
    departamento: "Recepção & Triagem",
    regime: "CLT",
    cpf: "389.102.551-76",
    admissao: "12/03/2024",
    cbo: "4221-10",
    salarioBase: 2550.0,
    adicionais: {
      bonusMeta: 350.0,
    },
    descontos: {
      inss: 245.2,
      irrf: 45.1,
      valeTransporte: 153.0,
      valeRefeicao: 80.0,
    },
    beneficiosEmpresa: {
      vr: 650.0,
      vt: 180.0,
      saude: 350.0,
      odonto: 45.0,
      seguroVida: 60.0,
    },
    totalVencimentos: 2900.0,
    totalDescontos: 523.3,
    salarioLiquido: 2376.7,
    status: "PAGO",
    dataPagamento: "25/09/2026",
    chavePix: "389.102.551-76",
  },
  {
    id: "colab-7",
    nome: "Rodrigo Peixoto",
    email: "rodrigo.peixoto@medcore.com.br",
    cargo: "Fisioterapeuta Hospitalar & Reabilitação",
    departamento: "Fisioterapia",
    regime: "CLT",
    registroProfissional: "CREFITO-SP 63.214",
    cpf: "277.940.339-11",
    admissao: "08/01/2024",
    cbo: "2236-05",
    salarioBase: 4600.0,
    adicionais: {
      insalubridade: 282.4,
      bonusMeta: 400.0,
    },
    descontos: {
      inss: 580.3,
      irrf: 215.4,
      valeTransporte: 210.0,
      valeRefeicao: 90.0,
    },
    beneficiosEmpresa: {
      vr: 750.0,
      vt: 210.0,
      saude: 380.0,
      odonto: 55.0,
      seguroVida: 75.0,
    },
    totalVencimentos: 5282.4,
    totalDescontos: 1095.7,
    salarioLiquido: 4186.7,
    status: "APROVADO",
    chavePix: "rodrigo.fisio@gmail.com",
  },
  {
    id: "colab-8",
    nome: "Dra. Fernanda Lima",
    email: "fernanda.lima@medcore.com.br",
    cargo: "Farmacêutica Clínica & RT",
    departamento: "Farmácia Hospitalar",
    regime: "CLT",
    registroProfissional: "CRF-SP 39.120",
    cpf: "163.509.774-88",
    admissao: "20/07/2023",
    cbo: "2234-05",
    salarioBase: 6200.0,
    adicionais: {
      insalubridade: 282.4,
      bonusMeta: 1000.0,
    },
    descontos: {
      inss: 840.5,
      irrf: 510.2,
      valeTransporte: 240.0,
      valeRefeicao: 100.0,
    },
    beneficiosEmpresa: {
      vr: 850.0,
      vt: 240.0,
      saude: 420.0,
      odonto: 55.0,
      seguroVida: 75.0,
    },
    totalVencimentos: 7482.4,
    totalDescontos: 1690.7,
    salarioLiquido: 5791.7,
    status: "PENDENTE",
    chavePix: "fernanda.farm@medcore.com.br",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get("unitId");
    const competencia = searchParams.get("competencia") || "09/2026";

    // Calcular Totais
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

    const guiasTributarias = [
      {
        id: "guia-fgts",
        tipo: "FGTS Digital",
        competencia,
        vencimento: "20/10/2026",
        valor: Math.round(encargosFGTS * 100) / 100,
        codigoBarras: "85820000001 2 11428000000 7 00002026090 9 20261020001 3",
        linhaDigitavel: "85820.00001 21142.800000 70000.202609 9 202610200013",
        status: "AGUARDANDO_PAGAMENTO",
        chavePix: "00020126580014br.gov.bcb.pix0136fgts-digital-arrecadacao-medcore-2026",
      },
      {
        id: "guia-inss",
        tipo: "DARF Previdenciário (DCTFWeb)",
        competencia,
        vencimento: "20/10/2026",
        valor: Math.round((encargosINSSPatronal + 2973.25) * 100) / 100,
        codigoBarras: "85860000002 9 09250000001 4 00002026090 8 20261020002 1",
        linhaDigitavel: "85860.00002 90925.000001 40000.202609 8 202610200021",
        status: "AGUARDANDO_PAGAMENTO",
        chavePix: "00020126580014br.gov.bcb.pix0136dctfweb-medcore-inss-2026",
      },
      {
        id: "guia-irrf",
        tipo: "DARF IRRF Retido na Fonte (0561)",
        competencia,
        vencimento: "20/10/2026",
        valor: 8940.5,
        codigoBarras: "85890000003 4 08940500000 1 00002026090 6 20261020003 8",
        linhaDigitavel: "85890.00003 40894.050000 10000.202609 6 202610200038",
        status: "AGUARDANDO_PAGAMENTO",
        chavePix: "00020126580014br.gov.bcb.pix0136darf-irrf-medcore-2026",
      },
      {
        id: "guia-pis",
        tipo: "PIS s/ Folha de Pagamento (8301)",
        competencia,
        vencimento: "25/10/2026",
        valor: Math.round(totalBaseCLT * 0.01 * 100) / 100,
        codigoBarras: "85810000004 1 00282000000 5 00002026090 4 20261025004 2",
        linhaDigitavel: "85810.00004 10028.200000 50000.202609 4 202610250042",
        status: "AGUARDANDO_PAGAMENTO",
        chavePix: "00020126580014br.gov.bcb.pix0136darf-pis-medcore-2026",
      },
    ];

    const catalogoBeneficios = [
      {
        id: "ben-vr",
        nome: "Vale Alimentação / Refeição",
        operadora: "Flash Benefícios Corporativos",
        tipo: "Cartão Multi-Benefícios",
        valorMedioMes: 800.0,
        colaboradoresAtivos: 5,
        custoTotal: 3900.0,
        proximaRecarga: "01/10/2026",
        status: "ATIVO",
      },
      {
        id: "ben-saude",
        nome: "Plano de Saúde Hospitalar",
        operadora: "Bradesco Saúde Top Nacional",
        tipo: "Assistência Médica com Coparticipação",
        valorMedioMes: 520.0,
        colaboradoresAtivos: 8,
        custoTotal: 4100.0,
        proximaRecarga: "10/10/2026",
        status: "ATIVO",
      },
      {
        id: "ben-odonto",
        nome: "Plano Odontológico",
        operadora: "OdontoPrev Clínico",
        tipo: "Odontologia Integral",
        valorMedioMes: 65.0,
        colaboradoresAtivos: 8,
        custoTotal: 520.0,
        proximaRecarga: "10/10/2026",
        status: "ATIVO",
      },
      {
        id: "ben-vt",
        nome: "Vale Transporte & Mobilidade",
        operadora: "SPTrans / Bilhete Único & Uber Corporate",
        tipo: "Transporte Intermunicipal e Urbano",
        valorMedioMes: 215.0,
        colaboradoresAtivos: 5,
        custoTotal: 1070.0,
        proximaRecarga: "01/10/2026",
        status: "ATIVO",
      },
      {
        id: "ben-seguro",
        nome: "Seguro de Vida em Grupo",
        operadora: "Porto Seguro Saúde & Vida",
        tipo: "Apólice Coletiva Hospitalar R$ 150.000",
        valorMedioMes: 110.0,
        colaboradoresAtivos: 8,
        custoTotal: 960.0,
        proximaRecarga: "15/10/2026",
        status: "ATIVO",
      },
    ];

    const esocialLogs = [
      {
        evento: "S-1200",
        nome: "Remuneração de Trabalhador",
        protocolo: "1.2.202609.0000000000129481729",
        dataEnvio: "25/09/2026 14:32",
        status: "HOMOLOGADO",
      },
      {
        evento: "S-1210",
        nome: "Pagamentos de Rendimentos",
        protocolo: "1.2.202609.0000000000129481845",
        dataEnvio: "25/09/2026 14:35",
        status: "HOMOLOGADO",
      },
      {
        evento: "S-2200",
        nome: "Cadastramento Inicial e Admissão",
        protocolo: "1.2.202609.0000000000129482103",
        dataEnvio: "22/09/2026 10:15",
        status: "HOMOLOGADO",
      },
    ];

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
    const { action, colaboradorId, valor, motivo, tipo } = body;

    if (action === "PAGAR_COLABORADOR") {
      return NextResponse.json({
        success: true,
        message: `Pagamento via Pix confirmado para o colaborador ${colaboradorId}`,
        dataPagamento: new Date().toLocaleDateString("pt-BR"),
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
