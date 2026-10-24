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
  category: "marketing" | "fiscal" | "ia" | "recepcao" | "hardware";
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
    name: "Dra. Conte Marketing & WhatsApp 24/7",
    category: "marketing",
    badge: "HABILIDADE MAIS ATIVADA",
    badgeColor: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    isPopular: true,
    shortDesc: "Disparos no WhatsApp 24/7, régua de pós-consulta, resgate de faltas e IA Copywriter médica.",
    longDesc: "A Dra. Conte assume o relacionamento com seus pacientes: confirma consultas, resgata quem faltou, envia lembretes preventivos de 180 dias e sugere pacotes de estética no momento ideal.",
    monthlyPrice: 97,
    annualPrice: 990,
    features: [
      "Disparos automáticos WhatsApp 24/7 sem intervenção manual",
      "Régua de pós-consulta e pesquisa de satisfação NPS automática",
      "Resgate ativo de pacientes ausentes e faltosos (recuperação de receita)",
      "Lembrete inteligente de retorno preventivo (180 dias)",
      "Dra. Conte AI Copywriter para campanhas de saúde e estética",
      "Conexão simplificada via QR Code ou WhatsApp Direct gratuito"
    ],
    roiQuote: "Uma única consulta resgatada ou procedimento estético de R$ 350 recuperado pela Dra. Conte já paga o módulo do ano inteiro!",
    targetHref: "/dashboard/marketing",
    tierOptions: [
      {
        name: "Habilidade Start (Envio Assistido)",
        price: 49,
        desc: "Ideal para secretárias que desejam templates prontos e envio ágil.",
        features: [
          "Envio via WhatsApp Direct assistido pela Dra. Conte",
          "Templates médicos de alta conversão",
          "Segmentador básico de pacientes"
        ]
      },
      {
        name: "Habilidade PRO Automação 24/7 (Recomendado)",
        price: 97,
        desc: "A Dra. Conte executa disparos 100% no piloto automático dia e noite.",
        features: [
          "Automação 24/7 sem operador humano",
          "Resgate ativo de no-show e pós-consulta",
          "Dra. Conte AI Copywriter ilimitado",
          "Conexão por QR Code contínua"
        ]
      }
    ]
  },
  {
    id: "ai-scribe",
    name: "Dra. Conte Medical AI (AI Scribe Clínico)",
    category: "ia",
    badge: "EXCLUSIVO PARA MÉDICOS",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    isPopular: true,
    shortDesc: "Escuta médica da consulta e preenchimento automático do prontuário no padrão SOAP.",
    longDesc: "Devolva o olho no olho com o paciente. A Dra. Conte ouve o atendimento com consentimento, extrai a anamnese, hipóteses diagnósticas e conduta e preenche o prontuário em segundos.",
    monthlyPrice: 147,
    annualPrice: 1490,
    features: [
      "Escuta médica inteligente e precisa em terminologias clínicas",
      "Estruturação automática instantânea no formato SOAP",
      "Sugestão inteligente de hipóteses e códigos CID-10",
      "Integração direta com o Prontuário Eletrônico do MedCore",
      "Economia comprovada de até 2 horas de digitação por dia de consultório",
      "Conformidade rigorosa com normas CFM e LGPD"
    ],
    roiQuote: "Médicos terminam seus atendimentos sem pilhas de prontuários pendentes e com mais tempo de qualidade para cada paciente.",
    targetHref: "/dashboard/prontuario"
  },
  {
    id: "emissor-fiscal",
    name: "Dra. Conte Fiscal & DMED Automático",
    category: "fiscal",
    badge: "BLINDAGEM TRIBUTÁRIA",
    badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    shortDesc: "Emissão de NFS-e na baixa de pagamento e relatório DMED automático para a Receita.",
    longDesc: "Elimine o estresse fiscal no fechamento do mês. As notas fiscais são geradas assim que o paciente paga, com envio imediato de PDF e XML no WhatsApp.",
    monthlyPrice: 67,
    annualPrice: 680,
    features: [
      "Emissão automática de NFS-e na baixa de consultas ou procedimentos",
      "Envio direto do PDF e XML no WhatsApp e e-mail do paciente",
      "Relatório DMED da Receita Federal pronto em 1 clique",
      "Compatível com mais de 1.500 cidades e municípios brasileiros",
      "Armazenamento seguro em nuvem por 5 anos com garantia fiscal"
    ],
    roiQuote: "Economize até 20 horas mensais da recepção e proteja a clínica médica de cair na malha fina da Receita Federal.",
    targetHref: "/dashboard/notas-fiscais"
  },
  {
    id: "kit-totem",
    name: "Dra. Conte Ponto & Totem Facial (Portaria 671)",
    category: "hardware",
    badge: "HARDWARE HOMOLOGADO",
    badgeColor: "bg-rd-cyan/15 text-rd-cyan border-rd-cyan/30",
    shortDesc: "Tablet Totem Kiosk com reconhecimento facial anti-fraude e integração imediata com folha.",
    longDesc: "Kit plug & play homologado pelo Ministério do Trabalho (Portaria MTP 671). O colaborador aproxima o rosto na entrada da clínica e o ponto é computado com segurança jurídica total.",
    monthlyPrice: 119,
    annualPrice: 1190,
    features: [
      "Tablet Samsung Corporativo 8.7\" com app de Ponto Kiosk bloqueado",
      "Suporte articulado de parede em aço com chave anti-furto",
      "Biometria facial com máscara anti-fraude em conformidade LGPD",
      "Classificação REP-P: dispensa autorização prévia de sindicato",
      "Garantia com substituição expressa e suporte técnico prioritário"
    ],
    roiQuote: "Blindagem definitiva contra passivos trabalhistas com custo muito inferior a um relógio de ponto tradicional com bobina.",
    targetHref: "/dashboard/ponto"
  },
  {
    id: "painel-tv",
    name: "Dra. Conte Painel TV (Chamada Humanizada)",
    category: "recepcao",
    badge: "SALA DE ESPERA",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    shortDesc: "Display inteligente e chamada de pacientes por voz neural nos consultórios.",
    longDesc: "Modernize a recepção da clínica exibindo vídeos institucionais, orientações de saúde e chamadas por voz neural personalizadas na Smart TV.",
    monthlyPrice: 47,
    annualPrice: 470,
    features: [
      "Chamada de pacientes com voz sintetizada em português",
      "Personalização total com logotipo e cores da sua clínica",
      "Exibição simultânea de vídeos de procedimentos e notícias",
      "Compatível com Smart TVs Samsung, LG, Android TV e Fire Stick",
      "Acionamento direto pelo médico ou recepção em 1 clique"
    ],
    roiQuote: "Acabe com aglomerações e gritos de nomes na recepção, transmitindo sofisticação imediata aos pacientes.",
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
  // Todos os módulos e skills adicionais liberados e ativos por padrão para teste total
  const ALL_MODULE_IDS = ["marketing-crm", "ai-scribe", "emissor-fiscal", "kit-totem", "painel-tv"];
  const [activeModules, setActiveModules] = useState<string[]>(ALL_MODULE_IDS);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  // Sincronizar com localStorage para garantir persistência contínua
  React.useEffect(() => {
    try {
      localStorage.setItem("medcore_active_store_modules", JSON.stringify(ALL_MODULE_IDS));
    } catch (e) {}
  }, []);

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
            Habilidades Oficiais da Dra. Conte (Skills de IA & Operação)
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-on-surface tracking-tight leading-tight">
            Acople superpoderes à sua clínica com as <span className="text-rd-cyan underline decoration-rd-cyan/40 decoration-wavy underline-offset-4">Habilidades da Dra. Conte</span>
          </h1>

          <p className="text-base md:text-lg text-on-surface-variant font-medium leading-relaxed">
            Habilite inteligências e recursos especializados prontos para sua equipe médica e administrativa: 
            automação WhatsApp 24/7, prontuário por escuta médica SOAP, emissão fiscal com DMED e totem facial homologado.
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
          { id: "hardware", label: "Hardware & Totens", count: MODULOS.filter(m => m.category === "hardware").length },
          { id: "marketing", label: "Marketing & Vendas", count: MODULOS.filter(m => m.category === "marketing").length },
          { id: "fiscal", label: "Fiscal & Contábil", count: MODULOS.filter(m => m.category === "fiscal").length },
          { id: "ia", label: "Inteligência Artificial", count: MODULOS.filter(m => m.category === "ia").length },
          { id: "recepcao", label: "Recepção & Espera", count: MODULOS.filter(m => m.category === "recepcao").length },
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
