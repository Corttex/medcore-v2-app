import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAndUnit } from "@/lib/auth/serverUtils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { unitId } = await getUserAndUnit(req);
    if (!unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const patrimonio = await prisma.patrimonio.findFirst({
      where: {
        id: params.id,
        unitId,
      },
      include: {
        responsavel: { select: { fullName: true, email: true } },
      },
    });

    if (!patrimonio) return NextResponse.json({ error: "Patrimônio não encontrado" }, { status: 404 });

    return NextResponse.json(patrimonio);
  } catch (error) {
    console.error("Error fetching patrimonio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { 
      status, 
      localizacao, 
      estado, 
      responsavelId, 
      nome, 
      descricao, 
      valorAquisicao,
      marca,
      modelo,
      numeroSerie,
      fornecedor,
      garantiaFim,
      observacoes,
      dataAquisicao
    } = body;

    const dataToUpdate: any = {
      ...(status && { status }),
      ...(localizacao !== undefined && { localizacao }),
      ...(estado !== undefined && { estado }),
      ...(responsavelId !== undefined && { responsavelId }),
      ...(nome && { nome }),
      ...(descricao !== undefined && { descricao }),
      ...(valorAquisicao !== undefined && { valorAquisicao: valorAquisicao ? parseFloat(valorAquisicao) : null }),
      ...(marca !== undefined && { marca }),
      ...(modelo !== undefined && { modelo }),
      ...(numeroSerie !== undefined && { numeroSerie }),
      ...(fornecedor !== undefined && { fornecedor }),
      ...(garantiaFim !== undefined && { garantiaFim: garantiaFim ? new Date(garantiaFim) : null }),
      ...(observacoes !== undefined && { observacoes }),
      ...(dataAquisicao !== undefined && { dataAquisicao: dataAquisicao ? new Date(dataAquisicao) : null }),
    };

    const patrimonio = await prisma.patrimonio.update({
      where: {
        id: params.id,
        unitId,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(patrimonio);
  } catch (error) {
    console.error("Error updating patrimonio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "admin" && user.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.patrimonio.delete({
      where: {
        id: params.id,
        unitId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting patrimonio:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
