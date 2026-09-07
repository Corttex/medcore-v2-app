import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const patientsCount = await prisma.paciente.count();
    
    const today = new Date().toISOString().split('T')[0];
    const meetingsCount = await prisma.meeting.count({
      where: { date: today }
    });

    const remindersCount = await prisma.reminder.count({
      where: { status: 'pending' }
    });

    return NextResponse.json({
      patients: patientsCount,
      meetings: meetingsCount,
      reminders: remindersCount,
      criticalAlerts: 0
    }, {
      headers: {
        "Cache-Control": "private, max-age=5, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}

