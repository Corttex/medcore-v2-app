import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.primaryUnitId) {
      return NextResponse.json({ error: "Unidade não selecionada" }, { status: 400 });
    }

    const procedimentos = await prisma.procedimento.findMany({
      where: { unitId: user.primaryUnitId },
      include: {
        convenios: {
          include: {
            convenio: true
          }
        }
      }
    });

    return NextResponse.json({ procedimentos });
  } catch (error) {
    console.error("Erro ao buscar procedimentos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.primaryUnitId) {
      return NextResponse.json({ error: "Unidade não selecionada" }, { status: 400 });
    }

    const { nome, codigoBase, precosConvenios } = await req.json();

    // precosConvenios: [{ convenioId: "uuid", codigoEspecifico: "123", valor: 100, carenciaDias: 0 }]

    const procedimento = await prisma.procedimento.create({
      data: {
        nome,
        codigoBase,
        unitId: user.primaryUnitId,
        convenios: {
          create: precosConvenios?.map((c: any) => ({
            convenioId: c.convenioId,
            codigoEspecifico: c.codigoEspecifico,
            valor: parseFloat(c.valor || 0),
            carenciaDias: parseInt(c.carenciaDias || 0)
          })) || []
        }
      },
      include: {
        convenios: true
      }
    });

    return NextResponse.json({ procedimento });
  } catch (error) {
    console.error("Erro ao criar procedimento:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
