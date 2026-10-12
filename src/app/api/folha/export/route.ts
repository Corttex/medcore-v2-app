import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competencia = searchParams.get("competencia") || "09/2026";
  const jurisdiction = searchParams.get("jurisdiction") || "BR";
  const format = searchParams.get("format") || "json";

  // Mock de dados da folha da competência estruturado para integração contábil
  const colaboradores = [
    {
      id: "colab-1",
      nome: "Dr. Felipe Azevedo",
      cpf: "284.912.438-02",
      cargo: "Diretor Clínico & Cirurgião Geral",
      departamento: "Corpo Clínico",
      regime: "PJ",
      registro: "CRM-SP 124.890",
      cbo: "2251-20",
      salarioBase: 24000.0,
      adicionais: 8500.0,
      descontos: 3250.0,
      totalVencimentos: 32500.0,
      salarioLiquido: 29250.0,
      status: "PAGO",
      bancoPix: "felipe.azevedo@medcore.com.br"
    },
    {
      id: "colab-2",
      nome: "Dra. Beatriz Albuquerque",
      cpf: "192.441.768-15",
      cargo: "Cardiologista & Ecocardiografia",
      departamento: "Ambulatório",
      regime: "PJ",
      registro: "CRM-SP 98.452",
      cbo: "2251-20",
      salarioBase: 18500.0,
      adicionais: 4200.0,
      descontos: 2450.0,
      totalVencimentos: 22700.0,
      salarioLiquido: 20250.0,
      status: "PAGO",
      bancoPix: "beatriz.albuquerque@medcore.com.br"
    },
    {
      id: "colab-3",
      nome: "Mariana Santos",
      cpf: "394.882.109-44",
      cargo: "Enfermeira Chefe da UTI",
      departamento: "UTI Adulto",
      regime: "CLT",
      registro: "COREN-SP 45.109",
      cbo: "2235-05",
      salarioBase: 8400.0,
      adicionais: 2480.0,
      descontos: 1984.5,
      totalVencimentos: 10880.0,
      salarioLiquido: 8895.5,
      status: "PAGO",
      bancoPix: "mariana.santos@medcore.com.br"
    },
    {
      id: "colab-4",
      nome: "Lucas Andrade",
      cpf: "451.902.348-77",
      cargo: "Técnico de Enfermagem - UTI",
      departamento: "UTI Adulto",
      regime: "CLT",
      registro: "COREN-SP 89.321-TE",
      cbo: "3222-05",
      salarioBase: 3800.0,
      adicionais: 1120.0,
      descontos: 574.8,
      totalVencimentos: 4920.0,
      salarioLiquido: 4345.2,
      status: "PAGO",
      bancoPix: "lucas.andrade@medcore.com.br"
    },
    {
      id: "colab-5",
      nome: "Carlos Eduardo Mendes",
      cpf: "182.394.092-12",
      cargo: "Recepcionista Líder",
      departamento: "Atendimento & Recepção",
      regime: "CLT",
      registro: "MAT-2023-04",
      cbo: "4221-10",
      salarioBase: 2600.0,
      adicionais: 600.0,
      descontos: 324.5,
      totalVencimentos: 3200.0,
      salarioLiquido: 2875.5,
      status: "PAGO",
      bancoPix: "carlos.mendes@medcore.com.br"
    },
    {
      id: "colab-6",
      nome: "Roberta Camargo",
      cpf: "512.783.992-80",
      cargo: "Analista de Faturamento TISS",
      departamento: "Faturamento & Convênios",
      regime: "CLT",
      registro: "MAT-2023-09",
      cbo: "4110-10",
      salarioBase: 4200.0,
      adicionais: 750.0,
      descontos: 685.2,
      totalVencimentos: 4950.0,
      salarioLiquido: 4264.8,
      status: "APROVADO",
      bancoPix: "roberta.camargo@medcore.com.br"
    }
  ];

  if (format === "csv") {
    const headers = [
      "ID",
      "Nome Completo",
      "Documento Fiscal",
      "Cargo",
      "Departamento",
      "Regime",
      "Registro de Classe",
      "CBO",
      "Salario Base (R$)",
      "Adicionais (R$)",
      "Descontos Legais (R$)",
      "Total Vencimentos (R$)",
      "Salario Liquido (R$)",
      "Status",
      "Chave Pix / Conta"
    ];

    const rows = colaboradores.map(c => [
      c.id,
      `"${c.nome}"`,
      c.cpf,
      `"${c.cargo}"`,
      `"${c.departamento}"`,
      c.regime,
      c.registro,
      c.cbo,
      c.salarioBase.toFixed(2),
      c.adicionais.toFixed(2),
      c.descontos.toFixed(2),
      c.totalVencimentos.toFixed(2),
      c.salarioLiquido.toFixed(2),
      c.status,
      c.bancoPix
    ]);

    // UTF-8 BOM para garantir compatibilidade perfeita com Excel Windows
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="folha_medcore_${competencia.replace('/', '-')}_${jurisdiction}.csv"`
      }
    });
  }

  return NextResponse.json({
    success: true,
    protocol: `MEDCORE-ACC-${Date.now()}`,
    competencia,
    jurisdiction,
    timestamp: new Date().toISOString(),
    securityCompliance: {
      standard: "LGPD Art. 7º / GDPR Article 6",
      encryption: "TLS 1.3 / AES-256",
      auditTrailId: `LOG-AUDIT-${Date.now()}`
    },
    resumoContabil: {
      totalBruto: 79150.0,
      totalLiquido: 69881.0,
      totalRetencoes: 9269.0,
      encargosPatronaisEstimados: 16840.0,
      totalVidas: colaboradores.length
    },
    colaboradores
  });
}
