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

    if (!unitId) {
      return NextResponse.json({ error: 'Unit ID é obrigatório' }, { status: 400 });
    }

    const cards = await prisma.kanbanCard.findMany({
      where: { unitId },
      orderBy: { createdAt: 'asc' },
    });

    // Format tags from JSON string if needed, but in schema we can just return it
    const formattedCards = cards.map(c => ({
      ...c,
      tags: c.tags ? JSON.parse(c.tags) : []
    }));

    return NextResponse.json(formattedCards);
  } catch (error) {
    console.error('Erro ao buscar Kanban cards:', error);
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
    const { title, description, assignee, dueDate, priority, column, tags, unitId } = data;

    if (!unitId || !title) {
      return NextResponse.json({ error: 'Dados insuficientes' }, { status: 400 });
    }

    const newCard = await prisma.kanbanCard.create({
      data: {
        title,
        description: description || null,
        assignee: assignee || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        column: column || 'todo',
        tags: tags ? JSON.stringify(tags) : null,
        unitId,
        userId: session.user.id
      }
    });

    const formattedCard = {
      ...newCard,
      tags: newCard.tags ? JSON.parse(newCard.tags) : []
    };

    return NextResponse.json(formattedCard);
  } catch (error) {
    console.error('Erro ao criar card no Kanban:', error);
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
    const { id, column, title, description, assignee, dueDate, priority, tags } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID do card obrigatório' }, { status: 400 });
    }

    const updateData: any = {};
    if (column !== undefined) updateData.column = column;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);

    const updatedCard = await prisma.kanbanCard.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      ...updatedCard,
      tags: updatedCard.tags ? JSON.parse(updatedCard.tags) : []
    });
  } catch (error) {
    console.error('Erro ao atualizar card no Kanban:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do card obrigatório' }, { status: 400 });
    }

    await prisma.kanbanCard.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar card no Kanban:', error);
    return NextResponse.json({ error: 'Falha interna' }, { status: 500 });
  }
}
