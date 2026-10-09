import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAndUnit } from "@/lib/auth/serverUtils";

export async function GET(req: Request) {
  try {
    const { unitId } = await getUserAndUnit(req);
    if (!unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const patrimonios = await prisma.patrimonio.findMany({
      where: {
        unitId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        responsavel: { select: { fullName: true } },
      },
    });

    return NextResponse.json(patrimonios);
  } catch (error) {
    console.error("Error fetching patrimonios:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { 
      codigoTag, 
      nome, 
      descricao, 
      categoria, 
      dataAquisicao, 
      valorAquisicao, 
      marca,
      modelo,
      numeroSerie,
      fornecedor,
      garantiaFim,
      observacoes,
      localizacao, 
      estado, 
      status 
    } = body;

    if (!codigoTag || !nome || !categoria) {
      return NextResponse.json({ error: "Código, Nome e Categoria são obrigatórios" }, { status: 400 });
    }

    // Check if tag already exists in unit
    const existingTag = await prisma.patrimonio.findFirst({
      where: {
        codigoTag,
        unitId
      }
    });

    if (existingTag) {
      return NextResponse.json({ error: "Já existe um patrimônio com esta Tag." }, { status: 400 });
    }

    const newPatrimonio = await prisma.patrimonio.create({
      data: {
        codigoTag,
        nome,
        descricao,
        categoria,
        dataAquisicao: dataAquisicao ? new Date(dataAquisicao) : null,
        valorAquisicao: valorAquisicao ? parseFloat(valorAquisicao) : null,
        marca: marca || null,
        modelo: modelo || null,
        numeroSerie: numeroSerie || null,
        fornecedor: fornecedor || null,
        garantiaFim: garantiaFim ? new Date(garantiaFim) : null,
        observacoes: observacoes || null,
        localizacao: localizacao || null,
        estado: estado || "Bom",
        status: status || "Ativo",
        unitId,
      },
    });

    return NextResponse.json(newPatrimonio, { status: 201 });
  } catch (error) {
    console.error("Error creating patrimonio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
