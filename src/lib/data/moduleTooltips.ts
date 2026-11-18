export type TooltipRoleProfile = "RECEPCIONISTA" | "MEDICO" | "ADMIN";

export interface ModuleTooltipConfig {
  href: string;
  title: string;
  /** Nível 1 — Descrição resumida (máximo 80 caracteres) */
  quickDesc: string;
  /** Nível 2 — Explicação funcional do módulo */
  fullDesc: string;
  /** Nível 2 — Lista de recursos principais */
  features: string[];
  /** Nível 3 — Prompts pré-configurados da Dra. Conte */
  aiPrompts: string[];
  /** Nível 4 — Dica contextual adaptada ao perfil ativo */
  roleTips: {
    RECEPCIONISTA: string;
    MEDICO: string;
    ADMIN: string;
  };
  /** Nome comercial do plano para gatilhos de upsell */
  commercialPlanLabel: "Plano Starter" | "Plano Growth" | "Plano Business" | "Plano Enterprise";
  /** Descrição resumida de valor comercial caso o módulo esteja bloqueado */
  upsellHook?: string;
}

export function resolveTooltipRole(role?: string | null): TooltipRoleProfile {
  const r = (role || "").toUpperCase();
  if (
    r.includes("RECEPCAO") ||
    r.includes("SECRETARIA") ||
    r.includes("OPERADOR") ||
    r.includes("CONCIERGE")
  ) {
    return "RECEPCIONISTA";
  }
  if (
    r.includes("MEDICO") ||
    r.includes("ODONTO") ||
    r.includes("ENFERM") ||
    r.includes("FISIOT") ||
    r.includes("VETERIN") ||
    r.includes("FARMAC")
  ) {
    return "MEDICO";
  }
  return "ADMIN";
}

export function getRoleProfileLabel(profile: TooltipRoleProfile): string {
  switch (profile) {
    case "RECEPCIONISTA":
      return "Recepção & Atendimento";
    case "MEDICO":
      return "Corpo Clínico";
    case "ADMIN":
    default:
      return "Gestão & Diretoria";
  }
}

export const MODULE_TOOLTIPS: Record<string, ModuleTooltipConfig> = {
  "/dashboard": {
    href: "/dashboard",
    title: "Visão Executiva",
    quickDesc: "Indicadores operacionais e alertas em tempo real.",
    fullDesc: "Central executiva com KPIs de ocupação, produtividade médica, alertas críticos e previsões da Dra. Conte.",
    features: ["KPIs em Tempo Real", "Previsão de Demanda IA", "Auditoria LGPD", "Comparativo por Unidade"],
    aiPrompts: [
      "Mostre o resumo executivo da clínica hoje",
      "Quais são os gargalos de atendimento desta semana?",
      "Liste oportunidades de receita recuperáveis pela IA",
    ],
    roleTips: {
      RECEPCIONISTA: "Acompanhe a fila do dia, confirmações pendentes e alertas da recepção.",
      MEDICO: "Visualize seus próximos atendimentos, eficiência clínica e pendências de prontuário.",
      ADMIN: "Monitore margem operacional, ocupação, faturamento e previsões estratégicas da IA.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/ia-executiva": {
    href: "/dashboard/ia-executiva",
    title: "Central Dra. Conte",
    quickDesc: "Sistema Operacional Conversacional do MedCore.",
    fullDesc: "Converse com a Dra. Conte para executar tarefas em todo o ERP sem navegar por dezenas de telas.",
    features: ["Comandos por Voz e Texto", "Execução Multi-módulo", "Análise Preditiva", "Auditoria Assistida"],
    aiPrompts: [
      "Dra. Conte, agende retorno para João em 15 dias.",
      "Encontre pacientes sem retorno há mais de 90 dias",
      "Mostre contas vencidas e convênios com pendência",
    ],
    roleTips: {
      RECEPCIONISTA: "Peça para cadastrar pacientes, agendar retornos e confirmar horários via WhatsApp.",
      MEDICO: "Solicite resumos clínicos, protocolos, códigos CID-10 e análise de histórico.",
      ADMIN: "Execute auditorias financeiras, relatórios de retenção e diagnósticos da operação.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/loja": {
    href: "/dashboard/loja",
    title: "Habilidades Dra. Conte & Planos",
    quickDesc: "Ative habilidades de IA, automações e upgrades de plano.",
    fullDesc: "Marketplace interno de inteligência clínica, automação WhatsApp 24/7, fiscal automático e planos MedCore.",
    features: ["AI Scribe Clínico", "WhatsApp 24/7", "Emissor Fiscal DMED", "Upgrades Growth/Business/Enterprise"],
    aiPrompts: [
      "Qual habilidade da Dra. Conte gera maior ROI para minha clínica?",
      "Calcule o retorno do resgate automático de faltas",
      "Compare os planos Growth, Business e Enterprise",
    ],
    roleTips: {
      RECEPCIONISTA: "Conheça automações que reduzem trabalho manual de confirmação e cobrança.",
      MEDICO: "Ative o Assistente Clínico e AI Scribe SOAP para economizar até 2h/dia de digitação.",
      ADMIN: "Avalie ROI em tempo real e faça upgrade de plano conforme o crescimento da rede.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/pacientes": {
    href: "/dashboard/pacientes",
    title: "Pacientes",
    quickDesc: "Gestão de pacientes e prontuários.",
    fullDesc: "Cadastre, gerencie e acompanhe pacientes da instituição com contexto clínico e operacional da Dra. Conte.",
    features: ["Cadastro", "Prontuário", "Convênios", "Histórico Clínico"],
    aiPrompts: [
      "Encontre pacientes sem retorno há mais de 90 dias",
      "Mostre pacientes com consulta marcada para hoje",
      "Cadastre um novo paciente",
    ],
    roleTips: {
      RECEPCIONISTA: "Utilize para cadastrar e localizar pacientes.",
      MEDICO: "Consulte prontuários e histórico clínico.",
      ADMIN: "Analise recorrência, retorno e retenção de pacientes.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/agenda": {
    href: "/dashboard/agenda",
    title: "Agenda",
    quickDesc: "Agendamento de consultas, retornos e encaixes.",
    fullDesc: "Controle completo de horários por profissional, sala e especialidade com confirmações inteligentes.",
    features: ["Grade Multi-profissional", "Confirmação Automática", "Lista de Espera", "Retornos"],
    aiPrompts: [
      "Agende uma consulta para amanhã",
      "Mostre horários vagos hoje",
      "Liste encaixes disponíveis",
    ],
    roleTips: {
      RECEPCIONISTA: "Organize encaixes, confirme consultas pendentes e reduza faltas no dia.",
      MEDICO: "Acompanhe sua fila de atendimento e tempo médio por consulta.",
      ADMIN: "Analise taxa de ocupação por sala, especialidade e índices de no-show.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/agendamento-online": {
    href: "/dashboard/agendamento-online",
    title: "Agendamento Online",
    quickDesc: "Portal 24h de autoagendamento para pacientes.",
    fullDesc: "Disponibilize links personalizados de agendamento direto para pacientes sem sobrecarga da recepção.",
    features: ["Link Direto 24/7", "Sincronia com Agenda", "Pré-cadastro", "Confirmação via WhatsApp"],
    aiPrompts: [
      "Gere um link de agendamento online para Cardiologia",
      "Quantos pacientes agendaram online nesta semana?",
      "Envie o link de marcação para pacientes sem retorno",
    ],
    roleTips: {
      RECEPCIONISTA: "Compartilhe o link para acelerar remarcações e evitar filas no telefone.",
      MEDICO: "Configure suas janelas liberadas para captação direta de pacientes.",
      ADMIN: "Meça conversão digital e reduza custos operacionais de call center.",
    },
    commercialPlanLabel: "Plano Growth",
    upsellHook: "Capture pacientes 24/7 direto na agenda sem depender de atendimento humano.",
  },
  "/dashboard/telemedicina": {
    href: "/dashboard/telemedicina",
    title: "Consulta Inteligente (IA)",
    quickDesc: "Videochamada com escuta clínica e Dra. Conte ao vivo.",
    fullDesc: "Realize consultas online com escuta ativa, hipóteses diagnósticas, evolução SOAP e laudos automáticos.",
    features: ["Videochamada E2EE", "Assistente Clínico Ativo", "Sugestão de CID-10", "Prontuário & Laudo IA"],
    aiPrompts: [
      "Você pode iniciar uma consulta apenas dizendo: Iniciar teleconsulta com João Silva.",
      "Mostre pacientes na sala de espera virtual",
      "Gere o resumo SOAP da última teleconsulta",
    ],
    roleTips: {
      RECEPCIONISTA: "Envie o link seguro da sala por WhatsApp e monitore a sala de espera virtual.",
      MEDICO: "Atenda por vídeo enquanto a Dra. Conte escuta, sugere CID e prepara o prontuário.",
      ADMIN: "Amplie o alcance geográfico da clínica e monitore produtividade das teleconsultas.",
    },
    commercialPlanLabel: "Plano Growth",
    upsellHook: "Transforme teleconsultas em atendimentos premium com copilota clínica em tempo real.",
  },
  "/dashboard/marketing": {
    href: "/dashboard/marketing",
    title: "Radar Comercial",
    quickDesc: "Campanhas, resgate de pacientes e funil de retorno.",
    fullDesc: "Identifique oportunidades comerciais ocultas na base e dispare campanhas preventivas no WhatsApp.",
    features: ["Radar de Oportunidades", "Resgate de Inativos", "Réguas Preventivas", "Copywriter Dra. Conte"],
    aiPrompts: [
      "Mostre as 3 melhores oportunidades comerciais da base hoje",
      "Crie uma campanha preventiva para pacientes sem retorno há 6 meses",
      "Resgate pacientes que faltaram na última semana",
    ],
    roleTips: {
      RECEPCIONISTA: "Dispare mensagens personalizadas de retorno preventivo para pacientes elegíveis.",
      MEDICO: "Acompanhe adesão aos protocolos preventivos e retornos clínicos.",
      ADMIN: "Aumente LTV e faturamento recorrente sem aumentar custo de aquisição (CAC).",
    },
    commercialPlanLabel: "Plano Growth",
    upsellHook: "Recupere pacientes inativos e gere receita previsível com campanhas da Dra. Conte.",
  },
  "/dashboard/pacotes": {
    href: "/dashboard/pacotes",
    title: "Pacotes & Vendas",
    quickDesc: "Gestão de pacotes de tratamento e sessões.",
    fullDesc: "Crie planos de sessões, controle saldo de procedimentos realizados e monitore renovações.",
    features: ["Combo de Sessões", "Controle de Saldo", "Alerta de Renovação", "Comissionamento"],
    aiPrompts: [
      "Liste pacientes com pacote perto de encerrar",
      "Quais pacotes tiveram maior margem este mês?",
      "Sugira renovação para pacientes na última sessão",
    ],
    roleTips: {
      RECEPCIONISTA: "Consulte o saldo de sessões antes de confirmar o próximo atendimento.",
      MEDICO: "Acompanhe a evolução do protocolo contratado ao longo das sessões.",
      ADMIN: "Monitore receita antecipada, ticket médio e taxa de renovação de pacotes.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/mensagens": {
    href: "/dashboard/mensagens",
    title: "Inbox WhatsApp",
    quickDesc: "Central omnichannel de conversas com pacientes.",
    fullDesc: "Atenda mensagens de WhatsApp integradas ao contexto clínico e financeiro de cada paciente.",
    features: ["Atendimento Centralizado", "Respostas Sugeridas IA", "Histórico por Paciente", "Disparo de Links"],
    aiPrompts: [
      "Mostre conversas aguardando resposta urgente",
      "Responda confirmações pendentes de amanhã",
      "Resuma as solicitações recebidas no WhatsApp hoje",
    ],
    roleTips: {
      RECEPCIONISTA: "Responda dúvidas e confirme consultas com apoio automático da Dra. Conte.",
      MEDICO: "Verifique intercorrências relatadas no pós-atendimento.",
      ADMIN: "Acompanhe SLA de resposta e conversão de agendamentos via chat.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/nps": {
    href: "/dashboard/nps",
    title: "Pesquisa NPS",
    quickDesc: "Avaliação de satisfação e experiência do paciente.",
    fullDesc: "Colete notas pós-consulta automaticamente e identifique detratores antes que virem churn.",
    features: ["Envio Pós-Consulta", "Score NPS em Tempo Real", "Alertas de Detratores", "Análise por Profissional"],
    aiPrompts: [
      "Qual o NPS da clínica nos últimos 30 dias?",
      "Liste pacientes detratores que precisam de contato",
      "Resuma os principais elogios e críticas recentes",
    ],
    roleTips: {
      RECEPCIONISTA: "Acompanhe feedbacks de atendimento da recepção e tempo de espera.",
      MEDICO: "Monitore a percepção de acolhimento e clareza dos seus atendimentos.",
      ADMIN: "Use o NPS para proteger reputação, retenção e indicações orgânicas.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/laudos": {
    href: "/dashboard/laudos",
    title: "Worklist de Laudos",
    quickDesc: "Produção e assinatura de laudos diagnósticos.",
    fullDesc: "Gerencie fila de exames pendentes com apoio da Dra. Conte na estruturação e revisão técnica.",
    features: ["Worklist Priorizada", "Modelos Inteligentes", "Assinatura Digital", "Entrega ao Paciente"],
    aiPrompts: [
      "Liste laudos pendentes com maior tempo de espera",
      "Ajude a estruturar um laudo diagnóstico padrão",
      "Envie laudos concluídos para os pacientes",
    ],
    roleTips: {
      RECEPCIONISTA: "Verifique laudos liberados para entregar ou enviar aos pacientes.",
      MEDICO: "Laude com agilidade usando templates e sugestões contextuais da IA.",
      ADMIN: "Monitore SLA de liberação de laudos e produtividade diagnóstica.",
    },
    commercialPlanLabel: "Plano Starter",
  },
  "/dashboard/contas": {
    href: "/dashboard/contas",
    title: "Financeiro & Caixa",
    quickDesc: "Fluxo de caixa, recebimentos e contas da clínica.",
    fullDesc: "Visão consolidada do financeiro com alertas de inadimplência, contas vencidas e previsão de caixa.",
    features: ["Fluxo de Caixa", "Contas a Pagar/Receber", "Conciliação", "Alertas de Vencimento"],
    aiPrompts: [
      "Mostre contas vencidas",
      "Liste convênios inadimplentes",
      "Exiba faturamento deste mês",
    ],
    roleTips: {
      RECEPCIONISTA: "Registre recebimentos de balcão e confira pendências no check-in.",
      MEDICO: "Consulte valores de procedimentos e produção financeira.",
      ADMIN: "Controle margem líquida, previsibilidade de caixa e inadimplência.",
    },
    commercialPlanLabel: "Plano Business",
    upsellHook: "Elimine planilhas e tenha controle financeiro automatizado com alertas da Dra. Conte.",
  },
  "/dashboard/contas-a-receber": {
    href: "/dashboard/contas-a-receber",
    title: "Contas a Receber",
    quickDesc: "Cobranças, recebimentos particulares e convênios.",
    fullDesc: "Controle títulos a receber, parcelas em atraso e cobrança amigável automatizada.",
    features: ["Régua de Cobrança", "Baixa Rápida", "Previsão de Recebíveis", "Pix & Cartão"],
    aiPrompts: [
      "Mostre contas vencidas",
      "Liste convênios inadimplentes",
      "Exiba faturamento deste mês",
    ],
    roleTips: {
      RECEPCIONISTA: "Confira pagamentos pendentes antes ou após o atendimento.",
      MEDICO: "Acompanhe liquidação de procedimentos realizados.",
      ADMIN: "Reduza inadimplência e antecipe riscos no fluxo de recebíveis.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/contas-a-pagar": {
    href: "/dashboard/contas-a-pagar",
    title: "Contas a Pagar",
    quickDesc: "Despesas fixas, fornecedores e vencimentos.",
    fullDesc: "Gerencie obrigações financeiras, centros de custo e aprovações de pagamento.",
    features: ["Agenda de Pagamentos", "Centros de Custo", "Alertas de Vencimento", "Rateio por Unidade"],
    aiPrompts: [
      "Mostre contas a pagar vencendo nesta semana",
      "Qual centro de custo teve maior gasto este mês?",
      "Exiba o saldo projetado após pagamentos",
    ],
    roleTips: {
      RECEPCIONISTA: "Lance pequenas despesas operacionais com comprovante.",
      MEDICO: "Visualização restrita à administração financeira.",
      ADMIN: "Otimize custos fixos e evite juros por atraso de pagamento.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/tiss": {
    href: "/dashboard/tiss",
    title: "Faturamento TISS",
    quickDesc: "Guias TISS, lotes XML e auditoria de glosas.",
    fullDesc: "Emita lotes TISS no padrão ANS, realize auditoria prévia com IA e conteste glosas automaticamente.",
    features: ["XML Padrão ANS", "Auditoria Prévia IA", "Recurso de Glosas", "Autorizações"],
    aiPrompts: [
      "Audite o lote TISS antes do envio para evitar glosas",
      "Liste convênios inadimplentes",
      "Quais guias têm maior risco de glosa neste mês?",
    ],
    roleTips: {
      RECEPCIONISTA: "Valide carteirinha, elegibilidade e autorização prévia do convênio.",
      MEDICO: "Garanta códigos TUSS e justificativas clínicas completas.",
      ADMIN: "Recupere receitas perdidas em glosas e acelere o ciclo de recebimento.",
    },
    commercialPlanLabel: "Plano Business",
    upsellHook: "Reduza glosas em até 70% com auditoria prévia inteligente antes de enviar o XML.",
  },
  "/dashboard/repasses": {
    href: "/dashboard/repasses",
    title: "Repasses Médicos",
    quickDesc: "Cálculo automático de honorários e produção médica.",
    fullDesc: "Calcule repasses por procedimento, convênio ou percentual com transparência total para o corpo clínico.",
    features: ["Regras por Profissional", "Extrato Transparente", "Fechamento em 1 Clique", "Auditoria de Produção"],
    aiPrompts: [
      "Calcule os repasses médicos pendentes deste mês",
      "Mostre o extrato de produção por profissional",
      "Exiba repasses aguardando aprovação",
    ],
    roleTips: {
      RECEPCIONISTA: "Garanta o vínculo correto do profissional executor na agenda.",
      MEDICO: "Acompanhe seus atendimentos e valores previstos de repasse.",
      ADMIN: "Feche repasses em minutos sem erros manuais de planilha.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/notas-fiscais": {
    href: "/dashboard/notas-fiscais",
    title: "Emitir NF & Fiscal",
    quickDesc: "Emissão automatizada de NFS-e e relatório DMED.",
    fullDesc: "Emita notas fiscais médicas com cálculo automático de retenções e envio direto ao paciente.",
    features: ["NFS-e Automática", "DMED Pronto", "Envio PDF/XML", "Retenções Calculadas"],
    aiPrompts: [
      "Liste pagamentos aguardando emissão de Nota Fiscal",
      "Exiba o total de notas emitidas neste mês",
      "Prepare o resumo DMED da clínica",
    ],
    roleTips: {
      RECEPCIONISTA: "Emita e envie a nota fiscal ao paciente logo após o pagamento.",
      MEDICO: "Consulte notas emitidas vinculadas aos seus atendimentos.",
      ADMIN: "Mantenha conformidade tributária e evite retrabalho contábil.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/estoque": {
    href: "/dashboard/estoque",
    title: "Gestão de Estoque",
    quickDesc: "Controle de insumos, lotes, validade e estoque mínimo.",
    fullDesc: "Monitore consumo por procedimento, evite rupturas de materiais e controle vencimentos em tempo real.",
    features: ["Controle de Lotes & Validade", "Baixa Automática", "Alertas de Estoque Mínimo", "Leitor de NF-e"],
    aiPrompts: [
      "Quais insumos estão abaixo do estoque mínimo?",
      "Liste itens com validade próxima nos próximos 30 dias",
      "Mostre o consumo de estoque desta semana",
    ],
    roleTips: {
      RECEPCIONISTA: "Verifique disponibilidade de kits básicos de atendimento.",
      MEDICO: "Confira disponibilidade de insumos e medicamentos críticos antes do procedimento.",
      ADMIN: "Elimine desperdícios por vencimento e reduza custos de suprimentos.",
    },
    commercialPlanLabel: "Plano Business",
    upsellHook: "Controle insumos, validades e consumo por procedimento sem perdas financeiras.",
  },
  "/dashboard/vacinas": {
    href: "/dashboard/vacinas",
    title: "Injetáveis & Insumos Críticos",
    quickDesc: "Rastreabilidade de ampolas, doses e cadeia fria.",
    fullDesc: "Gestão rigorosa de medicamentos especiais, toxinas, vacinas e insumos de alto custo por lote e paciente.",
    features: ["Rastreabilidade por Dose", "Controle de Lote ANVISA", "Alerta de Reposição", "Vínculo ao Prontuário"],
    aiPrompts: [
      "Mostre lotes críticos com estoque baixo",
      "Rastreie doses aplicadas nesta semana",
      "Gere pedido de reposição para injetáveis",
    ],
    roleTips: {
      RECEPCIONISTA: "Confirme reserva de doses para pacientes agendados.",
      MEDICO: "Vincule lote e validade diretamente à evolução do paciente.",
      ADMIN: "Garanta rastreabilidade sanitária total e controle de alto custo.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/escalas": {
    href: "/dashboard/escalas",
    title: "RH Inteligente (Escalas)",
    quickDesc: "Escalas médicas, plantões e cobertura assistencial.",
    fullDesc: "Organize escalas de equipe e plantonistas com detecção de conflitos e publicação instantânea.",
    features: ["Escala Mensal Inteligente", "Trocas de Plantão", "Prevenção de Buracos", "Link Público de Escala"],
    aiPrompts: [
      "Mostre horários sem médico escalado nesta semana",
      "Sugira realocação de escala para o pico de amanhã",
      "Liste plantonistas confirmados para o fim de semana",
    ],
    roleTips: {
      RECEPCIONISTA: "Consulte rapidamente qual profissional está em atendimento ou plantão hoje.",
      MEDICO: "Confira seus horários de plantão e solicite substituições.",
      ADMIN: "Garanta cobertura assistencial contínua e equilíbrio de carga horária.",
    },
    commercialPlanLabel: "Plano Enterprise",
    upsellHook: "Escale multi-unidades com gestão inteligente de escalas, ponto facial e folha.",
  },
  "/dashboard/ponto": {
    href: "/dashboard/ponto",
    title: "RH Inteligente (Ponto)",
    quickDesc: "Registro de ponto homologado (Portaria 671) e banco de horas.",
    fullDesc: "Controle de jornada com reconhecimento facial anti-fraude, banco de horas e integração direta à folha.",
    features: ["Portaria MTP 671", "Reconhecimento Facial", "Banco de Horas", "Auditoria Trabalhista"],
    aiPrompts: [
      "Mostre colaboradores com atraso ou ponto pendente hoje",
      "Calcule saldo de banco de horas da equipe",
      "Gere resumo de frequência do mês",
    ],
    roleTips: {
      RECEPCIONISTA: "Registre seu ponto diário e acompanhe seus horários.",
      MEDICO: "Acompanhe registros de entrada e saída nos turnos clínicos.",
      ADMIN: "Elimine passivos trabalhistas e automatize o fechamento de jornada.",
    },
    commercialPlanLabel: "Plano Enterprise",
    upsellHook: "Proteção trabalhista Portaria 671 integrada diretamente ao fechamento de folha.",
  },
  "/dashboard/folha": {
    href: "/dashboard/folha",
    title: "RH Inteligente (Folha & CNAB)",
    quickDesc: "Cálculo de folha, encargos e remessa bancária CNAB240.",
    fullDesc: "Processe salários, benefícios, retenções e gere arquivos CNAB240 com criptografia de dados sensíveis.",
    features: ["Cálculo Automatizado", "Arquivo CNAB240", "Benefícios", "Criptografia LGPD"],
    aiPrompts: [
      "Resuma o custo total da folha prevista para este mês",
      "Verifique pendências antes de gerar o CNAB240",
      "Compare custo de pessoal vs. faturamento mensal",
    ],
    roleTips: {
      RECEPCIONISTA: "Acesso exclusivo ao Departamento Pessoal e Diretoria.",
      MEDICO: "Acesso exclusivo ao Departamento Pessoal e Diretoria.",
      ADMIN: "Feche a folha com segurança bancária e auditoria completa.",
    },
    commercialPlanLabel: "Plano Enterprise",
    upsellHook: "Automatize a folha de pagamento e gere remessas bancárias CNAB240 em minutos.",
  },
  "/dashboard/relatorios": {
    href: "/dashboard/relatorios",
    title: "BI & Indicadores",
    quickDesc: "Relatórios gerenciais, retenção e performance da rede.",
    fullDesc: "Dashboards analíticos de produtividade, retorno de pacientes, rentabilidade por convênio e eficiência.",
    features: ["BI Multi-unidades", "Retenção & Churn", "Ranking de Procedimentos", "Exportação Executiva"],
    aiPrompts: [
      "Quais são os 10 pacientes mais frequentes da clínica?",
      "Mostre a taxa de retorno e abandono dos últimos 90 dias",
      "Compare a rentabilidade por convênio",
    ],
    roleTips: {
      RECEPCIONISTA: "Consulte volumes diários de atendimento e faltas.",
      MEDICO: "Analise volume de procedimentos e aderência dos pacientes.",
      ADMIN: "Tome decisões estratégicas baseadas em retenção, margem e recorrência.",
    },
    commercialPlanLabel: "Plano Business",
  },
  "/dashboard/hospitais": {
    href: "/dashboard/hospitais",
    title: "Clínicas & Unidades",
    quickDesc: "Gestão multi-unidades, salas e parâmetros fiscais.",
    fullDesc: "Centralize múltiplas clínicas ou hospitais em um único painel com consolidação gerencial.",
    features: ["Multi-Unidades", "Gestão de Salas", "Parâmetros Fiscais", "Visão Consolidada"],
    aiPrompts: [
      "Compare a ocupação entre nossas unidades",
      "Mostre o faturamento consolidado por clínica",
      "Quais unidades têm horários ociosos hoje?",
    ],
    roleTips: {
      RECEPCIONISTA: "Alterne facilmente a unidade de atendimento ativa.",
      MEDICO: "Visualize em qual unidade e sala estão seus atendimentos.",
      ADMIN: "Escale sua rede de clínicas com governança unificada.",
    },
    commercialPlanLabel: "Plano Enterprise",
  },
};

export function getModuleTooltip(href: string, fallbackTitle?: string): ModuleTooltipConfig {
  if (MODULE_TOOLTIPS[href]) {
    return MODULE_TOOLTIPS[href];
  }
  const title = fallbackTitle || "Módulo MedCore";
  return {
    href,
    title,
    quickDesc: `Acesse e opere ${title.toLowerCase()} com apoio da Dra. Conte.`,
    fullDesc: `Central operacional de ${title} integrada ao ecossistema de inteligência clínica e administrativa do MedCore.`,
    features: ["Operação Integrada", "Histórico Auditado", "Atalhos Dra. Conte"],
    aiPrompts: [
      `Mostre um resumo operacional de ${title}`,
      `Quais ações pendentes existem em ${title} hoje?`,
    ],
    roleTips: {
      RECEPCIONISTA: `Utilize ${title} para agilizar o fluxo diário da recepção.`,
      MEDICO: `Consulte informações clínicas e operacionais de ${title}.`,
      ADMIN: `Monitore indicadores, conformidade e eficiência de ${title}.`,
    },
    commercialPlanLabel: "Plano Business",
  };
}
