import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAndUnit } from "@/lib/auth/serverUtils";

export async function GET(req: Request) {
  try {
    const { unitId } = await getUserAndUnit(req);
    if (!unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const ordensServico = await prisma.ordemServico.findMany({
      where: {
        unitId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        solicitante: { select: { fullName: true } },
        responsavel: { select: { fullName: true } },
        patrimonio: { select: { nome: true, localizacao: true } }
      },
    });

    return NextResponse.json(ordensServico);
  } catch (error) {
    console.error("Error fetching OS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { categoria, descricao, prioridade, prazoSLA, valorCusto, patrimonioId } = body;

    if (!categoria || !descricao) {
      return NextResponse.json({ error: "Categoria e descrição são obrigatórias" }, { status: 400 });
    }

    // Gerar número de protocolo (ano + mes + id_random_curto)
    const dateStr = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocolo = `OS-${dateStr}-${randomSuffix}`;

    const newOS = await prisma.ordemServico.create({
      data: {
        protocolo,
        unitId,
        solicitanteId: user.id,
        categoria,
        descricao,
        prioridade: prioridade || "Normal",
        prazoSLA: prazoSLA ? new Date(prazoSLA) : null,
        valorCusto: valorCusto ? parseFloat(valorCusto) : null,
        patrimonioId: patrimonioId || null,
      },
    });

    return NextResponse.json(newOS, { status: 201 });
  } catch (error) {
    console.error("Error creating OS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
