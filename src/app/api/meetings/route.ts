import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    return NextResponse.json(meetings);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar reuniões" }, { status: 500 });
  }
}
