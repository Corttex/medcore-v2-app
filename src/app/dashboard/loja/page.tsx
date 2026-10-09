"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  TrendingUp, 
  MessageSquare, 
  Receipt, 
  Mic, 
  Tv, 
  CreditCard, 
  QrCode, 
  X, 
  Award,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ModuloLoja {
  id: string;
  name: string;
  category: "marketing" | "fiscal" | "ia" | "recepcao";
  badge: string;
  badgeColor: string;
  isPopular?: boolean;
  shortDesc: string;
  longDesc: string;
  monthlyPrice: number;
  annualPrice: number; // à vista anual
  features: string[];
  roiQuote?: string;
  targetHref: string;
  tierOptions?: {
    name: string;
    price: number;
    desc: string;
    features: string[];
  }[];
}

const MODULOS: ModuloLoja[] = [
  {
    id: "marketing-crm",
    name: "Marketing & CRM Automático",
    category: "marketing",
    badge: "MAIS VENDIDO",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    isPopular: true,
    shortDesc: "Disparos no WhatsApp 24/7, Motor de Up-sell de Estética, IA Copywriter e E-mails via Resend.",
    longDesc: "Transforme pacientes inativos em faturamento recorrente. Configure jornadas de pós-consulta, aniversário, retorno de 180 dias e recuperação de no-show no piloto automático.",
    monthlyPrice: 97,
    annualPrice: 990,
    features: [
      "Disparos automáticos WhatsApp 24/7 (NPS pós-consulta, Aniversariantes, Retorno 180 dias, Resgate de Faltas)",
      "Motor de Up-sell inteligente de Procedimentos & Pacotes Estéticos",
      "Assistente de Copys com IA (MEDCore AI Copywriter) ilimitado",
      "Até 5.000 e-mails/mês inclusos com infraestrutura de alta entregabilidade (Resend)",
      "Segmentador inteligente de pacientes (por especialidade, última visita e ticket)",
      "Conexão multi-canal (WhatsApp Web Direct gratuito ou Evolution API / QR Code)",
      "Relatórios de conversão e faturamento recuperado em tempo real"
    ],
    roiQuote: "Doutor(a), uma única consulta de R$ 350 ou pacote de estética de R$ 1.500 que o módulo trouxer de volta com as mensagens automáticas já paga a assinatura do ano inteiro do sistema!",
    targetHref: "/dashboard/marketing",
    tierOptions: [
      {
        name: "Marketing Start",
        price: 49,
        desc: "Ideal para clínicas que desejam iniciar com envio manual assistido.",
        features: [
          "Envio manual via WhatsApp Direct (wa.me) 100% gratuito",
          "Biblioteca de templates médicos de alta conversão",
          "Segmentador dinâmico de pacientes",
          "1.000 e-mails/mês inclusos"
        ]
      },
      {
        name: "Marketing PRO com IA e Automação (Recomendado)",
        price: 97,
        desc: "Automação total 24/7 em segundo plano + IA Copywriter ilimitado.",
        features: [
          "Disparos 100% automáticos em segundo plano 24/7",
          "Motor de Up-sell e Resgate de Faltas",
          "MEDCore AI Copywriter ilimitado",
          "5.000 e-mails/mês inclusos via Resend",
          "Conexão por QR Code / Evolution API"
        ]
      }
    ]
  },
  {
    id: "emissor-fiscal",
    name: "Emissor Fiscal Automático (NFS-e & DMED)",
    category: "fiscal",
    badge: "COMPLIANCE TOTAL",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    shortDesc: "Emissão de Notas Fiscais de Serviço (NFS-e) e Relatório DMED automático para a Receita Federal.",
    longDesc: "Elimine o retrabalho na recepção e o risco de multas fiscais. As notas fiscais são geradas assim que o paciente faz o pagamento.",
    monthlyPrice: 67,
    annualPrice: 680,
    features: [
      "Emissão automática de NFS-e na baixa de pagamentos ou agendamentos",
      "Relatório DMED consolidado em 1 clique para a declaração anual da Receita Federal",
      "Envio automático de XML e PDF da nota fiscal direto no e-mail e WhatsApp do paciente",
      "Compatível com mais de 1.500 prefeituras em todo o território nacional",
      "Armazenamento em nuvem criptografada de todas as notas fiscais por 5 anos",
      "Gestão de alíquotas de ISS, retenções e regras específicas da área médica"
    ],
    roiQuote: "Economize até 20 horas mensais da sua equipe financeira e proteja sua clínica médica de cair na malha fina da Receita Federal.",
    targetHref: "/dashboard/notas-fiscais"
  },
  {
    id: "ai-scribe",
    name: "AI Scribe - Transcrição de Consultas Ilimitada",
    category: "ia",
    badge: "NOVO • IA AVANÇADA",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    shortDesc: "Gravação, escuta médica e estruturação automática de prontuário no padrão SOAP em segundos.",
    longDesc: "O médico foca 100% no paciente enquanto a IA ouve o diálogo, resume a queixa e preenche a anamnese, hipóteses diagnósticas e conduta.",
    monthlyPrice: 147,
    annualPrice: 1490,
    features: [
      "Gravação e transcrição ao vivo da consulta médica com precisão de terminologia clínica",
      "Estruturação instantânea no padrão SOAP (Subjetivo, Objetivo, Avaliação, Plano)",
      "Detecção automática de sintomas, sinais de alerta e sugestão de códigos CID-10",
      "Integração direta com o Prontuário Eletrônico do Paciente no MEDCore",
      "Economia comprovada de 1,5 a 2 horas diárias de digitação para cada médico",
      "Em conformidade estrita com a LGPD e sigilo médico"
    ],
    roiQuote: "Devolva o contato visual aos seus atendimentos: médicos atendem com mais qualidade e saem no horário sem pilhas de prontuários pendentes.",
    targetHref: "/dashboard/pacientes"
  },
  {
    id: "painel-tv",
    name: "Painel TV de Senhas com Voz Neural",
    category: "recepcao",
    badge: "SALA DE ESPERA",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    shortDesc: "Chamada de senhas por voz neural em português e sala de espera interativa na Smart TV.",
    longDesc: "Modernize a recepção da sua clínica. Exiba vídeos educativos, previsão do tempo, avisos institucionais e chame os pacientes com voz humanizada.",
    monthlyPrice: 47,
    annualPrice: 470,
    features: [
      "Chamada de senhas com voz sintética neural em português (nome do paciente e consultório)",
      "Exibição personalizada com o logo, cores e tipografia da sua clínica",
      "Carrossel multimídia: vídeos institucionais, notícias do dia e previsão do tempo",
      "Compatível com qualquer TV (Samsung Tizen, LG WebOS, Android TV, Fire TV Stick)",
      "Controle de chamadas direto da tela do médico ou recepcionista em 1 clique"
    ],
    roiQuote: "Uma experiência de clínica de alto padrão: acabe com aglomerações e gritos na recepção logo na primeira semana de uso.",
    targetHref: "/dashboard/painel-tv"
  }
];

export default function LojaModulosPage() {
  const { theme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTierSelection, setActiveTierSelection] = useState<Record<string, number>>({
    "marketing-crm": 1 // 1 = PRO (R$ 97)
  });

  // Modal de Checkout / Ativação
  const [checkoutModule, setCheckoutModule] = useState<ModuloLoja | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<"card" | "pix">("card");
  const [isActivating, setIsActivating] = useState(false);
  const [activeModules, setActiveModules] = useState<string[]>(["marketing-crm"]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // FAQ Expanders
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculadora de ROI
  const [consultasMes, setConsultasMes] = useState<number>(150);
  const [ticketMedio, setTicketMedio] = useState<number>(350);

  const pacientesResgatados = Math.max(1, Math.round(consultasMes * 0.04));
  const faturamentoRecuperado = pacientesResgatados * ticketMedio;
  const custoMarketing = isAnnual ? 82.5 : 97;
  const lucroLiquido = faturamentoRecuperado - custoMarketing;
  const roiCalculado = Math.round((lucroLiquido / custoMarketing) * 100);

  const percentConsultas = Math.min(100, Math.max(0, ((consultasMes - 30) / (500 - 30)) * 100));
  const percentTicket = Math.min(100, Math.max(0, ((ticketMedio - 100) / (2500 - 100)) * 100));

  const filteredModulos = selectedCategory === "all" 
    ? MODULOS 
    : MODULOS.filter(m => m.category === selectedCategory);

  const handleOpenCheckout = (modulo: ModuloLoja) => {
    setCheckoutModule(modulo);
    setPixCopied(false);
  };

  const handleConfirmActivation = () => {
    setIsActivating(true);
    setTimeout(() => {
      if (checkoutModule) {
        if (!activeModules.includes(checkoutModule.id)) {
          setActiveModules(prev => [...prev, checkoutModule.id]);
        }
      }
      setIsActivating(false);
      setCheckoutModule(null);
      setShowSuccessModal(true);
    }, 1200);
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136medcore-pagamentos-marketplace-pix-chave5204000053039865802BR5925MEDCORE SAAS CLINICAS6009SAO PAULO62070503***6304");
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300 pb-24">
      
      {/* ═══════════════════════════════════════════════════════════════
          HERO & VALUE BANNER (Textos Aumentados)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-rd-cyan/30 bg-gradient-to-br from-surface to-surface-container-high p-8 md:p-12 shadow-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rd-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rd-cyan/40 bg-rd-cyan/10 text-rd-cyan text-xs md:text-sm font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={16} className="animate-spin-slow" />
            Loja Oficial de Módulos & Add-ons Extras
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-on-surface tracking-tight leading-tight">
            Turbine sua clínica com recursos que se <span className="text-rd-cyan underline decoration-rd-cyan/40 decoration-wavy underline-offset-4">pagam sozinhos</span>
          </h1>

          <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed">
            Ative módulos adicionais independentes para automatizar seu WhatsApp, garantir conformidade fiscal, 
            economizar horas com IA e encantar pacientes na recepção. Sem fidelidade e com ativação instantânea.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-on-surface bg-surface-container/80 px-3.5 py-2 rounded-xl border border-outline-variant/50 shadow-sm">
              <Zap size={16} className="text-amber-500" /> Ativação Instantânea em 1 Clique
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-on-surface bg-surface-container/80 px-3.5 py-2 rounded-xl border border-outline-variant/50 shadow-sm">
              <ShieldCheck size={16} className="text-emerald-500" /> Cancele quando quiser
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-on-surface bg-surface-container/80 px-3.5 py-2 rounded-xl border border-outline-variant/50 shadow-sm">
              <Award size={16} className="text-rd-cyan" /> 7 dias de garantia incondicional
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BILLING CYCLE TOGGLE (Textos Aumentados)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-10 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className={`text-sm md:text-base font-bold transition-colors ${!isAnnual ? "text-rd-cyan" : "text-on-surface-variant"}`}>
              Faturamento Mensal
            </span>

            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isAnnual ? "bg-rd-cyan" : "bg-zinc-700"}`}
              title="Alternar entre mensal e anual"
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isAnnual ? "translate-x-8" : "translate-x-0"}`} />
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-sm md:text-base font-bold transition-colors ${isAnnual ? "text-rd-cyan" : "text-on-surface-variant"}`}>
                Faturamento Anual à Vista
              </span>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-emerald-500 text-zinc-950 rounded-full animate-pulse shadow-sm">
                20% OFF
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-on-surface-variant font-medium">
            💡 No plano anual, você ganha 2 meses grátis em todos os módulos!
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES TABS (Textos Aumentados)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "all", label: "Todos os Módulos", count: MODULOS.length },
          { id: "marketing", label: "Marketing & Vendas", count: 1 },
          { id: "fiscal", label: "Fiscal & Contábil", count: 1 },
          { id: "ia", label: "Inteligência Artificial", count: 1 },
          { id: "recepcao", label: "Recepção & Espera", count: 1 },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? "bg-rd-cyan text-zinc-950 border-rd-cyan shadow-md shadow-rd-cyan/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/40 hover:text-on-surface hover:border-rd-cyan/40"
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODULES GRID (Fontes Maiores & Layout Confortável)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredModulos.map(modulo => {
          const isActived = activeModules.includes(modulo.id);
          const currentPrice = isAnnual 
            ? Math.round(modulo.annualPrice / 12) 
            : modulo.monthlyPrice;

          return (
            <div 
              key={modulo.id}
              className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                modulo.isPopular 
                  ? "border-rd-cyan/60 bg-gradient-to-b from-surface-container to-surface shadow-rd-cyan/10 ring-1 ring-rd-cyan/30" 
                  : "border-outline-variant/50 bg-surface hover:border-rd-cyan/40"
              }`}
            >
              {modulo.isPopular && (
                <div className="bg-gradient-to-r from-rd-cyan to-indigo-600 text-zinc-950 text-xs md:text-sm font-extrabold uppercase tracking-widest text-center py-2 shadow-sm">
                  ⭐ Módulo Recomendado para Alto Faturamento
                </div>
              )}

              <div className="p-6 md:p-8 space-y-6 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${modulo.badgeColor}`}>
                      {modulo.badge}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-on-surface mt-2">
                      {modulo.name}
                    </h2>
                    <p className="text-sm md:text-base text-on-surface-variant font-medium mt-1 leading-relaxed">
                      {modulo.shortDesc}
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center shrink-0 text-rd-cyan shadow-sm">
                    {modulo.id === "marketing-crm" && <MessageSquare size={28} />}
                    {modulo.id === "emissor-fiscal" && <Receipt size={28} />}
                    {modulo.id === "ai-scribe" && <Mic size={28} />}
                    {modulo.id === "painel-tv" && <Tv size={28} />}
                  </div>
                </div>

                {/* Preço */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                      {isAnnual ? "Equivalente no Plano Anual" : "Assinatura Mensal"}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl md:text-4xl font-heading font-extrabold text-on-surface">
                        R$ {currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm md:text-base text-on-surface-variant font-bold">/ mês</span>
                    </div>
                  </div>

                  {isAnnual ? (
                    <div className="text-right">
                      <span className="text-xs md:text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Economize R$ {(modulo.monthlyPrice * 12 - modulo.annualPrice).toLocaleString("pt-BR")}
                      </span>
                      <p className="text-xs text-on-surface-variant font-mono mt-1">
                        R$ {modulo.annualPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / ano à vista
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-on-surface-variant">
                      Sem fidelidade
                    </span>
                  )}
                </div>

                {/* Seletor de Tiers (Start vs Pro para Marketing) */}
                {modulo.tierOptions && modulo.tierOptions.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="text-xs md:text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                      <Sliders size={15} className="text-rd-cyan" />
                      Escolha o Nível de Automação:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modulo.tierOptions.map((tier, idx) => {
                        const isSelected = (activeTierSelection[modulo.id] ?? 1) === idx;
                        return (
                          <button
                            key={tier.name}
                            onClick={() => setActiveTierSelection(prev => ({ ...prev, [modulo.id]: idx }))}
                            className={`p-3.5 rounded-xl text-left border transition-all ${
                              isSelected
                                ? "bg-rd-cyan/15 border-rd-cyan text-on-surface shadow-sm"
                                : "bg-surface-container border-outline-variant/40 text-on-surface-variant hover:border-rd-cyan/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-on-surface">{tier.name}</span>
                              <span className="text-sm font-extrabold text-rd-cyan">R$ {tier.price}/mês</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{tier.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Features Checklist */}
                <div className="space-y-3">
                  <p className="text-xs md:text-sm font-bold text-on-surface uppercase tracking-wider">
                    O que está incluso neste módulo:
                  </p>
                  <ul className="space-y-2.5">
                    {modulo.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant leading-relaxed">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={13} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Argumento de Venda / Citação de ROI */}
                {modulo.roiQuote && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex gap-3.5 items-start">
                    <TrendingUp size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                        Argumento de Retorno sobre o Investimento:
                      </span>
                      <p className="text-sm text-on-surface italic mt-1 leading-relaxed font-medium">
                        "{modulo.roiQuote}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-6 md:p-8 bg-surface-container-low/60 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  {isActived ? (
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Módulo Ativo na sua Conta
                    </span>
                  ) : (
                    <span className="text-sm text-on-surface-variant font-medium">
                      Ativação imediata no painel
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {isActived ? (
                    <Link
                      href={modulo.targetHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rd-cyan text-zinc-950 font-heading font-bold text-sm hover:bg-rd-cyan/90 transition-all shadow-md active:scale-95"
                    >
                      Acessar Módulo <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(modulo)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rd-cyan text-zinc-950 font-heading font-bold text-sm hover:bg-rd-cyan/90 transition-all shadow-md active:scale-95 group"
                    >
                      <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                      Ativar Módulo (7 dias grátis)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          INTERACTIVE ROI CALCULATOR (Textos Aumentados)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-rd-cyan/40 bg-gradient-to-br from-surface to-surface-container p-6 md:p-10 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs md:text-sm font-bold text-rd-cyan uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={16} /> Calculadora Interativa de Retorno
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-on-surface mt-1">
              Quanto o Módulo de Marketing Automático colocará no seu caixa?
            </h3>
            <p className="text-sm md:text-base text-on-surface-variant font-medium mt-1">
              Simule a recuperação de pacientes inativos (faltas, retorno de 180 dias e lembretes de aniversário).
            </p>
          </div>

          <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest block">ROI Estimado</span>
            <span className="text-2xl md:text-3xl font-heading font-extrabold">+{roiCalculado}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Sliders de Alta Visibilidade */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Slider 1: Consultas por Mês */}
            <div className="p-5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/60 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center text-sm md:text-base font-bold">
                <span className="text-on-surface">Consultas ou Procedimentos Atendidos por Mês</span>
                <span className="px-3.5 py-1 rounded-xl bg-rd-cyan/15 text-rd-cyan font-mono font-bold text-base md:text-lg border border-rd-cyan/40 shadow-sm">
                  {consultasMes} atendimentos
                </span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={consultasMes}
                  onChange={e => setConsultasMes(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #00A9FF 0%, #00A9FF ${percentConsultas}%, ${theme === 'dark' ? '#27272a' : '#cbd5e1'} ${percentConsultas}%, ${theme === 'dark' ? '#27272a' : '#cbd5e1'} 100%)`
                  }}
                  className="w-full h-3.5 rounded-full appearance-none cursor-pointer accent-rd-cyan border-2 border-zinc-500/80 shadow-inner focus:outline-none transition-all"
                />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-mono font-bold">
                <span>30 / mês</span>
                <span>250 / mês</span>
                <span>500 / mês</span>
              </div>
            </div>

            {/* Slider 2: Valor Médio */}
            <div className="p-5 rounded-2xl bg-surface-container-high/60 border border-outline-variant/60 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center text-sm md:text-base font-bold">
                <span className="text-on-surface">Valor Médio da Consulta ou Procedimento</span>
                <span className="px-3.5 py-1 rounded-xl bg-rd-cyan/15 text-rd-cyan font-mono font-bold text-base md:text-lg border border-rd-cyan/40 shadow-sm">
                  R$ {ticketMedio}
                </span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="50"
                  value={ticketMedio}
                  onChange={e => setTicketMedio(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #00A9FF 0%, #00A9FF ${percentTicket}%, ${theme === 'dark' ? '#27272a' : '#cbd5e1'} ${percentTicket}%, ${theme === 'dark' ? '#27272a' : '#cbd5e1'} 100%)`
                  }}
                  className="w-full h-3.5 rounded-full appearance-none cursor-pointer accent-rd-cyan border-2 border-zinc-500/80 shadow-inner focus:outline-none transition-all"
                />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-mono font-bold">
                <span>R$ 100</span>
                <span>R$ 1.200</span>
                <span>R$ 2.500</span>
              </div>
            </div>

          </div>

          {/* Resultado do ROI */}
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Pacientes Resgatados (apenas ~4%)
              </span>
              <p className="text-xl md:text-2xl font-heading font-extrabold text-on-surface mt-1">
                {pacientesResgatados} pacientes / mês
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Novo Faturamento Mensal Recuperado
              </span>
              <p className="text-2xl md:text-3xl font-heading font-extrabold text-emerald-500 mt-1">
                +R$ {faturamentoRecuperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Custo do Módulo:</span>
              <span className="font-mono font-bold text-on-surface">R$ {custoMarketing.toFixed(2)}/mês</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-center">
              <span className="text-xs font-bold uppercase tracking-widest block">Lucro Líquido no Caixa</span>
              <span className="text-xl md:text-2xl font-heading font-extrabold mt-1 block">
                +R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / mês
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ SECTION (Textos Maiores e Mais Legíveis)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-outline-variant/50 bg-surface p-6 md:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <HelpCircle size={28} className="text-rd-cyan mx-auto" />
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-on-surface">
            Perguntas Frequentes sobre os Módulos Extras
          </h3>
          <p className="text-sm md:text-base text-on-surface-variant">
            Tire suas dúvidas sobre a contratação, forma de pagamento e ativação.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5">
          {[
            {
              q: "Posso cancelar os módulos quando quiser?",
              a: "Sim! Não existe nenhuma fidelidade ou contrato de permanência. Você pode ativar, pausar ou cancelar qualquer módulo extra a qualquer momento diretamente pelo painel administrativo."
            },
            {
              q: "Como funciona a garantia de 7 dias grátis?",
              a: "Ao contratar qualquer módulo, você tem 7 dias completos para testar na rotina real da sua clínica. Se por qualquer motivo você não perceber o retorno financeiro, basta cancelar em 1 clique sem cobrança."
            },
            {
              q: "Preciso pagar taxa de instalação ou treinamento?",
              a: "Não! Todos os módulos do MEDCore são 100% plug & play, com tutoriais guiados em vídeo. Além disso, você tem direito ao nosso suporte prioritário via WhatsApp para qualquer dúvida."
            },
            {
              q: "Como o Módulo de Marketing dispara no WhatsApp sem ser bloqueado?",
              a: "O motor do MEDCore implementa pausas humanas inteligentes (intervalo de 10 a 25 segundos entre mensagens), rotação de copies e personalização com variáveis (nome do paciente, procedimento e médico), respeitando integralmente as diretrizes do WhatsApp."
            }
          ].map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i}
                className="border border-outline-variant/40 rounded-2xl overflow-hidden bg-surface-container transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm md:text-base font-bold text-on-surface hover:text-rd-cyan transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm md:text-base text-on-surface-variant font-medium leading-relaxed border-t border-outline-variant/20 pt-3.5 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE CHECKOUT / ATIVAÇÃO (Textos Aumentados)
      ═══════════════════════════════════════════════════════════════ */}
      {checkoutModule && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-outline-variant/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 bg-surface-container border-b border-outline-variant/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rd-cyan">Checkout Seguro</span>
                <h3 className="text-xl font-heading font-bold text-on-surface mt-0.5">
                  Ativar {checkoutModule.name}
                </h3>
              </div>
              <button 
                onClick={() => setCheckoutModule(null)}
                className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Resumo do Pedido */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-on-surface">Plano Selecionado:</span>
                  <span className="text-sm font-bold text-rd-cyan">
                    {isAnnual ? "Anual com 20% OFF" : "Mensal Recorrente"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/30">
                  <span className="text-base font-bold text-on-surface">Total da Assinatura:</span>
                  <div className="text-right">
                    <span className="text-2xl font-heading font-extrabold text-on-surface">
                      R$ {(isAnnual ? checkoutModule.annualPrice : checkoutModule.monthlyPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-on-surface-variant block mt-0.5">
                      {isAnnual ? "cobrado anualmente (2 meses grátis)" : "cobrado a cada 30 dias"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-3">
                <label className="text-xs md:text-sm font-bold text-on-surface uppercase tracking-wider">
                  Forma de Pagamento:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCheckoutPaymentMethod("card")}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      checkoutPaymentMethod === "card"
                        ? "border-rd-cyan bg-rd-cyan/10 text-on-surface shadow-sm"
                        : "border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-rd-cyan/30"
                    }`}
                  >
                    <CreditCard size={20} className="text-rd-cyan shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Cartão de Crédito</p>
                      <p className="text-xs text-on-surface-variant">Ativação Instantânea</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCheckoutPaymentMethod("pix")}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      checkoutPaymentMethod === "pix"
                        ? "border-rd-cyan bg-rd-cyan/10 text-on-surface shadow-sm"
                        : "border-outline-variant/40 bg-surface-container text-on-surface-variant hover:border-rd-cyan/30"
                    }`}
                  >
                    <QrCode size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">PIX Instantâneo</p>
                      <p className="text-xs text-on-surface-variant">Confirmação em 5s</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Detalhes do Pagamento */}
              {checkoutPaymentMethod === "card" ? (
                <div className="space-y-3.5 p-4 rounded-2xl bg-surface-container border border-outline-variant/40">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface">Número do Cartão</label>
                    <input 
                      type="text" 
                      placeholder="•••• •••• •••• 4242"
                      defaultValue="•••• •••• •••• 5849"
                      className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono text-on-surface outline-none focus:border-rd-cyan"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">Validade</label>
                      <input 
                        type="text" 
                        placeholder="MM/AA"
                        defaultValue="12/29"
                        className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono text-on-surface outline-none focus:border-rd-cyan"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface">CVV</label>
                      <input 
                        type="password" 
                        placeholder="123"
                        defaultValue="842"
                        className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono text-on-surface outline-none focus:border-rd-cyan"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-3.5 text-center">
                  <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl flex items-center justify-center border shadow-sm">
                    {/* QR Code Simulado */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-zinc-950 rounded-lg">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`rounded-[2px] ${i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-transparent"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={copyPixKey}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    {pixCopied ? <Check size={16} /> : <QrCode size={16} />}
                    {pixCopied ? "Código Copiado!" : "Copiar Código PIX Copia e Cola"}
                  </button>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Abra o app do seu banco e pague com o QR Code. A liberação do módulo é automática.
                  </p>
                </div>
              )}

              {/* Informações de Garantia */}
              <div className="flex items-center gap-2.5 text-xs md:text-sm text-on-surface-variant">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                <span>Primeiros 7 dias sem compromisso. Cancele com 1 clique antes da cobrança.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-surface-container border-t border-outline-variant/40 flex items-center justify-between gap-3">
              <button
                onClick={() => setCheckoutModule(null)}
                className="px-5 py-3 rounded-xl border border-outline-variant/60 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Voltar
              </button>

              <button
                onClick={handleConfirmActivation}
                disabled={isActivating}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rd-cyan text-zinc-950 font-heading font-bold text-sm hover:bg-rd-cyan/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isActivating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    Ativando Módulo na Nuvem...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Confirmar Ativação (7 dias grátis)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE SUCESSO DE ATIVAÇÃO
      ═══════════════════════════════════════════════════════════════ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-emerald-500/40 rounded-3xl w-full max-w-md shadow-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
              <Check size={36} strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-emerald-500">Parabéns!</span>
              <h3 className="text-2xl font-heading font-bold text-on-surface">
                Módulo Ativado com Sucesso!
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                Os recursos já estão liberados e integrados à sua clínica. Você pode começar a usar imediatamente sem nenhuma configuração adicional.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/40 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                <Zap size={16} className="text-amber-500" />
                Status: Operacional e Ativo
              </div>
              <p className="text-xs text-on-surface-variant">
                Seus 7 dias gratuitos começam hoje. Enviamos a confirmação e nota para o seu e-mail corporativo.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/dashboard/marketing"
                onClick={() => setShowSuccessModal(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rd-cyan text-zinc-950 font-heading font-bold text-sm hover:bg-rd-cyan/90 transition-all shadow-md"
              >
                Ir para o Módulo de Marketing <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Permanecer na Loja de Módulos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
