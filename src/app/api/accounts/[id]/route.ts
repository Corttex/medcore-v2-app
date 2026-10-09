import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, aiCategory } = body;
    
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    // Permitimos atualizar apenas status e a categoria da IA neste endpoint para manter simples
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (aiCategory !== undefined) updateData.aiCategory = aiCategory;

    const updatedAccount = await prisma.financialAccount.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedAccount);
  } catch (error: any) {
    console.error("Erro ao atualizar conta:", error);
    return NextResponse.json({ error: "Erro ao atualizar a conta no banco" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await prisma.financialAccount.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar conta:", error);
    return NextResponse.json({ error: "Erro ao excluir a conta" }, { status: 500 });
  }
}
