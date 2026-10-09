import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const medicos = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'medico' },
          { crm: { not: null } }
        ]
      },
      orderBy: { fullName: 'asc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        especialidade: true,
        crm: true,
        crmUf: true
      }
    });

    return NextResponse.json(medicos);
  } catch (error) {
    console.error('Erro ao buscar médicos:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, email, password, especialidade, crm, crmUf, pin } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Nome, Email e Senha são obrigatórios.' }, { status: 400 });
    }

    // Verificar se email já existe
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Este email já está cadastrado.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoMedico = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'medico',
        especialidade: especialidade || null,
        crm: crm || null,
        crmUf: crmUf || null,
        pin: pin || null
      }
    });

    return NextResponse.json({ success: true, user: { id: novoMedico.id, email: novoMedico.email } }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar médico:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
