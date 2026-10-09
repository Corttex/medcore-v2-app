import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'admin-demo-id'; // Fallback for MVP
    const unitId = searchParams.get('unitId') || 'unit-demo-id';

    const registros = await prisma.registroPonto.findMany({
      where: {
        profissionalId: userId,
        unitId: unitId,
        // Idealmente filtrar por data, mas como é MVP, vamos trazer os mais recentes
      },
      orderBy: {
        dataHora: 'desc'
      },
      take: 20
    });

    return NextResponse.json({ success: true, data: registros });
  } catch (error) {
    console.error("Erro ao buscar registros de ponto:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, unitId, tipo, latitude, longitude, precisao, fotoUrl } = body;

    if (!tipo) {
      return NextResponse.json({ success: false, error: "Tipo de marcação é obrigatório" }, { status: 400 });
    }

    // Mock IDs if not provided from frontend context
    const finalUserId = userId || 'admin-demo-id';
    const finalUnitId = unitId || 'unit-demo-id';

    // Para evitar erro de FK no SQLite em desenvolvimento, se o User/Unit não existir, a gente deveria criar
    // Porém, vamos assumir que o banco de seed já rodou. Se falhar por FK, a gente pega no try catch
    
    // Verifica se já existe o user, se não, usa o admin-demo-id e unit-demo-id ou loga
    const user = await prisma.user.findUnique({ where: { id: finalUserId } });
    if (!user) {
      // Como é um MVP, se não tiver o user, falha amigavelmente
      return NextResponse.json({ success: false, error: "Usuário não encontrado. Crie um registro no banco para " + finalUserId }, { status: 400 });
    }

    const registro = await prisma.registroPonto.create({
      data: {
        tipo,
        latitude: latitude || null,
        longitude: longitude || null,
        precisao: precisao || null,
        fotoUrl: fotoUrl || null,
        profissionalId: finalUserId,
        unitId: finalUnitId,
      }
    });

    return NextResponse.json({ success: true, data: registro });
  } catch (error) {
    console.error("Erro ao registrar ponto:", error);
    return NextResponse.json({ success: false, error: "Erro interno ao salvar. Verifique se as dependências (Profissional/Unidade) existem." }, { status: 500 });
  }
}
