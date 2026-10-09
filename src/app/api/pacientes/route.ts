import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');

    const pacientes = await prisma.paciente.findMany({
      where: unitId ? { unitId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        convenio: true,
      },
      take: 50,
    });

    return NextResponse.json(pacientes);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { id, nome, email, telefone, cpf, rg, sexo, endereco, dataNascimento, convenioId, numeroCarteirinha, validadeCarteirinha } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID do paciente obrigatório' }, { status: 400 });
    }

    const pacienteAtualizado = await prisma.paciente.update({
      where: { id },
      data: {
        nome,
        email,
        telefone,
        cpf,
        rg,
        sexo,
        endereco,
        dataNascimento,
        convenioId: convenioId || null,
        numeroCarteirinha,
        validadeCarteirinha,
      },
      include: {
        convenio: true,
      }
    });

    return NextResponse.json(pacienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    const { nome, email, telefone, leadSource, convenioId, cpf, dataNascimento, unitId } = data;

    if (!nome) {
      return NextResponse.json({ error: 'Nome do lead obrigatório' }, { status: 400 });
    }

    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,
        email: email || null,
        telefone: telefone || null,
        leadSource: leadSource || 'manual',
        convenioId: convenioId || null,
        cpf: cpf || null,
        dataNascimento: dataNascimento || null,
        unitId: unitId || null,
      },
      include: {
        convenio: true,
      }
    });

    return NextResponse.json(novoPaciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
