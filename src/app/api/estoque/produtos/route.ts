import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Lista todos os produtos
export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    });

    // Calcula o status com base no estoque minimo
    const data = produtos.map(p => {
      let status = "OK";
      if (p.quantidadeAtual === 0) status = "ESGOTADO";
      else if (p.quantidadeAtual <= p.estoqueMinimo) status = "ALERTA";

      return {
        ...p,
        status
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erro ao listar Produtos:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// POST: Cria um novo produto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, sku, categoria, unidade, estoqueMinimo, valorUnitario, unitId } = body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        sku: sku || `SKU-${Date.now()}`,
        categoria: categoria || "Insumos",
        unidadeMedida: unidade || "UN",
        quantidadeAtual: 0,
        estoqueMinimo: estoqueMinimo || 10,
        valorUnitario: valorUnitario || 0,
        unitId: unitId || "default-unit",
      }
    });

    return NextResponse.json({ success: true, data: produto });
  } catch (error) {
    console.error("Erro ao criar Produto:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
