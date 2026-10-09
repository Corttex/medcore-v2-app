import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper para obter ou criar uma unidade padrão se necessário
async function getTargetUnitId(requestedUnitId?: string | null) {
  if (requestedUnitId) {
    const existing = await prisma.unit.findUnique({ where: { id: requestedUnitId } });
    if (existing) return existing.id;
  }
  const firstUnit = await prisma.unit.findFirst();
  if (firstUnit) return firstUnit.id;

  const newUnit = await prisma.unit.create({
    data: { name: 'Hospital Central MedCore', type: 'Hospital Geral' },
  });
  return newUnit.id;
}

// Seed automático para enriquecer a experiência se não houver pacotes cadastrados
async function ensureSeedData(unitId: string) {
  // Desativado: ambiente limpo de produção
  return;

  // 1. Criar pacotes padrão de alta qualidade no catálogo
  const pacotesCriados = await Promise.all([
    prisma.pacote.create({
      data: {
        nome: 'Depilação a Laser Soprano Titanium (10 Sessões)',
        descricao: 'Protocolo completo corpo inteiro com tecnologia de resfriamento contínuo indolor.',
        valor: 1890.0,
        qtdSessoes: 10,
        unitId,
      },
    }),
    prisma.pacote.create({
      data: {
        nome: 'Combo Harmonização Facial & Bioestimulador (3 Sessões)',
        descricao: 'Radiesse + Ácido Hialurônico e reavaliação de contorno mandibular com dermatologista.',
        valor: 3800.0,
        qtdSessoes: 3,
        unitId,
      },
    }),
    prisma.pacote.create({
      data: {
        nome: 'Plano Fisioterapia & RPG Reabilitação (12 Sessões)',
        descricao: 'Tratamento especializado individual para correção postural e alívio de dor na coluna.',
        valor: 1440.0,
        qtdSessoes: 12,
        unitId,
      },
    }),
    prisma.pacote.create({
      data: {
        nome: 'Clareamento Dental a Laser & Profilaxia (4 Sessões)',
        descricao: 'Raspagem ultrassônica, profilaxia com jato de bicarbonato e 3 sessões fotoativadas.',
        valor: 1200.0,
        qtdSessoes: 4,
        unitId,
      },
    }),
    prisma.pacote.create({
      data: {
        nome: 'Drenagem Linfática Pós-Operatória (10 Sessões)',
        descricao: 'Aceleração da recuperação com técnicas manuais e ultrassom de alta frequência.',
        valor: 1650.0,
        qtdSessoes: 10,
        unitId,
      },
    }),
    prisma.pacote.create({
      data: {
        nome: 'Limpeza de Pele Profunda & Peeling de Diamante (5 Sessões)',
        descricao: 'Higienização profunda com extração por sucção e regeneração celular com ácidos suaves.',
        valor: 950.0,
        qtdSessoes: 5,
        unitId,
      },
    }),
  ]);

  // 2. Garantir alguns pacientes para demonstração completa de vendas
  let pacientes = await prisma.paciente.findMany({ take: 5 });
  if (pacientes.length < 3) {
    const novosPacientes = await Promise.all([
      prisma.paciente.create({
        data: {
          nome: 'Mariana Siqueira Santos',
          cpf: '123.456.789-01',
          email: 'mariana.siqueira@email.com',
          telefone: '(11) 98765-4321',
          unitId,
        },
      }),
      prisma.paciente.create({
        data: {
          nome: 'Carlos Eduardo Mendes',
          cpf: '234.567.890-12',
          email: 'carlos.mendes@email.com',
          telefone: '(11) 97654-3210',
          unitId,
        },
      }),
      prisma.paciente.create({
        data: {
          nome: 'Beatriz Lima Faria',
          cpf: '345.678.901-23',
          email: 'beatriz.faria@email.com',
          telefone: '(11) 96543-2109',
          unitId,
        },
      }),
      prisma.paciente.create({
        data: {
          nome: 'Rodrigo Nogueira Ramos',
          cpf: '456.789.012-34',
          email: 'rodrigo.ramos@email.com',
          telefone: '(11) 95432-1098',
          unitId,
        },
      }),
    ]);
    pacientes = [...pacientes, ...novosPacientes];
  }

  // 3. Criar vendas de pacotes em andamento e com oportunidades de renovação
  if (pacientes.length >= 3) {
    // Mariana: 8 de 10 sessões (Alerta de renovação / Up-sell!)
    await prisma.pacotePaciente.create({
      data: {
        pacienteId: pacientes[0].id,
        pacoteId: pacotesCriados[0].id, // Laser
        sessoesTotais: 10,
        sessoesRealizadas: 8,
        status: 'ATIVO',
      },
    });

    // Carlos Eduardo: 11 de 12 sessões (Última sessão! Renovação urgente)
    await prisma.pacotePaciente.create({
      data: {
        pacienteId: pacientes[1].id,
        pacoteId: pacotesCriados[2].id, // Fisio
        sessoesTotais: 12,
        sessoesRealizadas: 11,
        status: 'ATIVO',
      },
    });

    // Beatriz: 2 de 4 sessões (Em andamento)
    await prisma.pacotePaciente.create({
      data: {
        pacienteId: pacientes[2].id,
        pacoteId: pacotesCriados[3].id, // Odonto
        sessoesTotais: 4,
        sessoesRealizadas: 2,
        status: 'ATIVO',
      },
    });

    if (pacientes[3]) {
      // Rodrigo: Concluído
      await prisma.pacotePaciente.create({
        data: {
          pacienteId: pacientes[3].id,
          pacoteId: pacotesCriados[1].id, // Harmonização
          sessoesTotais: 3,
          sessoesRealizadas: 3,
          status: 'CONCLUIDO',
        },
      });
    }
  }
}

// GET: Retorna o catálogo de pacotes, vendas com pacientes e KPIs executivos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawUnitId = searchParams.get('unitId');
    const unitId = await getTargetUnitId(rawUnitId);

    // Auto-seed para visualização imediata caso novo
    await ensureSeedData(unitId);

    // Buscar pacotes do catálogo
    const catalogo = await prisma.pacote.findMany({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { pacientes: true },
        },
      },
    });

    // Buscar vendas associadas
    const vendas = await prisma.pacotePaciente.findMany({
      where: {
        pacote: { unitId },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        paciente: {
          select: {
            id: true,
            nome: true,
            cpf: true,
            telefone: true,
            email: true,
          },
        },
        pacote: true,
      },
    });

    // Calcular estatísticas agregadas
    let totalAtivos = 0;
    let totalConcluidos = 0;
    let totalCancelados = 0;
    let receitaTotal = 0;
    let sessoesExecutadas = 0;
    let sessoesRestantes = 0;
    let alertasRenovacao = 0;

    vendas.forEach((v) => {
      receitaTotal += v.pacote.valor;
      sessoesExecutadas += v.sessoesRealizadas;
      const restantes = Math.max(0, v.sessoesTotais - v.sessoesRealizadas);
      sessoesRestantes += restantes;

      if (v.status === 'ATIVO') {
        totalAtivos += 1;
        // Alerta se faltar apenas 1 ou 2 sessões (ou >= 75% concluído)
        if (restantes <= 2 || v.sessoesRealizadas / v.sessoesTotais >= 0.75) {
          alertasRenovacao += 1;
        }
      } else if (v.status === 'CONCLUIDO') {
        totalConcluidos += 1;
      } else if (v.status === 'CANCELADO') {
        totalCancelados += 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        catalogo,
        vendas,
        stats: {
          totalVendas: vendas.length,
          totalAtivos,
          totalConcluidos,
          totalCancelados,
          receitaTotal,
          sessoesExecutadas,
          sessoesRestantes,
          alertasRenovacao,
          taxaConclusao: vendas.length > 0 ? Math.round((totalConcluidos / vendas.length) * 100) : 0,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao obter pacotes:', error);
    return NextResponse.json({ success: false, error: 'Falha ao buscar pacotes' }, { status: 500 });
  }
}

// POST: Criar um novo modelo de pacote no catálogo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao, valor, qtdSessoes, unitId: rawUnitId } = body;

    if (!nome || !qtdSessoes) {
      return NextResponse.json(
        { success: false, error: 'Nome do pacote e quantidade de sessões são obrigatórios' },
        { status: 400 }
      );
    }

    const unitId = await getTargetUnitId(rawUnitId);

    const novoPacote = await prisma.pacote.create({
      data: {
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        valor: parseFloat(valor) || 0.0,
        qtdSessoes: parseInt(qtdSessoes, 10) || 1,
        unitId,
      },
    });

    return NextResponse.json({ success: true, data: novoPacote });
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    return NextResponse.json({ success: false, error: 'Falha ao criar pacote' }, { status: 500 });
  }
}

// DELETE: Excluir pacote do catálogo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    await prisma.pacote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Pacote removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover pacote:', error);
    return NextResponse.json({ success: false, error: 'Falha ao excluir pacote' }, { status: 500 });
  }
}
