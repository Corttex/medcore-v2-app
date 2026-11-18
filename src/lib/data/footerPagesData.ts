export type FooterCategory = "recursos" | "adicionais" | "institucional";

export interface FooterPageMetric {
  label: string;
  value: string;
}

export interface FooterPageFeature {
  title: string;
  description: string;
}

export interface FooterPageSection {
  title: string;
  body: string;
}

export interface FooterPageConfig {
  slug: string;
  category: FooterCategory;
  categoryLabel: string;
  navLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  heroSummary: string;
  aiOrb?: boolean;
  dashboardHref: string;
  dashboardLabel: string;
  metrics: FooterPageMetric[];
  highlights: string[];
  features: FooterPageFeature[];
  draConteExamplePrompt: string;
  draConteExampleReply: string;
  interactiveType?: "feature" | "careers" | "referral" | "support" | "legal";
  legalSections?: FooterPageSection[];
}

export const FOOTER_RECURSOS_PAGES: FooterPageConfig[] = [
  {
    slug: "agenda-inteligente",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Agenda inteligente",
    badge: "Recepção & Fluxo",
    title: "Agenda Inteligente com Confirmação Automática",
    subtitle: "Reduza faltas em até 62% com confirmações via WhatsApp, lista de espera inteligente e comandos por voz da Dra. Conte.",
    heroSummary: "Organize múltiplas salas, profissionais e convênios em uma grade visual rápida com preenchimento automático de encaixes ociosos.",
    dashboardHref: "/dashboard/agenda",
    dashboardLabel: "Abrir Agenda no Sistema",
    metrics: [
      { label: "Redução de No-Show", value: "-62%" },
      { label: "Confirmações Automáticas", value: "24/7" },
      { label: "Agendamento por Voz", value: "3 seg" },
    ],
    highlights: [
      "Confirmação automática via WhatsApp 48h, 24h e 2h antes da consulta",
      "Reencaixe inteligente sugerido pela Dra. Conte quando há cancelamentos",
      "Bloqueio de horários, escalas recorrentes e visão multi-unidades",
      "Link de autoagendamento online sincronizado em tempo real",
    ],
    features: [
      {
        title: "Grade Multi-profissional & Salas",
        description: "Visualize agendas por médico, especialidade, equipamento ou unidade clínica sem conflito de horários.",
      },
      {
        title: "Sistema Operacional Conversacional",
        description: "Peça em linguagem natural: 'Dra. Conte, agende retorno para João em 15 dias' e o horário é reservado na hora.",
      },
      {
        title: "Painel TV & Triagem Conectados",
        description: "O check-in na recepção atualiza automaticamente a fila de atendimento do profissional e chama o paciente na TV.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, mostre os horários vagos hoje em Cardiologia e encaixe o retorno da Mariana.",
    draConteExampleReply: "Encontrei 2 horários livres hoje (15h30 e 16h40 com Dr. Carlos). Pré-reservei as 15h30 e preparei o lembrete de confirmação via WhatsApp.",
  },
  {
    slug: "prontuario",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Prontuário",
    badge: "PEP Inteligente",
    title: "Prontuário Eletrônico (PEP) Assistido por IA",
    subtitle: "Histórico clínico completo, evolução no padrão SOAP, protocolos por especialidade e resumo inteligente de cada paciente.",
    heroSummary: "Deixe de apenas armazenar fichas e passe a interpretar o contexto clínico completo do paciente em segundos.",
    dashboardHref: "/dashboard/pacientes",
    dashboardLabel: "Acessar Prontuários",
    metrics: [
      { label: "Tempo Economizado/Dia", value: "2h 10m" },
      { label: "Conformidade CFM / LGPD", value: "100%" },
      { label: "Padrão Estruturado", value: "SOAP + CID" },
    ],
    highlights: [
      "Resumo Inteligente do Paciente gerado automaticamente pela Dra. Conte",
      "Anamnese adaptativa para Clínica Médica, Estética, Dermatologia e Multi-especialidades",
      "Linha do tempo unificada de consultas, exames, prescrições e evoluções",
      "Alertas automáticos de alergias, medicações recorrentes e fatores de risco",
    ],
    features: [
      {
        title: "Evolução Clínica em 1 Clique",
        description: "Com apoio do AI Scribe, a conversa com o paciente vira evolução médica estruturada pronta para revisão e assinatura.",
      },
      {
        title: "Comparativo Fotográfico & Protocolos",
        description: "Compare imagens antes e depois, anexe laudos e acompanhe a evolução de tratamentos longitudinais.",
      },
      {
        title: "Auditoria & Criptografia Ponta a Ponta",
        description: "Registro imutável com trilha de auditoria, RBAC por cargo e proteção rigorosa conforme LGPD e resoluções do CFM.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, resuma o histórico clínico e as últimas medicações de João Silva.",
    draConteExampleReply: "João Silva (último atend. há 15 dias): Hipertensão e Diabetes tipo 2. Uso contínuo de Losartana 50mg e Metformina 850mg. Taxa de comparecimento de 98% e retorno previsto em 30 dias.",
  },
  {
    slug: "planejamento-injetaveis",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Plan. de injetáveis",
    badge: "Estética & Vacinas",
    title: "Planejamento de Injetáveis & Insumos Críticos",
    subtitle: "Rastreabilidade por lote, validade ANVISA, controle fracionado de ampolas e mapa anatômico de aplicações.",
    heroSummary: "Controle cada miligrama, dose ou seringa aplicada com baixa automática no estoque e vínculo direto ao prontuário do paciente.",
    dashboardHref: "/dashboard/vacinas",
    dashboardLabel: "Abrir Injetáveis & Vacinas",
    metrics: [
      { label: "Rastreabilidade Sanitária", value: "Lote/ANVISA" },
      { label: "Perda por Validade", value: "-85%" },
      { label: "Baixa no Estoque", value: "Automática" },
    ],
    highlights: [
      "Vínculo obrigatório de lote, fabricante e data de validade na aplicação",
      "Mapa facial e corporal interativo para registro exato dos pontos de aplicação",
      "Controle de frascos abertos, fracionamento e estabilidade após reconstituição",
      "Alertas preventivos de vencimento e estoque mínimo de ampolas críticas",
    ],
    features: [
      {
        title: "Segurança Sanitária & Jurídica",
        description: "Histórico completo de qual lote foi utilizado em cada paciente e qual profissional executou a aplicação.",
      },
      {
        title: "Planejamento de Sessões & Retoques",
        description: "Programe ciclos de aplicações, bioestimuladores e vacinas com disparos automáticos de lembrete de retorno.",
      },
      {
        title: "Custeio Real por Procedimento",
        description: "Saiba exatamente quanto cada ampola e insumo consumido impacta na margem líquida do procedimento.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, quais lotes de injetáveis vencem nos próximos 30 dias?",
    draConteExampleReply: "Identifiquei 2 lotes com vencimento próximo (Toxina Lote #B942 em 18 dias). Sugiro priorizar o agendamento de retoques desta semana para evitar descarte.",
  },
  {
    slug: "odontograma",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Odontograma",
    badge: "Odontologia & Harmonização",
    title: "Odontograma Digital & Mapa Anatômico Interativo",
    subtitle: "Avaliação visual dente a dente, planejamento de procedimentos por face, orçamentos em 1 clique e evolução clínica integrada.",
    heroSummary: "Transforme a avaliação odontológica e facial em um plano de tratamento visual claro que aumenta a aprovação de orçamentos.",
    dashboardHref: "/dashboard/pacientes",
    dashboardLabel: "Abrir Módulo Clínico",
    metrics: [
      { label: "Aprovação de Orçamentos", value: "+38%" },
      { label: "Mapeamento por Face", value: "32 dentes" },
      { label: "Vínculo Financeiro", value: "Integrado" },
    ],
    highlights: [
      "Odontograma adulto e decíduo interativo por face e condição clínica",
      "Conversão instantânea do plano de tratamento em orçamento e parcelas",
      "Histórico visual do que já foi executado vs. procedimentos pendentes",
      "Integração nativa com Facial Map Canvas para Harmonização Orofacial",
    ],
    features: [
      {
        title: "Plano Visual para o Paciente",
        description: "Mostre na tela exatamente quais procedimentos são necessários e gere clareza na apresentação do investimento.",
      },
      {
        title: "Evolução Automática por Procedimento",
        description: "Ao concluir cada item do odontograma, o sistema registra a evolução e libera o repasse do profissional.",
      },
      {
        title: "Anexos Radiográficos & Imagens",
        description: "Armazene panorâmicas, periapicais e fotos clínicas com comparação lado a lado no mesmo prontuário.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, liste os pacientes com orçamento odontológico aprovado aguardando início.",
    draConteExampleReply: "Existem 4 pacientes com planos aprovados nos últimos 10 dias sem primeira sessão agendada. Deseja enviar o link de agendamento via WhatsApp?",
  },
  {
    slug: "prescricoes",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Prescrições",
    badge: "Receituário Digital",
    title: "Prescrições Digitais Inteligentes & Assinatura ICP-Brasil",
    subtitle: "Emita receitas simples, de controle especial, pedidos de exames e atestados em segundos com envio direto no WhatsApp do paciente.",
    heroSummary: "Motor de prescrição com modelos favoritos, validação posológica e verificação instantânea de autenticidade por QR Code.",
    dashboardHref: "/dashboard/pacientes",
    dashboardLabel: "Acessar Motor de Prescrição",
    metrics: [
      { label: "Emissão de Receita", value: "15 seg" },
      { label: "Validação Digital", value: "QR Code" },
      { label: "Entrega ao Paciente", value: "WhatsApp/PDF" },
    ],
    highlights: [
      "Receituário padronizado com validação digital ICP-Brasil e código verificador",
      "Protocolos favoritos por especialidade e posologias pré-salvas",
      "Alerta de alergias e medicamentos de uso recorrente do paciente",
      "Portal público de verificação de certificados e documentos médicos",
    ],
    features: [
      {
        title: "Integração com Escuta Clínica",
        description: "Durante a consulta, a Dra. Conte já sugere a prescrição coerente com o diagnóstico para sua validação.",
      },
      {
        title: "Envio Instantâneo em PDF",
        description: "Sem papel desperdiçado: o paciente recebe a receita no celular com layout profissional da sua clínica.",
      },
      {
        title: "Histórico de Renovações",
        description: "Repita receitas contínuas em 1 clique e receba alertas quando o tratamento crônico estiver próximo do fim.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, prepare a renovação da receita contínua de Losartana e Metformina para João Silva.",
    draConteExampleReply: "Rascunho da prescrição de uso contínuo (30/60 dias) preparado com posologia anterior validada. Pronto para sua revisão e assinatura.",
  },
  {
    slug: "financeiro",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Financeiro",
    badge: "Gestão & TISS",
    title: "Financeiro Hospitalar, Caixa & Faturamento TISS",
    subtitle: "Controle contas a pagar/receber, conciliação bancária, repasses médicos e lotes XML TISS com auditoria prévia contra glosas.",
    heroSummary: "Tenha previsibilidade de caixa real e recupere receitas perdidas em glosas de convênios com apoio da Dra. Conte.",
    dashboardHref: "/dashboard/contas",
    dashboardLabel: "Abrir Painel Financeiro",
    metrics: [
      { label: "Redução de Glosas", value: "-70%" },
      { label: "Fechamento de Repasses", value: "1 Clique" },
      { label: "Padrão Convênios", value: "TISS / ANS" },
    ],
    highlights: [
      "Auditoria prévia por IA em lotes TISS antes do envio para operadoras",
      "Cálculo automático de repasses médicos por procedimento ou convênio",
      "Contas a receber, contas a pagar, DRE gerencial e centros de custo",
      "Emissão de recurso de glosa e monitoramento de convênios inadimplentes",
    ],
    features: [
      {
        title: "Fluxo de Caixa por Unidade",
        description: "Acompanhe entradas particulares, cartões, Pix e previsões de recebimento de operadoras em tempo real.",
      },
      {
        title: "Repasses Sem Planilhas",
        description: "Cada atendimento concluído alimenta o extrato transparente do profissional conforme regras personalizadas.",
      },
      {
        title: "Alertas Financeiros da Dra. Conte",
        description: "Consulte contas vencidas, glosas recuperáveis e faturamento mensal por comando direto no topo do sistema.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, mostre contas vencidas e convênios com pendência neste mês.",
    draConteExampleReply: "Identifiquei 1 convênio com pendência de autorização/lote e R$ 34.200 em glosas/repasses auditáveis prontos para revisão no módulo TISS.",
  },
  {
    slug: "vendas",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Vendas",
    badge: "Comercial & Pacotes",
    title: "Vendas, Orçamentos & Gestão de Pacotes",
    subtitle: "Crie combos de sessões, acompanhe saldos consumidos, automatize renovações e aumente o ticket médio da clínica.",
    heroSummary: "Transforme atendimentos avulsos em planos de tratamento recorrentes com controle total de saldo e comissões.",
    dashboardHref: "/dashboard/pacotes",
    dashboardLabel: "Abrir Pacotes & Vendas",
    metrics: [
      { label: "Aumento de Ticket Médio", value: "+42%" },
      { label: "Controle de Sessões", value: "Automático" },
      { label: "Renovação Assistida", value: "Dra. Conte" },
    ],
    highlights: [
      "Criação flexível de pacotes por número de sessões ou procedimentos combinados",
      "Baixa automática de saldo a cada atendimento realizado na agenda",
      "Alerta comercial quando o paciente chega na penúltima sessão do pacote",
      "Relatório de conversão de orçamentos por profissional e consultor",
    ],
    features: [
      {
        title: "Jornada de Renovação Inteligente",
        description: "A Dra. Conte identifica pacotes próximos do término e sugere o momento exato para ofertar a continuidade.",
      },
      {
        title: "Orçamentos Profissionais",
        description: "Apresente propostas claras com condições de parcelamento e aprovação digital pelo paciente.",
      },
      {
        title: "Receita Antecipada Visível",
        description: "Separe o caixa recebido do saldo de sessões ainda a executar para manter governança financeira saudável.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, quais pacientes estão na última sessão de pacote nesta semana?",
    draConteExampleReply: "3 pacientes realizam a última sessão prevista nesta semana (2 em Estética, 1 em Fisioterapia). Preparei sugestões personalizadas de renovação.",
  },
  {
    slug: "estoque",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Estoque",
    badge: "Suprimentos",
    title: "Gestão de Estoque Inteligente & Leitor de NF-e",
    subtitle: "Evite rupturas de insumos e desperdícios por vencimento com entrada por XML/NF-e e baixa automática por atendimento.",
    heroSummary: "Controle centralizado de almoxarifado, farmácia e consultórios com alertas preditivos de reposição.",
    dashboardHref: "/dashboard/estoque",
    dashboardLabel: "Abrir Gestão de Estoque",
    metrics: [
      { label: "Entrada via NF-e", value: "Leitor IA" },
      { label: "Ruptura de Insumos", value: "Zero" },
      { label: "Rastreio de Lote", value: "100%" },
    ],
    highlights: [
      "Leitura inteligente de notas fiscais de compra para entrada rápida no estoque",
      "Alertas de estoque mínimo e validade próxima por unidade",
      "Movimentações auditadas por usuário, setor e centro de custo",
      "Integração com pedidos de compra e cotação de fornecedores",
    ],
    features: [
      {
        title: "Baixa Integrada à Agenda/Prontuário",
        description: "Defina kits padrão por procedimento para dar baixa automática sempre que o atendimento for concluído.",
      },
      {
        title: "Previsão de Consumo",
        description: "Com base na agenda futura, a Dra. Conte antecipa se faltará algum insumo crítico nos próximos 15 dias.",
      },
      {
        title: "Inventário Multi-unidades",
        description: "Transfira materiais entre matriz e filiais com histórico completo de entradas e saídas.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, quais insumos estão abaixo do estoque mínimo hoje?",
    draConteExampleReply: "4 itens atingiram o ponto de reposição (Luvas Nitrílicas M, Seringa 1ml, Gaze Estéril e Anestésico Tópico). Deseja gerar a lista de compras?",
  },
  {
    slug: "marketing",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "Marketing",
    badge: "Radar Comercial",
    title: "Marketing Médico, CRM & Reengajamento de Pacientes",
    subtitle: "Ative campanhas preventivas no WhatsApp, resgate faltas automaticamente e descubra receita escondida na sua própria base.",
    heroSummary: "Sua clínica não precisa depender só de anúncios pagos: transforme sua base histórica em agendamentos recorrentes.",
    dashboardHref: "/dashboard/marketing",
    dashboardLabel: "Abrir Radar Comercial",
    metrics: [
      { label: "Pacientes Resgatados", value: "+28%/mês" },
      { label: "Copywriting IA", value: "Integrado" },
      { label: "Régua Pós-Consulta", value: "Automática" },
    ],
    highlights: [
      "Segmentação automática por tempo sem retorno (90, 180, 365 dias)",
      "Resgate ativo de pacientes que faltaram ou cancelaram consultas",
      "Campanhas preventivas por especialidade em conformidade com ética médica",
      "Pesquisa de NPS pós-consulta e incentivo a avaliações positivas",
    ],
    features: [
      {
        title: "Radar de Oportunidades Ocultas",
        description: "A Dra. Conte analisa histórico clínico, convênio ativo e última consulta para apontar quem está pronto para voltar.",
      },
      {
        title: "Disparos & Réguas Inteligentes",
        description: "Automatize lembretes de check-up anual, aniversariantes e pós-procedimentos sem trabalho manual.",
      },
      {
        title: "ROI Mensurado em Tempo Real",
        description: "Acompanhe quantas consultas e quanto faturamento cada campanha trouxe de volta para a clínica.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, encontre pacientes de Cardiologia sem retorno há mais de 6 meses.",
    draConteExampleReply: "Encontrei 19 pacientes com convênio ativo sem retorno há mais de 6 meses (incluindo Nathalia Costa, 8 meses). Campanha preventiva pronta para disparo.",
  },
  {
    slug: "medchat",
    category: "recursos",
    categoryLabel: "Recursos",
    navLabel: "MedChat",
    badge: "Inbox Omnichannel",
    title: "MedChat: Atendimento Unificado no WhatsApp com Contexto Clínico",
    subtitle: "Centralize sua equipe de recepção em um único número oficial, com histórico do paciente ao lado da conversa e respostas sugeridas pela IA.",
    heroSummary: "Acabe com celulares pessoais na recepção e conecte cada mensagem do WhatsApp diretamente à agenda e ao prontuário.",
    dashboardHref: "/dashboard/mensagens",
    dashboardLabel: "Abrir MedChat / Inbox",
    metrics: [
      { label: "Tempo de Resposta", value: "-74%" },
      { label: "Atendentes Simultâneos", value: "Ilimitados" },
      { label: "Contexto do Paciente", value: "Em Tempo Real" },
    ],
    highlights: [
      "Múltiplos atendentes e filas por setor (Recepção, Financeiro, Pós-Venda)",
      "Visualização imediata de próximas consultas e pendências do paciente no chat",
      "Envio de links de teleconsulta, receitas em PDF e boletos/Pix em 1 clique",
      "Sugestões de resposta humanizada geradas pela Dra. Conte",
    ],
    features: [
      {
        title: "Nenhuma Mensagem Sem Resposta",
        description: "Identifique conversas aguardando retorno, atribua responsáveis e monitore SLA de atendimento da equipe.",
      },
      {
        title: "Do Chat Direto para a Agenda",
        description: "Agende ou confirme a consulta sem trocar de tela durante a conversa com o paciente.",
      },
      {
        title: "Histórico Auditável na Clínica",
        description: "Todas as interações ficam vinculadas ao perfil do paciente para continuidade entre turnos.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, resuma as conversas não respondidas no WhatsApp da recepção.",
    draConteExampleReply: "Há 5 conversas prioritárias aguardando resposta: 3 solicitações de encaixe para amanhã e 2 pedidos de envio de nota fiscal/guia.",
  },
];

export const FOOTER_ADICIONAIS_PAGES: FooterPageConfig[] = [
  {
    slug: "termos-e-contratos",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Termos e contratos",
    badge: "Jurídico & Compliance",
    title: "Termos de Consentimento & Contratos Digitais",
    subtitle: "Gere, envie e colha assinaturas eletrônicas em TCLEs, contratos de pacotes e autorizações médicas com validade jurídica.",
    heroSummary: "Proteja sua clínica juridicamente com modelos editáveis, trilha de auditoria e armazenamento criptografado no prontuário.",
    dashboardHref: "/dashboard/juridico",
    dashboardLabel: "Abrir Jurídico & Termos",
    metrics: [
      { label: "Assinatura Digital", value: "Celular / Tablet" },
      { label: "Arquivo no PEP", value: "Automático" },
      { label: "Conformidade", value: "LGPD / CFM" },
    ],
    highlights: [
      "Biblioteca de Termos de Consentimento Livre e Esclarecido (TCLE)",
      "Contratos de adesão para procedimentos estéticos, cirúrgicos e pacotes",
      "Assinatura do paciente pelo celular antes mesmo de entrar no consultório",
      "Armazenamento seguro com hash, IP, data/hora e vínculo ao prontuário",
    ],
    features: [
      {
        title: "Zero Papel na Recepção",
        description: "Envie o termo via WhatsApp no momento da confirmação para o paciente chegar com tudo assinado.",
      },
      {
        title: "Preenchimento Automático de Dados",
        description: "Nome, CPF, endereço e procedimento são preenchidos automaticamente a partir do cadastro do paciente.",
      },
      {
        title: "Blindagem Jurídica da Clínica",
        description: "Localize em segundos qualquer termo assinado em caso de auditoria ou questionamento clínico.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, verifique se os pacientes de procedimentos de amanhã já assinaram o TCLE.",
    draConteExampleReply: "Dos 6 procedimentos de amanhã, 4 já possuem TCLE assinado no prontuário e 2 estão pendentes. Deseja reenviar o link de assinatura agora?",
  },
  {
    slug: "crm-de-vendas",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "CRM de vendas",
    badge: "Funil Comercial",
    title: "CRM de Vendas Clínicas & Gestão de Oportunidades",
    subtitle: "Acompanhe leads desde o primeiro contato no WhatsApp ou anúncio até o fechamento do orçamento e comparecimento.",
    heroSummary: "Nunca mais perca um paciente interessado por falta de follow-up: visualize todo o funil comercial com alertas da Dra. Conte.",
    dashboardHref: "/dashboard/marketing",
    dashboardLabel: "Abrir CRM Comercial",
    metrics: [
      { label: "Conversão de Leads", value: "+35%" },
      { label: "Follow-up Automático", value: "Ativo" },
      { label: "Integração Ads/Chat", value: "Nativa" },
    ],
    highlights: [
      "Kanban visual de oportunidades: Novo Lead, Avaliado, Orçamento Enviado, Fechado",
      "Captura automática de leads vindos de formulários, site e campanhas",
      "Lembretes automáticos de follow-up para orçamentos não respondidos",
      "Previsão de receita por etapa do funil e desempenho por consultor",
    ],
    features: [
      {
        title: "Visibilidade Total do Funil",
        description: "Identifique exatamente em qual etapa os pacientes estão travando e atue rapidamente.",
      },
      {
        title: "Scripts Persuasivos com IA",
        description: "A Dra. Conte redige mensagens empáticas de acompanhamento adaptadas ao procedimento orçado.",
      },
      {
        title: "Conexão Direta com Pacotes",
        description: "Converte a oportunidade ganha diretamente em venda de pacote e agendamento da primeira sessão.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, quais orçamentos acima de R$ 2.000 estão aguardando resposta há mais de 3 dias?",
    draConteExampleReply: "Encontrei 3 oportunidades comerciais abertas há mais de 3 dias somando R$ 9.400. Sugiro enviar um follow-up consultivo hoje às 14h.",
  },
  {
    slug: "teleconsulta",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Teleconsulta",
    badge: "Consulta Inteligente",
    title: "Teleconsulta Inteligente Assistida por IA",
    subtitle: "Videochamada em alta definição criptografada, combinada ao Assistente Clínico Ativo e à Dra. Conte acompanhando em tempo real.",
    heroSummary: "Eleve sua telemedicina de uma chamada comum para uma consulta médica assistida com evolução SOAP, CID-10 e documentação automática.",
    dashboardHref: "/dashboard/telemedicina",
    dashboardLabel: "Abrir Consulta Inteligente",
    metrics: [
      { label: "Link para Paciente", value: "Sem App" },
      { label: "Criptografia", value: "TLS 1.3 / E2EE" },
      { label: "Copilota em Tempo Real", value: "Dra. Conte" },
    ],
    highlights: [
      "Sala virtual segura acessível pelo celular ou computador sem instalar aplicativo",
      "Sala de espera virtual com alerta sonoro e visual para o médico",
      "Assistente Clínico Ativo escutando a consulta e sugerindo CID-10",
      "Geração automática de evolução SOAP, prescrição e laudos na mesma tela",
    ],
    features: [
      {
        title: "Experiência Premium para Médico e Paciente",
        description: "Áudio e vídeo nítidos com chat integrado, compartilhamento de tela e envio do link por WhatsApp em 1 clique.",
      },
      {
        title: "Copilota Clínica Central",
        description: "Enquanto você olha nos olhos do paciente, a Dra. Conte organiza a anamnese, alerta fatores de risco e prepara o prontuário.",
      },
      {
        title: "Prontuário & Indicadores Atualizados",
        description: "Ao encerrar a chamada, toda a documentação é salva no PEP do paciente automaticamente.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, iniciar teleconsulta com João Silva e abrir prontuário assistido.",
    draConteExampleReply: "Sala segura pronta para João Silva. Assistente Clínico Ativo ativado para escuta, sugestão de CID-10 e estruturação SOAP automática.",
  },
  {
    slug: "medsite",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "MedSite",
    badge: "WebStudio & Presença",
    title: "MedSite: Site Profissional & Agendamento Online 24h",
    subtitle: "Publique o site da sua clínica ou consultório integrado à agenda em tempo real, com SEO médico e captura direta de pacientes.",
    heroSummary: "Transforme visitantes do Google e Instagram em consultas marcadas na sua agenda sem depender de atendimento manual.",
    dashboardHref: "/dashboard/webstudio",
    dashboardLabel: "Abrir MedSite / WebStudio",
    metrics: [
      { label: "Agendamento Direto", value: "24/7" },
      { label: "Otimizado para SEO", value: "Google Ready" },
      { label: "Sincronia Agenda", value: "Tempo Real" },
    ],
    highlights: [
      "Páginas de alta conversão para clínicas, especialidades e corpo clínico",
      "Botão de autoagendamento conectado aos horários reais dos médicos",
      "Páginas rápidas, responsivas para celular e com SSL ativo",
      "Integração com pixel de campanhas e WhatsApp oficial da clínica",
    ],
    features: [
      {
        title: "Agenda Cheia Mesmo de Madrugada",
        description: "Mais de 40% dos agendamentos online acontecem fora do horário comercial — capture esses pacientes automaticamente.",
      },
      {
        title: "Perfil de Médicos & Especialidades",
        description: "Apresente CRM/RQE, currículo, convênios aceitos e procedimentos com autoridade visual.",
      },
      {
        title: "Sem Dependência de Agências Lentas",
        description: "Atualize textos, especialidades e banners direto pelo painel do MedCore em minutos.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, crie a descrição institucional de Cardiologia Preventiva para nosso MedSite.",
    draConteExampleReply: "Texto otimizado para pacientes e mecanismos de busca criado com destaque em check-up cardiológico, MAPA e telemedicina assistida.",
  },
  {
    slug: "nota-fiscal",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Nota Fiscal",
    badge: "Fiscal & DMED",
    title: "Emissor Automático de Nota Fiscal (NFS-e) & DMED",
    subtitle: "Emita notas fiscais médicas na baixa do pagamento, envie PDF e XML pelo WhatsApp e gere o relatório DMED em 1 clique.",
    heroSummary: "Elimine dezenas de horas de emissão manual no portal da prefeitura e mantenha a clínica protegida contra inconsistências fiscais.",
    dashboardHref: "/dashboard/notas-fiscais",
    dashboardLabel: "Abrir Emissor Fiscal",
    metrics: [
      { label: "Cidades Compatíveis", value: "1.500+" },
      { label: "Economia Operacional", value: "20h/mês" },
      { label: "Relatório DMED", value: "1 Clique" },
    ],
    highlights: [
      "Emissão automatizada de NFS-e ao confirmar recebimento de consulta ou pacote",
      "Cálculo automático de retenções fiscais (IRRF, CSRF, ISS)",
      "Envio instantâneo do PDF e XML no WhatsApp e e-mail do paciente",
      "Exportação consolidada para DMED da Receita Federal e contabilidade",
    ],
    features: [
      {
        title: "Zero Digitação Redundante",
        description: "Os dados do tomador, CPF e discriminação do serviço médico vêm prontos do atendimento.",
      },
      {
        title: "Conformidade Tributária Contínua",
        description: "Armazenamento em nuvem por 5 anos com rastreio de notas emitidas, canceladas e pendentes.",
      },
      {
        title: "Mais Tempo para a Recepção",
        description: "Sua equipe foca em acolher pacientes enquanto o faturamento fiscal roda no piloto automático.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, liste pagamentos de ontem que ainda estão aguardando emissão de NFS-e.",
    draConteExampleReply: "Localizei 4 recebimentos particulares de ontem prontos para emissão em lote. Deseja emitir e enviar os PDFs aos pacientes agora?",
  },
  {
    slug: "transcricao-em-tempo-real",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Transcrição em tempo real",
    badge: "AI Scribe Clínico",
    aiOrb: true,
    title: "Transcrição em Tempo Real & Prontuário SOAP Automático",
    subtitle: "Devolva o olho no olho com o paciente. A IA ouve a consulta com consentimento, transcreve com precisão médica e estrutura o prontuário.",
    heroSummary: "Transforme o diálogo natural do consultório em evolução médica completa, hipóteses diagnósticas e sugestão de CID-10 em segundos.",
    dashboardHref: "/dashboard/telemedicina",
    dashboardLabel: "Testar Assistente Clínico",
    metrics: [
      { label: "Precisão Terminológica", value: "99,2%" },
      { label: "Digitação Evitada", value: "-85%" },
      { label: "Formato Clínico", value: "SOAP + CID-10" },
    ],
    highlights: [
      "Reconhecimento de voz treinado para termos médicos, fármacos e exames em português",
      "Separação automática entre fala do médico e relato do paciente",
      "Estruturação imediata em Subjetivo, Objetivo, Avaliação e Plano (SOAP)",
      "Sugestão contextual de códigos CID-10 e alertas de fatores de risco",
    ],
    features: [
      {
        title: "Presencial ou Telemedicina",
        description: "Funciona tanto dentro da sala de teleconsulta quanto no consultório presencial via microfone do computador ou celular.",
      },
      {
        title: "Fim das Pilhas de Prontuários",
        description: "Saia do consultório com todas as evoluções finalizadas no mesmo momento do atendimento.",
      },
      {
        title: "Privacidade & Controle Médico",
        description: "O médico sempre revisa e valida o texto sugerido antes de gravar no prontuário definitivo.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, gere o resumo SOAP e sugira o CID-10 a partir da transcrição desta consulta.",
    draConteExampleReply: "SOAP estruturado: Queixa de cefaleia matinal e pico pressórico (150x95 mmHg). Hipótese sugerida: CID-10 I10 (HAS Estágio 1). Conduta pronta para revisão.",
  },
  {
    slug: "atendimento-24h",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Atendimento 24h",
    badge: "Dra. Conte Operacional",
    aiOrb: true,
    title: "Atendimento 24h & Sistema Operacional Conversacional",
    subtitle: "Atenda, qualifique e agende pacientes dia e noite — e opere todo o ERP MedCore conversando com a Dra. Conte em linguagem natural.",
    heroSummary: "Sua clínica funcionando 24 horas por dia no WhatsApp para pacientes e com uma copilota transversal executando tarefas para sua equipe.",
    dashboardHref: "/dashboard/ia-executiva",
    dashboardLabel: "Abrir Central Dra. Conte",
    metrics: [
      { label: "Disponibilidade", value: "24h / 7d" },
      { label: "Tempo de Resposta", value: "< 3 seg" },
      { label: "Execução no ERP", value: "Voz & Texto" },
    ],
    highlights: [
      "Triagem humanizada de pacientes fora do horário comercial com encaminhamento para agenda",
      "Confirmação de consultas, envio de preparos de exames e orientações da clínica",
      "Operação interna por comandos: cadastros, agendamentos, cobranças e relatórios",
      "Monitoramento proativo no topo do sistema identificando gargalos e oportunidades",
    ],
    features: [
      {
        title: "Zero Curva de Aprendizado para Equipe",
        description: "Uma recepcionista nova não precisa decorar 30 menus: basta pedir à Dra. Conte o que precisa executar.",
      },
      {
        title: "Captação Noturna & Fins de Semana",
        description: "Pacientes que enviam mensagem às 22h recebem atendimento imediato e já saem com horário pré-agendado.",
      },
      {
        title: "Escala Inteligente para Redes",
        description: "Mantenha o mesmo padrão de excelência e agilidade em todas as unidades simultaneamente.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, agende retorno para João em 15 dias e confirme o preparo do exame.",
    draConteExampleReply: "Retorno pré-agendado para daqui a 15 dias conforme disponibilidade do médico e mensagem com instruções de preparo enviada ao paciente.",
  },
  {
    slug: "criacao-de-textos",
    category: "adicionais",
    categoryLabel: "Adicionais",
    navLabel: "Criação de textos",
    badge: "Copywriter & Laudos IA",
    aiOrb: true,
    title: "Criação de Textos Clínicos, Laudos & Campanhas Médicas",
    subtitle: "Produza laudos estruturados, encaminhamentos, orientações pós-procedimento e mensagens de campanhas éticas em segundos.",
    heroSummary: "Motor especializado na comunicação de saúde para acelerar documentos assistenciais e campanhas de relacionamento com pacientes.",
    dashboardHref: "/dashboard/loja",
    dashboardLabel: "Explorar Habilidades IA",
    metrics: [
      { label: "Documentos & Laudos", value: "10x mais rápido" },
      { label: "Tom de Comunicação", value: "Ético / CFM" },
      { label: "Templates Prontos", value: "Multi-áreas" },
    ],
    highlights: [
      "Redação assistida de laudos diagnósticos, relatórios para convênios e pareceres",
      "Criação de cartilhas e orientações pós-operatórias personalizadas por paciente",
      "Mensagens de resgate de faltosos, retornos preventivos e campanhas sazonais",
      "Adaptação automática de linguagem técnica (para médicos) ou acessível (para pacientes)",
    ],
    features: [
      {
        title: "Comunicação Clara que Fideliza",
        description: "Envie orientações impecáveis após consultas ou procedimentos, reduzindo dúvidas repetidas na recepção.",
      },
      {
        title: "Campanhas com Alta Conversão",
        description: "Gere sequências de WhatsApp para check-up, odontologia preventiva, estética e vacinação em 1 clique.",
      },
      {
        title: "Padronização da Marca da Clínica",
        description: "Garanta que toda a equipe comunique com clareza, acolhimento e rigor profissional.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, escreva uma mensagem acolhedora de retorno preventivo de Cardiologia para Nathalia.",
    draConteExampleReply: "Olá Nathalia! Aqui é da equipe médica. Já faz alguns meses desde sua última avaliação em Cardiologia e queremos cuidar do seu check-up preventivo. Temos horários disponíveis esta semana!",
  },
];

export const FOOTER_INSTITUCIONAL_PAGES: FooterPageConfig[] = [
  {
    slug: "trabalhe-conosco",
    category: "institucional",
    categoryLabel: "Institucional",
    navLabel: "Trabalhe conosco",
    badge: "Carreiras MedCore",
    title: "Construa o Futuro da Inteligência Clínica no Brasil",
    subtitle: "Estamos reunindo engenheiros, designers, especialistas em saúde e consultores comerciais que querem transformar a rotina de médicos e clínicas.",
    heroSummary: "No MedCore, unimos IA transversal, design de alta precisão e operação real de saúde para devolver tempo aos profissionais que cuidam de pessoas.",
    dashboardHref: "/register",
    dashboardLabel: "Criar Conta na Plataforma",
    interactiveType: "careers",
    metrics: [
      { label: "Modelo de Trabalho", value: "Remoto / Híbrido" },
      { label: "Cultura de Produto", value: "IA-First" },
      { label: "Impacto Direto", value: "Saúde Real" },
    ],
    highlights: [
      "Engenharia Full-Stack (Next.js, TypeScript, Prisma, Supabase & IA)",
      "Product Design & UX focado em sistemas críticos de saúde",
      "Expansão Comercial B2B & Customer Success para clínicas e redes",
      "Especialistas em Faturamento TISS, LGPD e Operações Hospitalares",
    ],
    features: [
      {
        title: "Autonomia & Velocidade",
        description: "Times enxutos e seniores que colocam produto real nas mãos de médicos e gestores toda semana.",
      },
      {
        title: "Fronteira de IA Aplicada",
        description: "Trabalhe com agentes operacionais, escuta clínica em tempo real e arquitetura conversacional.",
      },
      {
        title: "Crescimento Acelerado",
        description: "Ambiente meritocrático com plano de evolução, participação em projetos estratégicos e aprendizado contínuo.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, quais áreas estão com banco de talentos aberto no MedCore?",
    draConteExampleReply: "Temos oportunidades prioritárias para Engenharia Full-Stack/IA, Especialista de Implantação em Saúde, Product Design e Executivo Comercial B2B.",
  },
  {
    slug: "indique-e-ganhe",
    category: "institucional",
    categoryLabel: "Institucional",
    navLabel: "Indique e ganhe",
    badge: "Programa de Parceiros",
    title: "Indique Clínicas e Médicos e Ganhe Recompensas Recorrentes",
    subtitle: "Ajude colegas e clínicas parceiras a operarem com a Dra. Conte e receba bonificações mensais ou créditos na sua assinatura.",
    heroSummary: "Transforme sua rede de relacionamentos na área da saúde em economia na mensalidade ou receita recorrente mensal.",
    dashboardHref: "/dashboard/loja",
    dashboardLabel: "Ver Planos & Benefícios",
    interactiveType: "referral",
    metrics: [
      { label: "Bônus por Indicação", value: "Até 20% MRR" },
      { label: "Benefício ao Indicado", value: "Onboarding VIP" },
      { label: "Acompanhamento", value: "Transparente" },
    ],
    highlights: [
      "Válido para clientes ativos, médicos, consultores e contabilidades médicas",
      "Sem limite máximo de indicações por mês",
      "O indicado ganha implantação assistida prioritária pela equipe MedCore",
      "Use os créditos para abater sua mensalidade ou liberar novas habilidades da Dra. Conte",
    ],
    features: [
      {
        title: "Indicação em 30 Segundos",
        description: "Gere seu link ou registre os dados da clínica indicada diretamente nesta página.",
      },
      {
        title: "Implantação Guiada",
        description: "Nossa equipe faz a demonstração personalizada mostrando exatamente os ganhos da Dra. Conte.",
      },
      {
        title: "Crédito Automático",
        description: "Assim que a clínica indicada ativa o plano, sua bonificação passa a contar automaticamente.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, simule minha economia indicando 3 clínicas no Plano Business.",
    draConteExampleReply: "Com 3 clínicas ativas no Plano Business, seus créditos de indicação podem zerar a mensalidade da sua clínica ou gerar até R$ 328/mês em bônus recorrente.",
  },
  {
    slug: "suporte-remoto",
    category: "institucional",
    categoryLabel: "Institucional",
    navLabel: "Suporte remoto",
    badge: "Atendimento Especializado",
    title: "Central de Suporte Remoto & Implantação Assistida",
    subtitle: "Atendimento ágil por especialistas de saúde e tecnologia para configurar sua clínica, treinar sua equipe e resolver dúvidas na hora.",
    heroSummary: "Combine a agilidade da Dra. Conte 24h com suporte humano especializado via WhatsApp, acesso remoto seguro e e-mail prioritário.",
    dashboardHref: "/dashboard/suporte",
    dashboardLabel: "Abrir Central no Painel",
    interactiveType: "support",
    metrics: [
      { label: "SLA Primeira Resposta", value: "< 12 min" },
      { label: "Suporte Remoto Seguro", value: "Sob Demanda" },
      { label: "Satisfação Atendimento", value: "98,4%" },
    ],
    highlights: [
      "Atendimento humano direto via WhatsApp (+55 11 98927 2833) e e-mail",
      "Sessão remota guiada para configuração de TISS, NFS-e e certificação digital",
      "Onboarding assistido para recepção, corpo clínico e diretoria financeira",
      "Base de conhecimento e Tooltips Inteligentes dentro de cada tela do sistema",
    ],
    features: [
      {
        title: "Configuração Sem Dor de Cabeça",
        description: "Ajudamos na importação de pacientes, cadastro de convênios e setup de horários desde o dia 1.",
      },
      {
        title: "Sessão Remota Segura",
        description: "Quando precisar, um especialista compartilha a tela com você mediante autorização expressa para resolver em minutos.",
      },
      {
        title: "Canal Direto para Urgências",
        description: "Prioridade máxima para salas de telemedicina, emissão fiscal e faturamento em andamento.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, preciso configurar minha emissão de Nota Fiscal e importar minha lista de pacientes.",
    draConteExampleReply: "Posso iniciar a importação guiada agora mesmo ou abrir um chamado prioritário com nosso time de implantação técnica.",
  },
  {
    slug: "politica-de-privacidade",
    category: "institucional",
    categoryLabel: "Institucional",
    navLabel: "Política de privacidade",
    badge: "LGPD & HIPAA Compliance",
    title: "Política de Privacidade e Proteção de Dados em Saúde",
    subtitle: "Compromisso integral com a segurança, sigilo médico, criptografia de dados sensíveis e conformidade com a Lei Geral de Proteção de Dados (LGPD).",
    heroSummary: "Tratamos informações clínicas e administrativas sob os mais rigorosos padrões técnicos de segregação multi-tenant, criptografia AES-256 GCM e auditoria.",
    dashboardHref: "/dashboard/auditoria",
    dashboardLabel: "Ver Auditoria & LGPD",
    interactiveType: "legal",
    metrics: [
      { label: "Criptografia em Repouso", value: "AES-256 GCM" },
      { label: "Tráfego Seguro", value: "TLS 1.3" },
      { label: "Regulamentação", value: "LGPD / CFM" },
    ],
    highlights: [
      "Isolamento lógico por clínica/unidade e controle de acesso baseado em papel (RBAC)",
      "Criptografia de campos sensíveis (CPF, dados bancários, prontuários e salários)",
      "Logs completos de acesso, visualização e alteração de prontuários",
      "Nenhum dado clínico de pacientes é comercializado ou compartilhado com terceiros",
    ],
    features: [
      {
        title: "Sigilo Clínico Preservado",
        description: "Somente profissionais devidamente autenticados e autorizados pelo controlador da clínica acessam dados assistenciais.",
      },
      {
        title: "IA Segura e Auditada",
        description: "Os processamentos de apoio clínico da Dra. Conte operam sob políticas rígidas de confidencialidade sem exposição pública.",
      },
      {
        title: "Direitos dos Titulares",
        description: "Suporte completo para exportação, retificação e governança de dados mediante solicitação da instituição ou titular.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, como o MedCore protege os dados de prontuários e CPF dos pacientes?",
    draConteExampleReply: "Utilizamos criptografia AES-256 GCM em campos sensíveis, isolamento por tenant, autenticação com PIN/MFA e trilha completa de auditoria LGPD.",
    legalSections: [
      {
        title: "1. Controlador, Operador e Papel das Partes",
        body: "Na operação da plataforma MedCore, a clínica, hospital ou profissional de saúde contratante atua como Controlador dos dados clínicos e cadastrais de seus pacientes, cabendo à MedCore Systems o papel de Operadora de dados pessoais e dados pessoais sensíveis de saúde, executando o tratamento estritamente conforme as instruções do Controlador e a Lei nº 13.709/2018 (LGPD).",
      },
      {
        title: "2. Categorias de Dados Tratados",
        body: "Tratamos dados cadastrais de profissionais e usuários autorizados, informações clínicas registradas no Prontuário Eletrônico (anamnese, evoluções, exames, prescrições e termos), dados de agendamento e comunicação, bem como informações fiscais e financeiras necessárias para emissão de guias TISS, notas fiscais e repasses.",
      },
      {
        title: "3. Segurança Técnica, Criptografia e Retenção",
        body: "Todas as comunicações utilizam criptografia em trânsito (TLS 1.3 / HSTS). Campos sensíveis recebem cifragem adicional (AES-256 GCM) e indexação protegida por HMAC. Os prontuários seguem os prazos mínimos legais de guarda estabelecidos pelo Conselho Federal de Medicina (CFM) e legislação vigente.",
      },
      {
        title: "4. Canal do Encarregado (DPO) e Exercício de Direitos",
        body: "Solicitações relacionadas à privacidade, portabilidade, esclarecimentos ou incidentes podem ser encaminhadas diretamente para contato@medcore.app.br ou sac@medcore.app.br, com atendimento prioritário ao Controlador e aos titulares.",
      },
    ],
  },
  {
    slug: "termos-de-uso",
    category: "institucional",
    categoryLabel: "Institucional",
    navLabel: "Termos de uso",
    badge: "Condições Gerais",
    title: "Termos e Condições Gerais de Uso do MedCore",
    subtitle: "Regras transparentes de licenciamento SaaS, responsabilidades médicas, disponibilidade de serviço e contratação dos planos MedCore.",
    heroSummary: "Conheça os direitos e deveres na utilização do ecossistema MedCore e da assistente clínica e operacional Dra. Conte.",
    dashboardHref: "/dashboard/loja",
    dashboardLabel: "Consultar Planos & Condições",
    interactiveType: "legal",
    metrics: [
      { label: "Disponibilidade Alvo", value: "99,9% SLA" },
      { label: "Modelo", value: "SaaS Sem Fidelidade" },
      { label: "Atualizações", value: "Contínuas" },
    ],
    highlights: [
      "Licença de uso concedida conforme o plano contratado (Starter, Growth, Business ou Enterprise)",
      "A decisão clínica, diagnóstica e prescritiva permanece sob responsabilidade exclusiva do profissional habilitado",
      "Propriedade integral da base de pacientes e prontuários pertencente à instituição contratante",
      "Cancelamento transparente sem multas ocultas e exportação assistida de dados",
    ],
    features: [
      {
        title: "Uso Assistivo da Inteligência Artificial",
        description: "A Dra. Conte e o Assistente Clínico Ativo atuam como ferramentas de apoio à produtividade e organização; a validação final cabe sempre ao médico ou gestor.",
      },
      {
        title: "Continuidade & Backups",
        description: "Rotinas automatizadas de backup e redundância garantem integridade operacional contínua.",
      },
      {
        title: "Suporte & Evolução do Sistema",
        description: "Novas melhorias de segurança, legislação TISS/ANS e usabilidade são entregues continuamente sem custo de atualização de versão.",
      },
    ],
    draConteExamplePrompt: "Dra. Conte, posso exportar os dados dos meus pacientes se precisar encerrar a conta?",
    draConteExampleReply: "Sim. A propriedade dos dados pertence à sua clínica, garantindo exportação estruturada de prontuários e cadastros conforme os Termos de Uso e LGPD.",
    legalSections: [
      {
        title: "1. Objeto e Licenciamento de Software",
        body: "O presente instrumento regula o acesso e uso da plataforma MedCore em modalidade Software as a Service (SaaS), abrangendo os módulos habilitados no plano contratado pela clínica, consultório ou rede de saúde.",
      },
      {
        title: "2. Responsabilidade Clínica e Ferramentas de IA",
        body: "Os recursos de inteligência artificial (incluindo Dra. Conte, AI Scribe, sugestões de CID-10 e resumos automáticos) têm caráter estritamente auxiliar e informativo. Não substituem o julgamento clínico soberano do profissional de saúde regularmente inscrito em seu conselho de classe, que deve revisar e validar qualquer registro antes de sua formalização.",
      },
      {
        title: "3. Credenciais, Segurança e Uso Adequado",
        body: "Cada usuário deve manter suas credenciais e PIN pessoal sob sigilo absoluto, respondendo pelos atos praticados com sua sessão. É vedado o compartilhamento de acessos individuais ou a tentativa de contorno dos mecanismos de segurança.",
      },
      {
        title: "4. Planos, Upgrade e Cancelamento",
        body: "A contratante pode realizar upgrades ou ajustes de módulos adicionais diretamente pelo painel de Planos & Habilidades. O encerramento de assinatura pode ser solicitado a qualquer momento respeitando o ciclo de faturamento vigente, mantendo-se o acesso à exportação dos dados nos termos legais.",
      },
    ],
  },
];

export const ALL_FOOTER_PAGES: FooterPageConfig[] = [
  ...FOOTER_RECURSOS_PAGES,
  ...FOOTER_ADICIONAIS_PAGES,
  ...FOOTER_INSTITUCIONAL_PAGES,
];

export function getFooterPageBySlug(
  category: FooterCategory,
  slug: string
): FooterPageConfig | undefined {
  return ALL_FOOTER_PAGES.find(
    (p) => p.category === category && p.slug === slug
  );
}
