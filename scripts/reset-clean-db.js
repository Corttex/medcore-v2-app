const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetCleanDatabase() {
  console.log("==================================================");
  console.log("Iniciando limpeza e reset do banco de dados MedCore...");
  console.log("==================================================");

  // 1. Limpeza de dados transacionais e de teste
  console.log("--> Limpando dados transacionais...");
  
  try { await prisma.logDisparoMarketing.deleteMany(); } catch (e) {}
  try { await prisma.campanha.deleteMany(); } catch (e) {}
  try { await prisma.pacotePaciente.deleteMany(); } catch (e) {}
  try { await prisma.pacote.deleteMany(); } catch (e) {}
  try { await prisma.galeriaMedia.deleteMany(); } catch (e) {}
  try { await prisma.termoConsentimento.deleteMany(); } catch (e) {}
  try { await prisma.prontuario.deleteMany(); } catch (e) {}
  try { await prisma.meeting.deleteMany(); } catch (e) {}
  try { await prisma.exame.deleteMany(); } catch (e) {}
  try { await prisma.documentoMedico.deleteMany(); } catch (e) {}
  try { await prisma.kanbanCard.deleteMany(); } catch (e) {}
  try { await prisma.reminder.deleteMany(); } catch (e) {}
  try { await prisma.filaChamada.deleteMany(); } catch (e) {}
  try { await prisma.registroPonto.deleteMany(); } catch (e) {}
  try { await prisma.plantao.deleteMany(); } catch (e) {}
  try { await prisma.escala.deleteMany(); } catch (e) {}
  try { await prisma.movimentacaoEstoque.deleteMany(); } catch (e) {}
  try { await prisma.produto.deleteMany(); } catch (e) {}
  try { await prisma.ordemServico.deleteMany(); } catch (e) {}
  try { await prisma.patrimonio.deleteMany(); } catch (e) {}
  try { await prisma.repasseMedico.deleteMany(); } catch (e) {}
  try { await prisma.notaFiscal.deleteMany(); } catch (e) {}
  try { await prisma.financialAccount.deleteMany(); } catch (e) {}
  try { await prisma.auditLog.deleteMany(); } catch (e) {}
  try { await prisma.paciente.deleteMany(); } catch (e) {}
  try { await prisma.consultorio.deleteMany(); } catch (e) {}
  try { await prisma.convenioProcedimento.deleteMany(); } catch (e) {}
  try { await prisma.procedimento.deleteMany(); } catch (e) {}
  try { await prisma.convenio.deleteMany(); } catch (e) {}

  console.log("✓ Dados transacionais limpos com sucesso.");

  // 2. Criar ou Atualizar Usuário Administrador Principal
  console.log("--> Configurando Administrador Principal...");
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@medcore.com.br' },
    update: {
      password: hashedPassword,
      fullName: 'Dr. Felipe Azevedo',
      role: 'admin',
    },
    create: {
      email: 'admin@medcore.com.br',
      password: hashedPassword,
      fullName: 'Dr. Felipe Azevedo',
      role: 'admin',
    },
  });
  console.log(`✓ Administrador pronto: ${admin.email} (Senha: 123456)`);

  // 3. Criar ou Atualizar Unidade Padrão Matriz
  console.log("--> Configurando Unidade Hospitalar Principal...");
  let unit = await prisma.unit.findFirst({
    where: { name: 'Hospital Central - MEDCore' }
  });

  if (!unit) {
    unit = await prisma.unit.create({
      data: {
        name: 'Hospital Central - MEDCore',
        type: 'Hospital Geral & Clínicas Integradas',
        active: true,
        cnpj: '12.345.678/0001-90',
        responsible: 'Dr. Felipe Azevedo',
        color: 'from-blue-600 to-indigo-600',
      }
    });
  }
  console.log(`✓ Unidade configurada: ${unit.name} (ID: ${unit.id})`);

  // Vincular Admin à Unidade
  try {
    const vinculo = await prisma.userUnit.findFirst({
      where: { userId: admin.id, unitId: unit.id }
    });
    if (!vinculo) {
      await prisma.userUnit.create({
        data: {
          userId: admin.id,
          unitId: unit.id,
          role: 'ADMIN'
        }
      });
    }
  } catch (e) {}

  // 4. Configurar Módulos do Sistema Ativos
  console.log("--> Ativando Módulos do Sistema...");
  const modulos = [
    { id: 'IA_Amelia', name: 'Dra. Conte IA Copilot' },
    { id: 'Agendamento', name: 'Agenda & Consultas' },
    { id: 'TISS', name: 'Faturamento TISS' },
    { id: 'WhatsApp', name: 'WhatsApp API & Omnichannel' },
    { id: 'Marketing', name: 'Marketing & CRM Engine' },
    { id: 'NPS', name: 'Pesquisa de Satisfação NPS' },
    { id: 'Pacotes', name: 'Pacotes de Vendas & Tratamentos' },
    { id: 'Financeiro', name: 'Gestão Financeira & DRE' },
    { id: 'Prontuario', name: 'Prontuário Eletrônico PEP' },
    { id: 'Estoque', name: 'Estoque & Insumos' },
    { id: 'RH', name: 'Escalas & Ponto Eletrônico' },
  ];

  for (const mod of modulos) {
    await prisma.systemModule.upsert({
      where: { id: mod.id },
      update: { isEnabled: true, isInMaintenance: false },
      create: {
        id: mod.id,
        name: mod.name,
        isEnabled: true,
        isInMaintenance: false,
      }
    });
  }
  console.log(`✓ ${modulos.length} módulos habilitados.`);

  // 5. Configurar as 5 Automações Padrão de Marketing (sem disparos falsos)
  console.log("--> Configurando regras de automação de CRM...");
  const automacoesPadrao = [
    {
      nome: "NPS e Avaliação Pós-Consulta",
      gatilho: "NPS_POS_CONSULTA",
      ativo: true,
      canal: "WHATSAPP",
      diasAtraso: 1,
      conteudoMensagem: "Olá {{nome}}! Como foi sua experiência na consulta de ontem com Dr(a). {{nome_medico}}? De 0 a 10, que nota você daria para o nosso atendimento?",
    },
    {
      nome: "Mensagem e Mimo de Aniversário",
      gatilho: "ANIVERSARIO",
      ativo: true,
      canal: "WHATSAPP",
      diasAtraso: 0,
      conteudoMensagem: "Parabéns, {{nome}}! 🎉 A equipe MEDCore deseja um feliz aniversário! Como nosso presente, preparamos um voucher de R$ 100 de desconto no seu próximo procedimento. Aproveite!",
    },
    {
      nome: "Lembrete de Check-up & Retorno (180 dias)",
      gatilho: "CHECKUP_RETORNO",
      ativo: true,
      canal: "EMAIL",
      diasAtraso: 180,
      assunto: "Cuide da sua saúde: Hora de renovar seu check-up no MEDCore",
      conteudoMensagem: "Olá {{nome}}, saúde e prevenção andam juntas! Já faz 6 meses desde o seu último atendimento. Que tal agendar sua consulta preventiva? Acesse: {{link_agendamento}}",
    },
    {
      nome: "CRM Up-Sell: Renovação de Pacote Tratamento",
      gatilho: "UPSELL_PACOTE",
      ativo: true,
      canal: "WHATSAPP",
      diasAtraso: 0,
      conteudoMensagem: "Olá {{nome}}! Faltam poucas sessões para você concluir seu pacote de {{nome_pacote}}. Para garantir a manutenção dos resultados sem interrupção, temos uma condição especial de renovação!",
    },
    {
      nome: "Recuperação de Consulta Cancelada ou No-Show",
      gatilho: "RECUPERACAO_FALTA",
      ativo: true,
      canal: "WHATSAPP",
      diasAtraso: 2,
      conteudoMensagem: "Olá {{nome}}, vimos que você não conseguiu comparecer à sua consulta. Sabemos que imprevistos acontecem! Quer reagendar para esta semana sem nenhum custo? {{link_agendamento}}",
    }
  ];

  for (const auto of automacoesPadrao) {
    const existing = await prisma.automacaoMarketing.findFirst({
      where: { gatilho: auto.gatilho, unitId: unit.id }
    });
    if (!existing) {
      await prisma.automacaoMarketing.create({
        data: {
          ...auto,
          unitId: unit.id
        }
      });
    }
  }
  console.log("✓ Regras de automação de CRM configuradas.");

  console.log("==================================================");
  console.log("Banco de dados MedCore zerado e pronto para Produção!");
  console.log("==================================================");
}

resetCleanDatabase()
  .catch((err) => {
    console.error("Erro ao resetar banco:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
