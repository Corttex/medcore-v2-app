import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados de exemplo para inicializar a fila do dia caso esteja vazia
const SEED_FILA = [
  {
    senha: "P-001",
    pacienteNome: "Dra. Juliana Brandão Silveira",
    guiche: "Balcão 1",
    etapa: "RECEPCAO",
    tipo: "PREFERENCIAL",
    prioridade: 1,
    status: "AGUARDANDO",
    medicoNome: "Dr. Roberto Guimarães (Dermatologia)"
  },
  {
    senha: "N-002",
    pacienteNome: "Carlos Eduardo Nogueira",
    guiche: "Balcão 2",
    etapa: "RECEPCAO",
    tipo: "NORMAL",
    prioridade: 0,
    status: "AGUARDANDO",
    medicoNome: "Dra. Camilla Rossi (Estética Facial)"
  },
  {
    senha: "E-003",
    pacienteNome: "Beatriz Lins Fagundes",
    guiche: "Triagem 1",
    etapa: "TRIAGEM",
    tipo: "EXAMES",
    prioridade: 0,
    status: "AGUARDANDO",
    medicoNome: "Dr. Marcelo Paiva (Clínica Geral)"
  },
  {
    senha: "N-004",
    pacienteNome: "Fernando Henrique Basto",
    guiche: "Triagem 1",
    etapa: "TRIAGEM",
    tipo: "NORMAL",
    prioridade: 0,
    status: "AGUARDANDO",
    medicoNome: "Dra. Patrícia Mendes (Ginecologia)"
  },
  {
    senha: "P-005",
    pacienteNome: "Mariana Alencar Castro",
    guiche: "Consultório 1",
    etapa: "CONSULTORIO",
    tipo: "PREFERENCIAL",
    prioridade: 1,
    status: "AGUARDANDO",
    medicoNome: "Dr. Roberto Guimarães (Dermatologia)"
  },
  {
    senha: "N-006",
    pacienteNome: "Rodrigo Mendonça Prado",
    guiche: "Consultório 2",
    etapa: "CONSULTORIO",
    tipo: "NORMAL",
    prioridade: 0,
    status: "AGUARDANDO",
    medicoNome: "Dra. Camilla Rossi (Estética Facial)"
  },
  {
    senha: "N-007",
    pacienteNome: "Lucas Gusmão Tavares",
    guiche: "Balcão 1",
    etapa: "FINALIZADO",
    tipo: "NORMAL",
    prioridade: 0,
    status: "FINALIZADO",
    medicoNome: "Dr. Marcelo Paiva (Clínica Geral)"
  }
];

// Helper para obter a primeira unidade do sistema
async function getOrCreateUnitId() {
  const unit = await prisma.unit.findFirst();
  if (unit) return unit.id;

  const newUnit = await prisma.unit.create({
    data: {
      name: "Unidade Central MEDCore",
      type: "CLINICA"
    }
  });
  return newUnit.id;
}

export async function GET() {
  try {
    let chamadas = await prisma.filaChamada.findMany({
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    // Se estiver vazia, popula com o seed inicial para a clínica já poder testar
    if (chamadas.length === 0) {
      const unitId = await getOrCreateUnitId();
      for (const item of SEED_FILA) {
        await prisma.filaChamada.create({
          data: {
            ...item,
            unitId
          }
        });
      }
      chamadas = await prisma.filaChamada.findMany({
        orderBy: [
          { prioridade: 'desc' },
          { createdAt: 'asc' }
        ]
      });
    }

    // Última chamada ativa no painel da TV
    const ultimaChamada = await prisma.filaChamada.findFirst({
      where: {
        status: "CHAMANDO"
      },
      orderBy: {
        updatedAt: 'desc'
      }
    }) || chamadas[0] || null;

    // Histórico das últimas chamadas
    const ultimasChamadas = await prisma.filaChamada.findMany({
      where: {
        chamadoEm: { not: null }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      success: true,
      chamadas,
      ultimaChamada,
      ultimasChamadas
    });
  } catch (error: any) {
    console.error("Erro ao buscar fila do Painel TV:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, senha, pacienteNome, guiche, etapa, tipo, prioridade, medicoNome } = body;
    const unitId = await getOrCreateUnitId();

    // 1. EMITIR NOVA SENHA / ADICIONAR PACIENTE
    if (action === "EMITIR_SENHA") {
      let novaSenha = senha;
      if (!novaSenha) {
        // Gerar número sequencial baseado no tipo
        const prefixo = tipo === "PREFERENCIAL" ? "P" : tipo === "EXAMES" ? "E" : "N";
        const countHoje = await prisma.filaChamada.count();
        novaSenha = `${prefixo}-${String(countHoje + 1).padStart(3, '0')}`;
      }

      const novo = await prisma.filaChamada.create({
        data: {
          senha: novaSenha,
          pacienteNome: pacienteNome || "Paciente Avulso",
          guiche: guiche || "Balcão",
          etapa: etapa || "RECEPCAO",
          tipo: tipo || "NORMAL",
          prioridade: prioridade ?? (tipo === "PREFERENCIAL" ? 1 : 0),
          status: "AGUARDANDO",
          medicoNome: medicoNome || null,
          unitId
        }
      });

      return NextResponse.json({ success: true, chamada: novo });
    }

    // 2. CHAMAR PACIENTE PARA O GUICHÊ / CONSULTÓRIO
    if (action === "CHAMAR") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID da chamada é obrigatório" }, { status: 400 });
      }

      const itemAtual = await prisma.filaChamada.findUnique({ where: { id } });
      if (!itemAtual) {
        return NextResponse.json({ success: false, error: "Chamada não encontrada" }, { status: 404 });
      }

      const chamadaAtualizada = await prisma.filaChamada.update({
        where: { id },
        data: {
          status: "CHAMANDO",
          guiche: guiche || itemAtual.guiche || "Atendimento",
          chamadoEm: new Date(),
          chamadasCount: (itemAtual.chamadasCount || 0) + 1,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, chamada: chamadaAtualizada });
    }

    // 3. AVANÇAR ETAPA DO FLUXO (Ex: Recepção -> Triagem -> Consultório -> Finalizado)
    if (action === "AVANCAR_ETAPA") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID da chamada é obrigatório" }, { status: 400 });
      }

      const proximaEtapaMap: Record<string, string> = {
        "RECEPCAO": "TRIAGEM",
        "TRIAGEM": "CONSULTORIO",
        "CONSULTORIO": "FINALIZADO"
      };

      const itemAtual = await prisma.filaChamada.findUnique({ where: { id } });
      if (!itemAtual) {
        return NextResponse.json({ success: false, error: "Item não encontrado" }, { status: 404 });
      }

      const novaEtapa = etapa || proximaEtapaMap[itemAtual.etapa] || "FINALIZADO";
      const novoStatus = novaEtapa === "FINALIZADO" ? "FINALIZADO" : "AGUARDANDO";

      const atualizado = await prisma.filaChamada.update({
        where: { id },
        data: {
          etapa: novaEtapa,
          status: novoStatus,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, chamada: atualizado });
    }

    // 4. MARCAR COMO AUSENTE
    if (action === "MARCAR_AUSENTE") {
      if (!id) {
        return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
      }

      const atualizado = await prisma.filaChamada.update({
        where: { id },
        data: {
          status: "AUSENTE",
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, chamada: atualizado });
    }

    // 5. REINICIAR / LIMPAR FILA DO DIA
    if (action === "LIMPAR_FILA") {
      await prisma.filaChamada.deleteMany({});
      return NextResponse.json({ success: true, message: "Fila reiniciada com sucesso" });
    }

    return NextResponse.json({ success: false, error: "Ação desconhecida" }, { status: 400 });
  } catch (error: any) {
    console.error("Erro na API do Painel TV:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
