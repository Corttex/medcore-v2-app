import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const patientsCount = await prisma.paciente.count();
    
    const today = new Date().toISOString().split('T')[0];
    const meetingsToday = await prisma.meeting.count({
      where: { date: today }
    });

    const remindersCount = await prisma.reminder.count({
      where: { status: 'pending' }
    });

    // Calcular Faturamento TISS
    const guias = await prisma.guiaTISS.aggregate({
      _sum: { valor: true }
    });
    
    const faturamentoTotal = guias._sum.valor || 0;
    
    // Contar notas pendentes
    const notasPendentes = await prisma.guiaTISS.count({
      where: { status: 'pendente' }
    });

    return NextResponse.json({
      // Dados Reais
      patients: patientsCount,
      meetingsToday: meetingsToday,
      totalCapacityToday: 60, // Limite hardcoded temporário para o MVP
      reminders: remindersCount,
      criticalAlerts: 0,
      faturamento: faturamentoTotal,
      notasPendentes: notasPendentes,
      
      // Dados Zerados para o Piloto (Sem funcionalidade no MVP)
      efficiency: 0,
      efficiencyTrend: "0%",
      utiOccupancy: 0,
      surgeryOccupancy: 0,
      staffNursing: 0,
      staffMedicine: 0,
      staffTechs: 0,
      absenteeismRate: 0,
      
      // Dados IA Zerados/Placeholder
      aiPrediction: "Aguardando volume de dados históricos para gerar predições.",
      aiCompliance: "Sem registros suficientes para auditar.",
      aiOpportunities: "0"
    }, {
      headers: {
        "Cache-Control": "private, max-age=5, stale-while-revalidate=30"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
