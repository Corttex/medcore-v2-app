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

    const convenios = await prisma.convenio.findMany({
      where: { unitId: user.primaryUnitId },
      include: {
        procedimentos: {
          include: {
            procedimento: true
          }
        }
      }
    });

    return NextResponse.json({ convenios });
  } catch (error) {
    console.error("Erro ao buscar convênios:", error);
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

    const { nome, ansId, requiresToken } = await req.json();

    const convenio = await prisma.convenio.create({
      data: {
        nome,
        ansId,
        requiresToken: !!requiresToken,
        unitId: user.primaryUnitId
      }
    });

    return NextResponse.json({ convenio });
  } catch (error) {
    console.error("Erro ao criar convênio:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
