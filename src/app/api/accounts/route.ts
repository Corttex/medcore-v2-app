import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get("unitId");

    if (!unitId) {
      return NextResponse.json({ error: "unitId é obrigatório" }, { status: 400 });
    }

    const accounts = await prisma.financialAccount.findMany({
      where: { unitId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, supplier, value, dueDate, category, status, unitId, notes, imageUrl, aiCategory, type } = body;

    if (!unitId) {
      return NextResponse.json({ error: "unitId é obrigatório para criar a conta" }, { status: 400 });
    }

    const newAccount = await prisma.financialAccount.create({
      data: {
        title,
        supplier,
        value,
        dueDate,
        category,
        status,
        unitId,
        notes,
        imageUrl,
        aiCategory,
        type: type || "PAYABLE"
      }
    });

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json({ error: "Erro ao salvar a conta no banco" }, { status: 500 });
  }
}
