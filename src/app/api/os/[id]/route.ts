import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserAndUnit } from "@/lib/auth/serverUtils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { unitId } = await getUserAndUnit(req);
    if (!unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const os = await prisma.ordemServico.findFirst({
      where: {
        id: params.id,
        unitId,
      },
      include: {
        solicitante: { select: { fullName: true, email: true } },
        responsavel: { select: { fullName: true, email: true } },
        patrimonio: { select: { nome: true, localizacao: true } },
      },
    });

    if (!os) return NextResponse.json({ error: "OS não encontrada" }, { status: 404 });

    return NextResponse.json(os);
  } catch (error) {
    console.error("Error fetching OS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { status, prioridade, responsavelId, comentarios, solucao, valorCusto, patrimonioId } = body;

    const dataToUpdate: any = {
      ...(status && { status }),
      ...(prioridade && { prioridade }),
      ...(responsavelId !== undefined && { responsavelId }),
      ...(comentarios !== undefined && { comentarios }),
      ...(solucao !== undefined && { solucao }),
      ...(valorCusto !== undefined && { valorCusto: parseFloat(valorCusto) || null }),
      ...(patrimonioId !== undefined && { patrimonioId }),
    };

    if (status === "Resolvida" || status === "Encerrada") {
      dataToUpdate.dataResolucao = new Date();
    }

    const os = await prisma.ordemServico.update({
      where: {
        id: params.id,
        unitId, // Security measure
      },
      data: dataToUpdate,
    });

    return NextResponse.json(os);
  } catch (error) {
    console.error("Error updating OS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { user, unitId } = await getUserAndUnit(req);
    if (!user || !unitId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only allow admin or owner to delete (implement your own role check here)
    if (user.role !== "admin" && user.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.ordemServico.delete({
      where: {
        id: params.id,
        unitId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting OS:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
