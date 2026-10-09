import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAndUnit } from "@/lib/auth/serverUtils";
import { analyzePatrimonioCosts } from "@/lib/services/openrouter";

export async function GET(req: Request) {
  try {
    const { unitId } = await getUserAndUnit(req);
    if (!unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const patrimonioId = searchParams.get("patrimonioId");

    if (!patrimonioId) {
      return NextResponse.json({ error: "patrimonioId is required" }, { status: 400 });
    }

    const patrimonio = await prisma.patrimonio.findFirst({
      where: { id: patrimonioId, unitId },
      include: { ordensServico: true }
    });

    if (!patrimonio) {
      return NextResponse.json({ error: "Patrimônio não encontrado" }, { status: 404 });
    }

    const custoTotalManutencao = patrimonio.ordensServico.reduce((acc, os) => acc + (os.valorCusto || 0), 0);

    const dataToAnalyze = `
Equipamento: ${patrimonio.nome}
Categoria: ${patrimonio.categoria}
Valor de Aquisição: R$ ${patrimonio.valorAquisicao || 0}
Total de Manutenções Realizadas: ${patrimonio.ordensServico.length}
Custo Total Acumulado de Manutenção: R$ ${custoTotalManutencao}
Status Atual: ${patrimonio.status}
    `;

    const insight = await analyzePatrimonioCosts(dataToAnalyze);

    return NextResponse.json({ insight, custoTotalManutencao });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
