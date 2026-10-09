import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Registra uma nova movimentação (Entrada/Saída)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produtoId, tipo, quantidade, motivo } = body;

    if (!produtoId || !tipo || !quantidade) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 });
    }

    const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
    
    if (!produto) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    const qtdNum = Number(quantidade);

    // Valida saída se não tiver estoque suficiente
    if (tipo === "SAIDA" && produto.estoqueAtual < qtdNum) {
      return NextResponse.json({ success: false, error: "Estoque insuficiente" }, { status: 400 });
    }

    // Usar transaction para garantir atomicidade
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar movimentação  
      const mov = await tx.movimentacaoEstoque.create({
        data: {
          produtoId,
          tipo, // ENTRADA ou SAIDA
          quantidade: qtdNum,
          motivo: motivo || "Atualização manual via Dashboard",
          userId: "admin-demo-id" // Mock do user da sessão
        }
      });

      // 2. Atualizar Produto
      const updatedProduto = await tx.produto.update({
        where: { id: produtoId },
        data: {
          estoqueAtual: tipo === "ENTRADA" 
            ? { increment: qtdNum } 
            : { decrement: qtdNum }
        }
      });

      return { mov, updatedProduto };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Erro ao registrar Movimentação de Estoque:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
