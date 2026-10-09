import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retorna todos os Lotes TISS gerados
export async function GET() {
  try {
    const lotes = await prisma.loteTISS.findMany({
      include: {
        guias: {
          include: {
            convenio: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: lotes });
  } catch (error) {
    console.error("Erro ao listar Lotes TISS:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// POST: "Gerar Lote XML"
// Simula a exportação de guias pendentes de um convênio específico para um arquivo Lote.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { convenioId } = body;

    // Busca guias pendentes (no MVP pegaremos de todos ou do convenio específico)
    const filter = convenioId ? { convenioId, status: "pendente" } : { status: "pendente" };
    
    const guiasPendentes = await prisma.guiaTISS.findMany({
      where: filter
    });

    if (guiasPendentes.length === 0) {
      return NextResponse.json({ success: false, error: "Nenhuma guia pendente encontrada para gerar lote." }, { status: 400 });
    }

    // Cria um novo lote
    const numeroLote = `LT-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
    
    const lote = await prisma.loteTISS.create({
      data: {
        numero: numeroLote,
        status: "gerado",
        xmlUrl: `/downloads/lotes/${numeroLote}.xml` // Mock download URL
      }
    });

    // Atualiza as guias para "faturado" e vincula ao lote
    const guiasIds = guiasPendentes.map(g => g.id);
    
    await prisma.guiaTISS.updateMany({
      where: {
        id: { in: guiasIds }
      },
      data: {
        loteId: lote.id,
        status: "faturado"
      }
    });

    return NextResponse.json({ success: true, data: lote, guiasAfetadas: guiasIds.length });
  } catch (error) {
    console.error("Erro ao gerar Lote TISS:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
