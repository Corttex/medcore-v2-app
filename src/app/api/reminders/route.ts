import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const reminders = await prisma.reminder.findMany({
      where: { user_id: session.user.id },
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar lembretes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const reminder = await prisma.reminder.create({
      data: {
        ...body,
        user_id: session.user.id
      }
    });
    return NextResponse.json(reminder);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar lembrete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, status } = body;
    const reminder = await prisma.reminder.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(reminder);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar lembrete" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.reminder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar lembrete" }, { status: 500 });
  }
}
