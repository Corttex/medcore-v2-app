import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unit');

    // REGRA DE NEGÓCIO: O portal de agendamento online só pode ser acessado com o identificador da clínica
    if (!unitId || unitId.trim() === '') {
      return NextResponse.json({ 
        error: 'Identificador da clínica não informado. O agendamento online só pode ser acessado através do link oficial fornecido pela clínica.',
        code: 'UNIT_REQUIRED',
        profissionais: [] 
      }, { status: 400 });
    }

    // Buscar a unidade/clínica
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        name: true,
        type: true,
        phone: true,
        address: true,
        active: true,
      }
    });

    if (!unit) {
      return NextResponse.json({ 
        error: 'Clínica não encontrada ou link de agendamento inválido/expirado.',
        code: 'UNIT_NOT_FOUND',
        profissionais: [] 
      }, { status: 404 });
    }

    if (!unit.active) {
      return NextResponse.json({ 
        error: 'O agendamento online desta clínica está temporariamente suspenso.',
        code: 'UNIT_INACTIVE',
        profissionais: [] 
      }, { status: 403 });
    }

    // Buscar profissionais vinculados a esta clínica específica
    const profissionais = await prisma.user.findMany({
      where: {
        units: {
          some: {
            unitId: unitId
          }
        },
        role: {
          not: 'viewer',
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        especialidade: true,
      },
    });

    return NextResponse.json({ 
      unit,
      profissionais 
    });
  } catch (error) {
    console.error('Erro ao buscar profissionais da clínica:', error);
    return NextResponse.json({ error: 'Falha interna ao buscar informações da clínica' }, { status: 500 });
  }
}
