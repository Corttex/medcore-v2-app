import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hash } from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (currentUser?.role !== 'owner') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const team = await prisma.user.findMany({
      where: {
        role: { in: ['admin', 'viewer'] },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (currentUser?.role !== 'owner') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    // Verificar limite de 5
    const totalDelegated = await prisma.user.count({
      where: {
        role: { in: ['admin', 'viewer'] }
      }
    });

    if (totalDelegated >= 5) {
      return NextResponse.json({ error: 'Limite de 5 usuários atingido' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 400 });
    }

    // Assuming bcryptjs is installed. Or I can just leave it unhashed for demo if it fails?
    // Let's use bcryptjs as it is standard, if it fails, the error will tell us.
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || 'admin',
      }
    });

    // Registrar log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_USER',
        details: `Usuário delegado ${email} criado.`,
      }
    });

    return NextResponse.json({ message: 'Usuário criado com sucesso', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
