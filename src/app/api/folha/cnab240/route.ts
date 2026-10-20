import { NextResponse } from "next/server";
import { generateCNAB240File, CNABPaymentRecord } from "@/lib/banking/cnab240";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competencia = searchParams.get("competencia") || "09/2026";

  // Pagamentos aprovados para liquidação bancária da competência
  const payments: CNABPaymentRecord[] = [
    {
      id: "colab-1",
      nome: "Dr. Felipe Azevedo",
      documento: "41.892.104/0001-55", // CNPJ PJ
      chavePix: "41.892.104/0001-55",
      valorLiquido: 30501.25,
      tipoPagamento: "REPASSE_PJ",
    },
    {
      id: "colab-2",
      nome: "Dra. Beatriz Albuquerque",
      documento: "29.381.092/0001-44",
      chavePix: "beatriz.cardio@medcore.com.br",
      valorLiquido: 21303.95,
      tipoPagamento: "REPASSE_PJ",
    },
    {
      id: "colab-4",
      nome: "Enfª Camila Nogueira",
      documento: "411.238.990-87",
      chavePix: "camila.coren@gmail.com",
      valorLiquido: 5819.65,
      tipoPagamento: "SALARIO_CLT",
    },
    {
      id: "colab-5",
      nome: "Lucas Ribeiro Mendes",
      documento: "518.773.120-03",
      chavePix: "lucas.rad@hotmail.com",
      valorLiquido: 4148.70,
      tipoPagamento: "SALARIO_CLT",
    },
    {
      id: "colab-6",
      nome: "Juliana Mendonca",
      documento: "389.102.551-76",
      chavePix: "389.102.551-76",
      valorLiquido: 2376.70,
      tipoPagamento: "SALARIO_CLT",
    },
    {
      id: "colab-7",
      nome: "Rodrigo Peixoto",
      documento: "277.940.339-11",
      chavePix: "rodrigo.fisio@gmail.com",
      valorLiquido: 4186.70,
      tipoPagamento: "SALARIO_CLT",
    },
    {
      id: "colab-8",
      nome: "Dra. Fernanda Lima",
      documento: "163.509.774-88",
      chavePix: "fernanda.farm@medcore.com.br",
      valorLiquido: 5791.70,
      tipoPagamento: "SALARIO_CLT",
    },
  ];

  const cnabContent = generateCNAB240File(payments, {
    bancoCodigo: "341", // Itaú Unibanco
    cnpjHospital: "45.182.934/0001-92",
    razaoSocialHospital: "HOSPITAL CENTRAL MEDCORE LTDA",
    agencia: "1800",
    conta: "928174",
    competencia,
  });

  const filename = `REM_MEDCORE_${competencia.replace("/", "")}_CNAB240.REM`;

  return new NextResponse(cnabContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
