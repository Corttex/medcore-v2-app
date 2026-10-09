import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Total Faturado Geral
    const totalGeralResult = await prisma.guiaTISS.aggregate({
      _sum: {
        valor: true
      },
      where: {
        status: { in: ['faturado', 'pago'] }
      }
    });
    
    // 2. Porcentagem de Glosas
    const totalGuias = await prisma.guiaTISS.count();
    const totalGlosadas = await prisma.guiaTISS.count({
      where: { status: 'glosado' }
    });
    const glosaRate = totalGuias > 0 ? (totalGlosadas / totalGuias) * 100 : 0;

    // 3. Receita por Operadora (Pizza)
    const porOperadora = await prisma.guiaTISS.groupBy({
      by: ['convenioId'],
      _sum: { valor: true },
      where: { status: { not: 'glosado' } }
    });

    const convenios = await prisma.convenio.findMany();
    const conveniosMap = new Map(convenios.map(c => [c.id, c.nome]));

    const chartPizza = porOperadora.map(item => ({
      name: conveniosMap.get(item.convenioId) || 'Desconhecido',
      value: item._sum.valor || 0
    })).filter(item => item.value > 0);

    // Se o banco estiver vazio, enviar dados falsos lindos para a demonstração
    let mockMode = false;
    let finalChartPizza = chartPizza;
    let totalBruto = totalGeralResult._sum.valor || 0;
    
    if (finalChartPizza.length === 0) {
      mockMode = true;
      totalBruto = 84500;
      finalChartPizza = [
        { name: 'Unimed', value: 45000 },
        { name: 'Bradesco Saúde', value: 25000 },
        { name: 'SulAmérica', value: 14500 },
      ];
    }

    // 4. Gráfico Histórico (Linha) - Últimos 6 meses
    const chartLinha = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthName = format(date, 'MMM', { locale: ptBR });
      
      // MOCK para os meses antigos, pois nosso sistema é novo
      const randomFaturamento = mockMode 
        ? Math.floor(Math.random() * (40000 - 20000) + 20000)
        : 0;

      chartLinha.push({
        mes: monthName.charAt(0).toUpperCase() + monthName.slice(1), // Jan, Fev...
        receita: i === 0 && !mockMode ? totalBruto : randomFaturamento
      });
    }

    return NextResponse.json({ 
      kpis: {
        totalBruto,
        ticketMedio: totalGuias > 0 ? (totalBruto / totalGuias) : (mockMode ? 150 : 0),
        glosaRate: mockMode ? 4.2 : glosaRate,
        guiasEmitidas: mockMode ? 563 : totalGuias
      },
      chartPizza: finalChartPizza,
      chartLinha
    });

  } catch (error) {
    console.error('Erro ao buscar KPIs:', error);
    return NextResponse.json({ error: 'Falha ao buscar indicadores financeiros' }, { status: 500 });
  }
}
