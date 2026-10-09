import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retorna todas as guias pendentes ou faturadas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const guias = await prisma.guiaTISS.findMany({
      where: status ? { status } : undefined,
      include: {
        convenio: true,
        meeting: {
          include: {
            paciente: true,
            consultorio: true
          }
        },
        lote: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: guias });
  } catch (error) {
    console.error("Erro ao listar Guias TISS:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// POST: Cria uma nova guia manualmente (opcional para o MVP)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simplificado para MVP
    const { meetingId, convenioId, valor } = body;

    const guia = await prisma.guiaTISS.create({
      data: {
        meetingId,
        convenioId,
        valor: valor || 100, // Valor default mock
        status: "pendente"
      }
    });

    return NextResponse.json({ success: true, data: guia });
  } catch (error) {
    console.error("Erro ao criar Guia TISS:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
