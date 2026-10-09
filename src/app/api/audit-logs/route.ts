import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, email: true }
        }
      },
      take: 100 // Retorna os últimos 100
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
