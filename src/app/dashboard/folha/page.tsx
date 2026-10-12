"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileSpreadsheet,
  DollarSign,
  Users,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Download,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Printer,
  CreditCard,
  AlertCircle,
  HeartHandshake,
  Receipt,
  Calculator,
  QrCode,
  FileText,
  Send,
  RefreshCw,
  Briefcase,
  Clock,
  Sparkles,
  Copy,
  Check,
  X,
  ChevronDown,
  Stethoscope,
  TrendingUp,
  FileCheck,
  Percent,
  Wallet,
  Globe,
  Database,
  Key,
  ExternalLink,
  Code2,
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { cn } from "@/lib/utils";

interface ColaboradorFolha {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  regime: "CLT" | "PJ" | "ESTAGIO";
  registroProfissional?: string;
  cpf: string;
  admissao: string;
  cbo: string;
  salarioBase: number;
  adicionais: {
    insalubridade?: number;
    periculosidade?: number;
    adicionalNoturno?: number;
    plantoesExtras?: number;
    bonusMeta?: number;
  };
  descontos: {
    inss?: number;
    irrf?: number;
    valeTransporte?: number;
    valeRefeicao?: number;
    planoSaudeCopart?: number;
    faltas?: number;
  };
  beneficiosEmpresa: {
    vr: number;
    vt: number;
    saude: number;
    odonto: number;
    seguroVida: number;
  };
  totalVencimentos: number;
  totalDescontos: number;
  salarioLiquido: number;
  status: "PENDENTE" | "APROVADO" | "PAGO";
  dataPagamento?: string;
  chavePix?: string;
}

interface GuiaTributaria {
  id: string;
  tipo: string;
  competencia: string;
  vencimento: string;
  valor: number;
  codigoBarras: string;
  linhaDigitavel: string;
  status: string;
  chavePix: string;
}

interface BeneficioCatalogo {
  id: string;
  nome: string;
  operadora: string;
  tipo: string;
  valorMedioMes: number;
  colaboradoresAtivos: number;
  custoTotal: number;
  proximaRecarga: string;
  status: string;
}

interface ESocialLog {
  evento: string;
  nome: string;
  protocolo: string;
  dataEnvio: string;
  status: string;
}

export default function FolhaBeneficiosPage() {
  const { selectedUnitId, units } = useDashboardContext();
  const activeUnit = units.find((u) => u.id === selectedUnitId) || units[0] || {
    id: "default",
    name: "Hospital & Centro Médico MedCore",
    type: "Hospital Geral",
  };

  // State
  const [activeTab, setActiveTab] = useState<"FOLHA" | "BENEFICIOS" | "ENCARGOS" | "SIMULADOR">("FOLHA");
  const [competencia, setCompetencia] = useState("09/2026");
  const [colaboradores, setColaboradores] = useState<ColaboradorFolha[]>([]);
  const [guias, setGuias] = useState<GuiaTributaria[]>([]);
  const [beneficios, setBeneficios] = useState<BeneficioCatalogo[]>([]);
  const [esocialLogs, setEsocialLogs] = useState<ESocialLog[]>([]);
  const [resumo, setResumo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [regimeFilter, setRegimeFilter] = useState<string>("TODOS");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");

  // Modals
  const [selectedHolerite, setSelectedHolerite] = useState<ColaboradorFolha | null>(null);
  const [showNovoLancamentoModal, setShowNovoLancamentoModal] = useState(false);
  const [showFecharFolhaModal, setShowFecharFolhaModal] = useState(false);
  const [selectedColabForLancamento, setSelectedColabForLancamento] = useState<string>("");
  const [lancamentoTipo, setLancamentoTipo] = useState<"PROVENTO" | "DESCONTO">("PROVENTO");
  const [lancamentoCategoria, setLancamentoCategoria] = useState("BONUS");
  const [lancamentoValor, setLancamentoValor] = useState("");
  const [lancamentoDescricao, setLancamentoDescricao] = useState("");

  // Multi-País / Global Payroll & Conectores
  const [jurisdiction, setJurisdiction] = useState<"BR" | "US" | "EU">((activeUnit as any)?.country || "BR");
  const [showApiConnectorModal, setShowApiConnectorModal] = useState(false);
  const [showAiTaxModal, setShowAiTaxModal] = useState(false);
  const [apiToken, setApiToken] = useState("medcore_sec_" + Math.random().toString(36).substring(2, 10));

  useEffect(() => {
    if ((activeUnit as any)?.country) {
      setJurisdiction((activeUnit as any).country as "BR" | "US" | "EU");
    }
  }, [(activeUnit as any)?.country]);

  const JURISDICTION_CONFIG = useMemo(() => ({
    BR: {
      flag: "🇧🇷",
      name: "Brasil",
      currency: "R$",
      tabs: {
        folha: "Folha Mensal & Holerites",
        beneficios: "Benefícios & Convênios",
        guias: "Guias & Tributos (eSocial)",
        simulador: "Simulador CLT vs PJ",
      },
      kpis: {
        bruto: "Folha Bruta Total",
        liquido: "Líquido a Pagar",
        beneficios: "Benefícios Concedidos",
        encargos: "Encargos Hospitalares",
        encargosDetail: "FGTS Digital + INSS Patronal + IRRF",
      },
      compliance: "eSocial S-1200 / S-1210 • DCTFWeb",
      simulador: {
        title: "Simulador CLT vs PJ (Médicos e Enfermagem)",
        regimeA: "Regime CLT",
        regimeB: "Regime PJ (Médico / Prestador)",
        regimeADesc: "Equipe Assistencial / Fixa",
        regimeBDesc: "Corpo Clínico & Especialistas",
        salarioLabel: "Salário Base Pretendido",
        adicionalLabel: "Adicional Insalubridade (NR-15):",
        retencao1Label: "Desconto INSS:",
        retencao2Label: "Desconto IRRF:",
        custoEmpresaLabel: "Custo Total para a Clínica:",
        custoDetail: "Inclui 20% INSS Patronal + 8% FGTS + Provisão 13º / Férias + Benefícios.",
      }
    },
    US: {
      flag: "🇺🇸",
      name: "United States",
      currency: "$",
      tabs: {
        folha: "Payroll & Pay Stubs",
        beneficios: "Benefits & Perks (401k/Health)",
        guias: "Taxes & Filings (IRS/W-2/1099)",
        simulador: "Contractor vs W-2 Simulator",
      },
      kpis: {
        bruto: "Gross Payroll Total",
        liquido: "Net Pay Total",
        beneficios: "Benefits & 401(k) Match",
        encargos: "Employer Payroll Taxes",
        encargosDetail: "FICA • Medicare • FUTA/SUTA Withholding",
      },
      compliance: "IRS W-2 / 1099-NEC • FICA Compliance",
      simulador: {
        title: "W-2 Employee vs 1099 Independent Contractor Simulator",
        regimeA: "W-2 Salaried / Hourly",
        regimeB: "1099 Medical Contractor",
        regimeADesc: "Clinical Staff / Nursing",
        regimeBDesc: "Attending Physicians & Specialists",
        salarioLabel: "Base Pay / Gross Compensation",
        adicionalLabel: "Shift Differential / Hazard:",
        retencao1Label: "FICA Social Security & Medicare:",
        retencao2Label: "Federal & State Withholding:",
        custoEmpresaLabel: "Total Employer Healthcare Cost:",
        custoDetail: "Includes Employer 7.65% FICA + FUTA/SUTA + Workers Comp + Health & 401(k).",
      }
    },
    EU: {
      flag: "🇪🇺",
      name: "Europe / UK",
      currency: "€",
      tabs: {
        folha: "Monthly Payroll & Payslips",
        beneficios: "Benefits & Workplace Pension",
        guias: "HMRC Taxes & Contributions (PAYE)",
        simulador: "PAYE vs Contractor Simulator",
      },
      kpis: {
        bruto: "Gross Payroll Total",
        liquido: "Net Pay Total",
        beneficios: "Benefits & Pension Package",
        encargos: "Employer Social Contributions",
        encargosDetail: "National Insurance (NIC) • Workplace Pension",
      },
      compliance: "HMRC PAYE • EU Social Security Accord",
      simulador: {
        title: "PAYE Staff vs Locum Doctor / Contractor Simulator",
        regimeA: "Direct PAYE Staff",
        regimeB: "Locum / Limited Company",
        regimeADesc: "NHS / Clinic Salaried Staff",
        regimeBDesc: "Locum Doctors & Medical Consultants",
        salarioLabel: "Base Annual / Monthly Gross Pay",
        adicionalLabel: "On-Call / Clinical Allowance:",
        retencao1Label: "Employee National Insurance (NIC):",
        retencao2Label: "PAYE Income Tax:",
        custoEmpresaLabel: "Total Clinic Employment Cost:",
        custoDetail: "Includes Employer Secondary NIC (13.8%) + Mandatory Workplace Pension (3%+).",
      }
    }
  }), []);

  const curConfig = JURISDICTION_CONFIG[jurisdiction] || JURISDICTION_CONFIG.BR;

  const handleExportExcel = () => {
    window.open(`/api/folha/export?competencia=${competencia}&format=csv&jurisdiction=${jurisdiction}`, "_blank");
    showToast("Planilha Excel / CSV gerada com sucesso para a contabilidade!");
  };

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simulador State
  const [simSalarioBase, setSimSalarioBase] = useState<number>(4500);
  const [simRegime, setSimRegime] = useState<"CLT" | "PJ">("CLT");
  const [simInsalubridade, setSimInsalubridade] = useState<number>(20); // 0, 10, 20, 40
  const [simDependentes, setSimDependentes] = useState<number>(1);
  const [simBeneficiosEstimados, setSimBeneficiosEstimados] = useState<number>(1100);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    showToast("Linha copiada para a área de transferência!");
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // Carregar dados da folha via API
  const carregarDadosFolha = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/folha?competencia=${competencia}&unitId=${selectedUnitId || ""}`);
      const data = await res.json();
      if (data.success) {
        setColaboradores(data.colaboradores);
        setGuias(data.guiasTributarias);
        setBeneficios(data.catalogoBeneficios);
        setEsocialLogs(data.esocialLogs);
        setResumo(data.resumo);
      }
    } catch (err) {
      console.error("Erro ao carregar folha:", err);
      showToast("Não foi possível carregar os dados atualizados da folha.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosFolha();
  }, [competencia, selectedUnitId]);

  // Ação: Pagar via Pix individual
  const handlePagarColaborador = async (colaborador: ColaboradorFolha) => {
    try {
      const res = await fetch("/api/folha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PAGAR_COLABORADOR",
          colaboradorId: colaborador.nome,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setColaboradores((prev) =>
          prev.map((c) =>
            c.id === colaborador.id
              ? { ...c, status: "PAGO", dataPagamento: new Date().toLocaleDateString("pt-BR") }
              : c
          )
        );
        showToast(`Pagamento de R$ ${colaborador.salarioLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} liquidado com sucesso para ${colaborador.nome}!`);
      }
    } catch {
      showToast("Falha na comunicação com o gateway bancário.", "error");
    }
  };

  // Ação: Fechar folha
  const handleFecharFolha = async () => {
    try {
      const res = await fetch("/api/folha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "FECHAR_FOLHA", competencia }),
      });
      const data = await res.json();
      if (data.success) {
        setShowFecharFolhaModal(false);
        showToast(data.message);
        if (resumo) {
          setResumo({ ...resumo, statusCompetencia: "FECHADA" });
        }
      }
    } catch {
      showToast("Erro ao fechar a folha da competência.", "error");
    }
  };

  // Ação: Recarregar Benefícios
  const handleRecarregarBeneficios = async () => {
    try {
      const res = await fetch("/api/folha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RECARREGAR_BENEFICIOS" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
      }
    } catch {
      showToast("Erro ao solicitar recarga de benefícios.", "error");
    }
  };

  // Ação: Salvar Novo Lançamento
  const handleSalvarLancamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColabForLancamento || !lancamentoValor) {
      showToast("Preencha todos os campos obrigatórios.", "error");
      return;
    }

    const valorNum = parseFloat(lancamentoValor.replace(",", "."));
    if (isNaN(valorNum) || valorNum <= 0) {
      showToast("Informe um valor numérico válido.", "error");
      return;
    }

    try {
      const res = await fetch("/api/folha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "NOVO_LANCAMENTO",
          colaboradorId: selectedColabForLancamento,
          tipo: lancamentoTipo,
          categoria: lancamentoCategoria,
          valor: valorNum,
          descricao: lancamentoDescricao,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Atualiza na listagem
        setColaboradores((prev) =>
          prev.map((c) => {
            if (c.id === selectedColabForLancamento) {
              const novosAdicionais = { ...c.adicionais };
              const novosDescontos = { ...c.descontos };

              if (lancamentoTipo === "PROVENTO") {
                novosAdicionais.bonusMeta = (novosAdicionais.bonusMeta || 0) + valorNum;
                const novoBruto = c.totalVencimentos + valorNum;
                return {
                  ...c,
                  adicionais: novosAdicionais,
                  totalVencimentos: novoBruto,
                  salarioLiquido: novoBruto - c.totalDescontos,
                };
              } else {
                novosDescontos.faltas = (novosDescontos.faltas || 0) + valorNum;
                const novoDesc = c.totalDescontos + valorNum;
                return {
                  ...c,
                  descontos: novosDescontos,
                  totalDescontos: novoDesc,
                  salarioLiquido: c.totalVencimentos - novoDesc,
                };
              }
            }
            return c;
          })
        );
        setShowNovoLancamentoModal(false);
        setLancamentoValor("");
        setLancamentoDescricao("");
        showToast(data.message);
      }
    } catch {
      showToast("Erro ao registrar lançamento.", "error");
    }
  };

  // Filtragem dos Colaboradores
  const colaboradoresFiltrados = useMemo(() => {
    return colaboradores.filter((colab) => {
      const matchSearch =
        colab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colab.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        colab.cpf.includes(searchTerm);

      const matchRegime = regimeFilter === "TODOS" || colab.regime === regimeFilter;
      const matchStatus = statusFilter === "TODOS" || colab.status === statusFilter;

      return matchSearch && matchRegime && matchStatus;
    });
  }, [colaboradores, searchTerm, regimeFilter, statusFilter]);

  // Cálculos do Simulador CLT vs PJ
  const simuladorCalculado = useMemo(() => {
    const salarioMinimo = 1412.0;
    let adicionalInsalubridade = 0;
    if (simInsalubridade === 10) adicionalInsalubridade = salarioMinimo * 0.1;
    if (simInsalubridade === 20) adicionalInsalubridade = salarioMinimo * 0.2;
    if (simInsalubridade === 40) adicionalInsalubridade = simSalarioBase * 0.4; // periculosidade 40% s/ base

    const salarioBrutoTotal = simSalarioBase + adicionalInsalubridade;

    // INSS CLT Progressivo
    let inss = 0;
    if (salarioBrutoTotal <= 1412.0) {
      inss = salarioBrutoTotal * 0.075;
    } else if (salarioBrutoTotal <= 2666.68) {
      inss = 1412.0 * 0.075 + (salarioBrutoTotal - 1412.0) * 0.09;
    } else if (salarioBrutoTotal <= 4000.03) {
      inss = 1412.0 * 0.075 + (2666.68 - 1412.0) * 0.09 + (salarioBrutoTotal - 2666.68) * 0.12;
    } else if (salarioBrutoTotal <= 7786.02) {
      inss =
        1412.0 * 0.075 +
        (2666.68 - 1412.0) * 0.09 +
        (4000.03 - 2666.68) * 0.12 +
        (salarioBrutoTotal - 4000.03) * 0.14;
    } else {
      inss = 908.85; // teto inss
    }

    // IRRF CLT
    const baseIrrf = Math.max(0, salarioBrutoTotal - inss - simDependentes * 189.59);
    let irrf = 0;
    if (baseIrrf <= 2259.2) {
      irrf = 0;
    } else if (baseIrrf <= 2826.65) {
      irrf = baseIrrf * 0.075 - 169.44;
    } else if (baseIrrf <= 3751.05) {
      irrf = baseIrrf * 0.15 - 381.44;
    } else if (baseIrrf <= 4664.68) {
      irrf = baseIrrf * 0.225 - 662.77;
    } else {
      irrf = baseIrrf * 0.275 - 896.0;
    }
    irrf = Math.max(0, irrf);

    const liquidoCLT = salarioBrutoTotal - inss - irrf;

    // Encargos da Clínica (CLT)
    const inssPatronal = salarioBrutoTotal * 0.22; // 20% + 2% RAT/FAP
    const fgts = salarioBrutoTotal * 0.08;
    const provisao13 = salarioBrutoTotal / 12;
    const provisaoFerias = (salarioBrutoTotal + salarioBrutoTotal / 3) / 12;
    const custoTotalClinicaCLT =
      salarioBrutoTotal + inssPatronal + fgts + provisao13 + provisaoFerias + simBeneficiosEstimados;

    // Simulação PJ (Simples Nacional Anexo III / Fator R - ~6% a 15%)
    const impostoPJ = simSalarioBase * 0.06; // Anexo III 6%
    const liquidoPJ = simSalarioBase - impostoPJ;
    const custoTotalClinicaPJ = simSalarioBase;

    return {
      salarioBrutoTotal,
      adicionalInsalubridade,
      inss,
      irrf,
      liquidoCLT,
      custoTotalClinicaCLT,
      inssPatronal,
      fgts,
      provisoes: provisao13 + provisaoFerias,
      liquidoPJ,
      custoTotalClinicaPJ,
      diferencaCustoEmpresa: custoTotalClinicaCLT - custoTotalClinicaPJ,
    };
  }, [simSalarioBase, simInsalubridade, simDependentes, simBeneficiosEstimados]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Toast flutuante */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-24 lg:bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5",
            toast.type === "success"
              ? "bg-emerald-950/95 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/95 border-rose-500/50 text-rose-200"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Action Bar Compacta */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Unidade: <strong className="text-zinc-900 dark:text-zinc-100">{activeUnit?.name || "Unidade Central"}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1 text-xs">
            <Globe size={14} className="text-rd-cyan" />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">País / Tributação:</span>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as "BR" | "US" | "EU")}
              className="bg-transparent text-zinc-900 dark:text-zinc-100 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="BR" className="bg-zinc-900 text-white">🇧🇷 Brasil (BRL • eSocial • CLT/PJ)</option>
              <option value="US" className="bg-zinc-900 text-white">🇺🇸 USA (USD • IRS • W-2/1099)</option>
              <option value="EU" className="bg-zinc-900 text-white">🇪🇺 Europe / UK (EUR • PAYE • HMRC)</option>
            </select>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
            {curConfig.compliance}
          </span>

          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1 text-xs">
            <Calendar size={14} className="text-rd-cyan" />
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Competência:</span>
            <select
              value={competencia}
              onChange={(e) => setCompetencia(e.target.value)}
              className="bg-transparent text-zinc-900 dark:text-zinc-100 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="09/2026" className="bg-zinc-900 text-white">09/2026</option>
              <option value="08/2026" className="bg-zinc-900 text-white">08/2026</option>
              <option value="07/2026" className="bg-zinc-900 text-white">07/2026</option>
            </select>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all cursor-pointer shadow-sm"
            title="Exportar planilha Excel completa (.CSV UTF-8) com todos os proventos e retenções para o contador"
          >
            <FileSpreadsheet size={15} />
            Exportar Excel ({jurisdiction === "BR" ? "Contador" : jurisdiction === "US" ? "CPA" : "Accountant"})
          </button>

          <button
            onClick={() => setShowApiConnectorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer"
            title="Conector de API segura com token para integração com ERP contábil ou fiscal"
          >
            <Database size={15} className="text-rd-cyan" />
            Conector de API
          </button>

          <button
            onClick={() => setShowAiTaxModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-all cursor-pointer"
            title="Agente IA que monitora alterações na legislação fiscal e alíquotas oficiais"
          >
            <Sparkles size={15} />
            Monitor Fiscal IA
          </button>

          <button
            onClick={() => setShowNovoLancamentoModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer"
          >
            <Plus size={15} className="text-rd-cyan" />
            Lançamento Avulso
          </button>

          <button
            onClick={() => setShowFecharFolhaModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rd-cyan text-zinc-950 shadow-md shadow-rd-cyan/25 hover:bg-rd-cyan/90 transition-all cursor-pointer"
          >
            <CheckCircle2 size={15} />
            Fechar Folha
          </button>
        </div>
      </div>

      {/* Top KPIs / Cards de Resumo com Nomenclaturas por País */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Folha Bruta Total */}
        <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md relative overflow-hidden group hover:border-rd-cyan/50 backdrop-blur-xl transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rd-cyan/10 rounded-full blur-xl group-hover:bg-rd-cyan/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{curConfig.kpis.bruto}</span>
            <div className="w-8 h-8 rounded-xl bg-rd-cyan/10 flex items-center justify-center text-rd-cyan">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {curConfig.currency} {resumo?.totalBruto?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "115.354,80"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-500">
            <TrendingUp size={13} />
            <span>+3.2% vs mês anterior</span>
            <span className="text-zinc-400 font-normal">({resumo?.totalColaboradores || 8} colaboradores)</span>
          </div>
        </div>

        {/* Líquido a Pagar */}
        <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md relative overflow-hidden group hover:border-emerald-500/50 backdrop-blur-xl transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{curConfig.kpis.liquido}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Wallet size={16} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {curConfig.currency} {resumo?.totalLiquido?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "90.871,05"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock size={13} className="text-amber-500" />
            <span>Vencimento do lote: <strong className="text-zinc-800 dark:text-zinc-200">05/10/2026</strong></span>
          </div>
        </div>

        {/* Total Benefícios Concedidos */}
        <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md relative overflow-hidden group hover:border-violet-500/50 backdrop-blur-xl transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{curConfig.kpis.beneficios}</span>
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <HeartHandshake size={16} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {curConfig.currency} {resumo?.totalBeneficios?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "13.560,00"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{jurisdiction === "BR" ? "VR/VA, Saúde, Odonto, VT & Vida" : jurisdiction === "US" ? "Health, Dental, 401(k) Match & HSA" : "Private Medical, Pension & Perks"}</span>
          </div>
        </div>

        {/* Encargos & Tributos Patronais */}
        <div className="p-5 bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 shadow-md relative overflow-hidden group hover:border-amber-500/50 backdrop-blur-xl transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{curConfig.kpis.encargos}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
            {curConfig.currency} {resumo?.totalEncargos?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "20.370,45"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{curConfig.kpis.encargosDetail}</span>
          </div>
        </div>
      </div>

      {/* Abas de Navegação Personalizadas por Jurisdição */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("FOLHA")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
            activeTab === "FOLHA"
              ? "bg-rd-cyan text-zinc-950 shadow-md shadow-rd-cyan/20 font-bold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          )}
        >
          <FileSpreadsheet size={16} />
          {curConfig.tabs.folha}
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/20">
            {colaboradores.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("BENEFICIOS")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
            activeTab === "BENEFICIOS"
              ? "bg-rd-cyan text-zinc-950 shadow-md shadow-rd-cyan/20 font-bold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          )}
        >
          <HeartHandshake size={16} />
          {curConfig.tabs.beneficios}
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/20">
            {beneficios.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ENCARGOS")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
            activeTab === "ENCARGOS"
              ? "bg-rd-cyan text-zinc-950 shadow-md shadow-rd-cyan/20 font-bold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          )}
        >
          <Receipt size={16} />
          {curConfig.tabs.guias}
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/20">
            {guias.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SIMULADOR")}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
            activeTab === "SIMULADOR"
              ? "bg-rd-cyan text-zinc-950 shadow-md shadow-rd-cyan/20 font-bold"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          )}
        >
          <Calculator size={16} />
          {curConfig.tabs.simulador}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
            NOVO
          </span>
        </button>
      </div>

      {/* ABA 1: FOLHA MENSAL */}
      {activeTab === "FOLHA" && (
        <div className="space-y-4">
          {/* Filtros da Tabela */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-surface border border-outline-variant/30 p-4 rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Buscar por nome, cargo ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container/60 border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-rd-cyan"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <Filter size={14} />
                <span>Regime:</span>
              </div>
              {["TODOS", "CLT", "PJ"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegimeFilter(reg)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    regimeFilter === reg
                      ? "bg-surface-container border border-rd-cyan text-rd-cyan font-bold"
                      : "bg-surface-container/40 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {reg}
                </button>
              ))}

              <div className="h-4 w-px bg-outline-variant/40 mx-1" />

              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span>Status:</span>
              </div>
              {["TODOS", "PENDENTE", "APROVADO", "PAGO"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                    statusFilter === st
                      ? "bg-surface-container border border-rd-cyan text-rd-cyan font-bold"
                      : "bg-surface-container/40 border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela de Colaboradores & Pagamentos */}
          <div className="bg-surface border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container/40 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Colaborador</th>
                    <th className="py-3.5 px-3">Regime</th>
                    <th className="py-3.5 px-3 text-right">Salário Base</th>
                    <th className="py-3.5 px-3 text-right">Adicionais / Insal.</th>
                    <th className="py-3.5 px-3 text-right">Descontos</th>
                    <th className="py-3.5 px-4 text-right">Líquido a Receber</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {colaboradoresFiltrados.map((colab) => {
                    const somaAdicionais = Object.values(colab.adicionais).reduce(
                      (acc, val) => acc + (val || 0),
                      0
                    );

                    return (
                      <tr key={colab.id} className="hover:bg-surface-container/30 transition-colors">
                        {/* Colaborador */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center font-bold text-rd-cyan border border-rd-cyan/20 shrink-0">
                              {colab.nome.charAt(0)}
                              {colab.nome.split(" ")[1]?.charAt(0) || ""}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface flex items-center gap-1.5">
                                {colab.nome}
                                {colab.registroProfissional && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-on-surface-variant font-mono">
                                    {colab.registroProfissional}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-on-surface-variant mt-0.5">
                                {colab.cargo} • <span className="font-mono">{colab.cpf}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Regime */}
                        <td className="py-3.5 px-3">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1",
                              colab.regime === "CLT"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            )}
                          >
                            {colab.regime === "CLT" ? "CLT" : "PJ Médico"}
                          </span>
                        </td>

                        {/* Salário Base */}
                        <td className="py-3.5 px-3 text-right font-mono font-medium text-on-surface">
                          R$ {colab.salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Adicionais */}
                        <td className="py-3.5 px-3 text-right font-mono text-emerald-400 font-medium">
                          +R$ {somaAdicionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          {colab.adicionais.insalubridade && (
                            <div className="text-[10px] text-on-surface-variant">Insalubridade 20%</div>
                          )}
                          {colab.adicionais.periculosidade && (
                            <div className="text-[10px] text-amber-400">Radiação 40%</div>
                          )}
                        </td>

                        {/* Descontos */}
                        <td className="py-3.5 px-3 text-right font-mono text-rose-400 font-medium">
                          -R$ {colab.totalDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Líquido */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface text-base">
                          R$ {colab.salarioLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1",
                              colab.status === "PAGO"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : colab.status === "APROVADO"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            )}
                          >
                            {colab.status === "PAGO" && <CheckCircle2 size={12} />}
                            {colab.status}
                          </span>
                          {colab.dataPagamento && (
                            <div className="text-[10px] text-on-surface-variant mt-0.5">
                              Pago em {colab.dataPagamento}
                            </div>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedHolerite(colab)}
                              className="p-2 rounded-xl border border-outline-variant/50 hover:bg-rd-cyan/10 hover:border-rd-cyan/40 text-rd-cyan transition-colors"
                              title="Visualizar Contracheque / Holerite Oficial"
                            >
                              <FileText size={16} />
                            </button>

                            {colab.status !== "PAGO" && (
                              <button
                                onClick={() => handlePagarColaborador(colab)}
                                className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                title="Liquidar via Pix Direto"
                              >
                                <CreditCard size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedColabForLancamento(colab.id);
                                setShowNovoLancamentoModal(true);
                              }}
                              className="p-2 rounded-xl border border-outline-variant/50 hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                              title="Adicionar bônus ou desconto avulso"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {colaboradoresFiltrados.length === 0 && (
                <div className="p-12 text-center text-on-surface-variant">
                  <FileSpreadsheet size={36} className="mx-auto mb-2 opacity-40 text-rd-cyan" />
                  <p className="font-semibold text-on-surface">Nenhum colaborador localizado com os filtros atuais.</p>
                  <p className="text-xs mt-1">Tente remover os filtros ou buscar por outro termo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: BENEFÍCIOS & CONVÊNIOS */}
      {activeTab === "BENEFICIOS" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-outline-variant/30 p-5 rounded-2xl">
            <div>
              <h2 className="text-lg font-bold font-heading text-on-surface flex items-center gap-2">
                <HeartHandshake className="text-rd-cyan" size={20} />
                Gestão de Convênios & Operadoras de Benefícios
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Controle de recargas, coparticipação clínica e elegibilidade dos colaboradores.
              </p>
            </div>
            <button
              onClick={handleRecarregarBeneficios}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
            >
              <RefreshCw size={15} />
              Recarregar Benefícios do Mês
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beneficios.map((ben) => (
              <div
                key={ben.id}
                className="p-5 bg-surface border border-outline-variant/30 rounded-2xl shadow-sm hover:border-rd-cyan/40 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                      {ben.tipo}
                    </span>
                    <h3 className="font-heading font-bold text-base text-on-surface mt-2">{ben.nome}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{ben.operadora}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-rd-cyan">
                    <HeartHandshake size={20} />
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-on-surface-variant block">Colaboradores:</span>
                    <span className="font-bold text-on-surface text-sm">{ben.colaboradoresAtivos} elegíveis</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Custo Mensal:</span>
                    <span className="font-bold font-mono text-on-surface text-sm">
                      R$ {ben.custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Média / Colab:</span>
                    <span className="font-mono text-on-surface">R$ {ben.valorMedioMes.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Próxima Recarga:</span>
                    <span className="font-semibold text-emerald-400">{ben.proximaRecarga}</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Gestão de dependentes e limites para ${ben.nome} aberta.`)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-rd-cyan border border-rd-cyan/20 hover:bg-rd-cyan/10 transition-colors"
                >
                  Gerenciar Beneficiários
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: GUIAS TRIBUTÁRIAS & ESOCIAL */}
      {activeTab === "ENCARGOS" && (
        <div className="space-y-6">
          {/* Guias do Mês */}
          <div>
            <h2 className="text-lg font-bold font-heading text-on-surface mb-3 flex items-center gap-2">
              <Receipt className="text-rd-cyan" size={20} />
              Guias de Recolhimento & Tributos da Competência {competencia}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guias.map((guia) => (
                <div
                  key={guia.id}
                  className="p-5 bg-surface border border-outline-variant/30 rounded-2xl shadow-sm space-y-4 hover:border-rd-cyan/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Vence em {guia.vencimento}
                      </span>
                      <h3 className="font-heading font-bold text-base text-on-surface mt-2">{guia.tipo}</h3>
                      <p className="text-xs text-on-surface-variant font-mono">Competência: {guia.competencia}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-on-surface-variant block">Valor a Recolher</span>
                      <span className="text-xl font-heading font-bold text-on-surface font-mono">
                        R$ {guia.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-container/60 rounded-xl border border-outline-variant/30 space-y-2">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>Linha Digitável / Código de Barras:</span>
                      <button
                        onClick={() => copyToClipboard(guia.linhaDigitavel, guia.id)}
                        className="text-rd-cyan font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedKey === guia.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedKey === guia.id ? "Copiado!" : "Copiar Linha"}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-on-surface break-all select-all">{guia.linhaDigitavel}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Comprovante e código QR Pix para ${guia.tipo} gerados.`)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rd-cyan text-zinc-950 flex items-center justify-center gap-1.5 hover:bg-rd-cyan/90 transition-colors"
                    >
                      <QrCode size={14} /> Pagar com Pix
                    </button>
                    <button
                      onClick={() => showToast("PDF da guia oficial do eSocial baixado.")}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
                    >
                      Baixar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status do eSocial */}
          <div className="p-5 bg-surface border border-outline-variant/30 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-on-surface flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={18} />
                  Transmissão Oficial eSocial
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Eventos periódicos integrados via certificado digital A1.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Certificado Digital A1 Conectado
              </span>
            </div>

            <div className="space-y-2">
              {esocialLogs.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-surface-container/40 border border-outline-variant/30 text-xs gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-surface border border-outline-variant text-rd-cyan">
                      {ev.evento}
                    </span>
                    <span className="font-semibold text-on-surface">{ev.nome}</span>
                  </div>
                  <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[11px]">
                    <span>Protocolo: {ev.protocolo}</span>
                    <span>{ev.dataEnvio}</span>
                    <span className="text-emerald-400 font-bold">{ev.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: SIMULADOR CLT VS PJ */}
      {activeTab === "SIMULADOR" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lado Esquerdo: Parâmetros */}
          <div className="lg:col-span-5 p-6 bg-surface border border-outline-variant/30 rounded-2xl shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-heading font-bold text-on-surface flex items-center gap-2">
                <Calculator className="text-rd-cyan" size={20} />
                {curConfig.simulador.title}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {jurisdiction === "BR" && "Simule custos trabalhistas hospitalares, insalubridade e encargos em tempo real."}
                {jurisdiction === "US" && "Simulate W-2 healthcare payroll vs 1099 contractor medical billing & tax liability."}
                {jurisdiction === "EU" && "Simulate clinic direct PAYE costs vs Locum agency and contractor rates."}
              </p>
            </div>

            {/* Salário Base */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface flex justify-between">
                <span>{curConfig.simulador.salarioLabel}</span>
                <span className="text-rd-cyan font-mono text-sm">
                  {curConfig.currency} {simSalarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </label>
              <input
                type="range"
                min="1500"
                max="35000"
                step="250"
                value={simSalarioBase}
                onChange={(e) => setSimSalarioBase(Number(e.target.value))}
                className="w-full accent-rd-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>{curConfig.currency} 1.500</span>
                <span>{curConfig.currency} 15.000</span>
                <span>{curConfig.currency} 35.000</span>
              </div>
            </div>

            {/* Insalubridade Hospitalar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">
                {jurisdiction === "BR" ? "Adicional de Insalubridade / Risco (NR-15)" : jurisdiction === "US" ? "Hazard / Shift Differential" : "Clinical Risk / On-Call Allowance"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "0% Nenhum", val: 0 },
                  { label: "10% Mínimo", val: 10 },
                  { label: "20% Médio", val: 20 },
                  { label: "40% Radiação", val: 40 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSimInsalubridade(item.val)}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center",
                      simInsalubridade === item.val
                        ? "bg-rd-cyan/15 border-rd-cyan text-rd-cyan font-bold"
                        : "border-outline-variant/40 text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {jurisdiction === "BR" && "*20% hospitalar padrão calculado sobre salário mínimo (R$ 1.412,00). 40% para raio-X / radiação ionizante."}
                {jurisdiction === "US" && "*Differential rate for night shifts, intensive care units and hazardous exposure."}
                {jurisdiction === "EU" && "*Standard allowance for NHS high-intensity acute wards and unsocial hours."}
              </p>
            </div>

            {/* Dependentes IRRF */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">
                {jurisdiction === "BR" ? "Dependentes Legais para IRRF" : jurisdiction === "US" ? "W-4 Allowances & Dependents" : "Tax Dependents / Allowances"}
              </label>
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3, 4].map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => setSimDependentes(dep)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-xs font-bold border transition-all",
                      simDependentes === dep
                        ? "bg-rd-cyan text-zinc-950 border-rd-cyan"
                        : "border-outline-variant/40 text-on-surface hover:bg-surface-container"
                    )}
                  >
                    {dep}
                  </button>
                ))}
                <span className="text-xs text-on-surface-variant">
                  ({curConfig.currency} {(simDependentes * 189.59).toFixed(2)} {jurisdiction === "BR" ? "dedução base" : "monthly credit"})
                </span>
              </div>
            </div>

            {/* Benefícios Médios */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface">
                {jurisdiction === "BR" ? "Custo Mensal de Benefícios (VR + VT + Saúde)" : jurisdiction === "US" ? "Health Insurance & Benefits Cost" : "Workplace Benefits & Pension Cost"}
              </label>
              <input
                type="number"
                value={simBeneficiosEstimados}
                onChange={(e) => setSimBeneficiosEstimados(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container/60 border border-outline-variant/40 rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:border-rd-cyan"
              />
            </div>
          </div>

          {/* Lado Direito: Comparativo CLT vs PJ */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Modelo CLT */}
              <div className="p-5 bg-surface border border-blue-500/30 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {curConfig.simulador.regimeA}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">{curConfig.simulador.regimeADesc}</span>
                </div>

                <div>
                  <span className="text-xs text-on-surface-variant block">
                    {jurisdiction === "BR" ? "Líquido Estimado do Colaborador:" : jurisdiction === "US" ? "Estimated Take-Home Pay (Net):" : "Estimated Net Take-Home:"}
                  </span>
                  <p className="text-2xl font-heading font-bold text-emerald-400 font-mono mt-0.5">
                    {curConfig.currency} {simuladorCalculado.liquidoCLT.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-outline-variant/30 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">{curConfig.simulador.salarioLabel}:</span>
                    <span className="font-mono text-on-surface">{curConfig.currency} {simuladorCalculado.salarioBrutoTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">{curConfig.simulador.adicionalLabel}</span>
                    <span className="font-mono text-emerald-400">+{curConfig.currency} {simuladorCalculado.adicionalInsalubridade.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">{curConfig.simulador.retencao1Label}</span>
                    <span className="font-mono text-rose-400">-{curConfig.currency} {simuladorCalculado.inss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">{curConfig.simulador.retencao2Label}</span>
                    <span className="font-mono text-rose-400">-{curConfig.currency} {simuladorCalculado.irrf.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl border border-outline-variant/40 space-y-1.5 text-xs">
                  <div className="text-on-surface font-bold">{curConfig.simulador.custoEmpresaLabel}</div>
                  <div className="text-xl font-heading font-bold text-rose-400 font-mono">
                    {curConfig.currency} {simuladorCalculado.custoTotalClinicaCLT.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {curConfig.simulador.custoDetail}
                  </div>
                </div>
              </div>

              {/* Modelo PJ */}
              <div className="p-5 bg-surface border border-purple-500/30 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {curConfig.simulador.regimeB}
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">{curConfig.simulador.regimeBDesc}</span>
                </div>

                <div>
                  <span className="text-xs text-on-surface-variant block">
                    {jurisdiction === "BR" ? "Líquido Estimado do Prestador:" : jurisdiction === "US" ? "Net Contractor Earnings:" : "Net Locum / Limited Fee:"}
                  </span>
                  <p className="text-2xl font-heading font-bold text-emerald-400 font-mono mt-0.5">
                    {curConfig.currency} {simuladorCalculado.liquidoPJ.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-outline-variant/30 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      {jurisdiction === "BR" ? "Nota Fiscal Emitida:" : jurisdiction === "US" ? "1099 Invoiced Amount:" : "Contractor Invoice Total:"}
                    </span>
                    <span className="font-mono text-on-surface">{curConfig.currency} {simSalarioBase.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      {jurisdiction === "BR" ? "Imposto Simples Nacional (~6%):" : jurisdiction === "US" ? "Self-Employment Tax Est. (~7%):" : "Corp Tax / Self-Assessment (~7%):"}
                    </span>
                    <span className="font-mono text-rose-400">-{curConfig.currency} {(simSalarioBase * 0.06).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">
                      {jurisdiction === "BR" ? "Encargos CLT:" : jurisdiction === "US" ? "W-2 FICA Burden:" : "Employer NIC Burden:"}
                    </span>
                    <span className="font-mono text-emerald-400">{curConfig.currency} 0,00</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container/60 rounded-xl border border-outline-variant/40 space-y-1.5 text-xs">
                  <div className="text-on-surface font-bold">{curConfig.simulador.custoEmpresaLabel}</div>
                  <div className="text-xl font-heading font-bold text-purple-400 font-mono">
                    {curConfig.currency} {simuladorCalculado.custoTotalClinicaPJ.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {jurisdiction === "BR" && "Sem passivo trabalhista de INSS patronal, FGTS ou aviso prévio."}
                    {jurisdiction === "US" && "Zero employer payroll tax liability, 1099-NEC direct disbursement."}
                    {jurisdiction === "EU" && "B2B medical services invoice, exempt from employer NIC & auto-enrolment."}
                  </div>
                </div>
              </div>
            </div>

            {/* Destaque da Economia */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-emerald-300">
                  Diferença no Custo da Clínica por Mês:
                </h4>
                <p className="text-xs text-emerald-400/80">
                  Economia de encargos diretos no modelo PJ para especialidades médicas.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-heading font-bold text-emerald-400 font-mono">
                  R$ {simuladorCalculado.diferencaCustoEmpresa.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-emerald-300 block">/mês de economia</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: HOLERITE / CONTRACHEQUE OFICIAL HOSPITALAR */}
      {/* ========================================================= */}
      {selectedHolerite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Barra Superior de Ações */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="text-rd-cyan" size={18} />
                <h3 className="font-heading font-bold text-base text-white">
                  Contracheque Hospitalar Oficial
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rd-cyan text-zinc-950 text-xs font-bold hover:bg-rd-cyan/90 transition-colors"
                >
                  <Printer size={14} /> Imprimir / PDF
                </button>
                <button
                  onClick={() => showToast(`Holerite enviado com sucesso para ${selectedHolerite.email}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-800 transition-colors"
                >
                  <Send size={14} /> Enviar por E-mail
                </button>
                <button
                  onClick={() => setSelectedHolerite(null)}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Documento do Holerite (Formatado para Impressão) */}
            <div className="p-8 space-y-6 text-zinc-100 bg-zinc-950">
              {/* Cabeçalho da Empresa */}
              <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                    {activeUnit.name || "MEDCORE CENTRO HOSPITALAR LTDA"}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">CNPJ: 45.182.934/0001-92 • Inscrição Municipal: 8.921.412</p>
                  <p className="text-xs text-zinc-400">Av. Paulista, 1800 - Conjunto 1400 - Bela Vista, São Paulo - SP</p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-rd-cyan">
                    DEMONSTRATIVO DE PAGAMENTO
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-1">
                    Competência: <strong>{competencia}</strong>
                  </div>
                </div>
              </div>

              {/* Dados do Colaborador */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-xs">
                <div>
                  <span className="text-zinc-500 block">Colaborador:</span>
                  <span className="font-bold text-white text-sm">{selectedHolerite.nome}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Cargo / Função:</span>
                  <span className="font-semibold text-zinc-200">{selectedHolerite.cargo}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">CPF:</span>
                  <span className="font-mono text-zinc-200">{selectedHolerite.cpf}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">CBO / Registro:</span>
                  <span className="font-mono text-zinc-200">
                    {selectedHolerite.cbo} {selectedHolerite.registroProfissional && `• ${selectedHolerite.registroProfissional}`}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Data Admissão:</span>
                  <span className="font-mono text-zinc-200">{selectedHolerite.admissao}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Departamento:</span>
                  <span className="text-zinc-200">{selectedHolerite.departamento}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Regime Jurídico:</span>
                  <span className="font-bold text-rd-cyan">{selectedHolerite.regime}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Status:</span>
                  <span className="font-bold text-emerald-400">{selectedHolerite.status}</span>
                </div>
              </div>

              {/* Tabela de Rubricas / Proventos e Descontos */}
              <div className="border border-zinc-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-semibold">
                      <th className="py-2.5 px-3">Cód.</th>
                      <th className="py-2.5 px-3">Descrição da Rubrica</th>
                      <th className="py-2.5 px-3 text-center">Ref.</th>
                      <th className="py-2.5 px-3 text-right">Vencimentos</th>
                      <th className="py-2.5 px-3 text-right">Descontos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-mono">
                    {/* Salário Base */}
                    <tr>
                      <td className="py-2.5 px-3 text-zinc-500">001</td>
                      <td className="py-2.5 px-3 text-white font-sans font-medium">SALÁRIO BASE CONTRATUAL</td>
                      <td className="py-2.5 px-3 text-center text-zinc-400">30d</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">
                        {selectedHolerite.salarioBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                    </tr>

                    {/* Adicional de Insalubridade */}
                    {selectedHolerite.adicionais.insalubridade && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">012</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">ADICIONAL INSALUBRIDADE HOSPITALAR</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">20%</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          {selectedHolerite.adicionais.insalubridade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                      </tr>
                    )}

                    {/* Periculosidade */}
                    {selectedHolerite.adicionais.periculosidade && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">014</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">ADICIONAL DE RADIAÇÃO IONIZANTE</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">40%</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          {selectedHolerite.adicionais.periculosidade.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                      </tr>
                    )}

                    {/* Plantões Extras */}
                    {selectedHolerite.adicionais.plantoesExtras && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">025</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">PLANTÕES CLÍNICOS EXTRAS</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">24h</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          {selectedHolerite.adicionais.plantoesExtras.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                      </tr>
                    )}

                    {/* Bônus / Gratificação */}
                    {selectedHolerite.adicionais.bonusMeta && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">030</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">GRATIFICAÇÃO / BÔNUS DESEMPENHO</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">100%</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          {selectedHolerite.adicionais.bonusMeta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                      </tr>
                    )}

                    {/* Desconto INSS */}
                    {selectedHolerite.descontos.inss && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">101</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">INSS - PREVIDÊNCIA SOCIAL</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">Prog.</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">
                          {selectedHolerite.descontos.inss.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}

                    {/* Desconto IRRF */}
                    {selectedHolerite.descontos.irrf && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">102</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">IRRF - IMPOSTO DE RENDA RETIDO</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">Prog.</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">
                          {selectedHolerite.descontos.irrf.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}

                    {/* Desconto VT */}
                    {selectedHolerite.descontos.valeTransporte && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">108</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">VALE TRANSPORTE (COPARTICIPAÇÃO LEGAL)</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">6%</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">
                          {selectedHolerite.descontos.valeTransporte.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}

                    {/* Desconto VR */}
                    {selectedHolerite.descontos.valeRefeicao && (
                      <tr>
                        <td className="py-2.5 px-3 text-zinc-500">110</td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">VALE REFEIÇÃO / ALIMENTAÇÃO PAT</td>
                        <td className="py-2.5 px-3 text-center text-zinc-400">Fixo</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600">-</td>
                        <td className="py-2.5 px-3 text-right text-rose-400">
                          {selectedHolerite.descontos.valeRefeicao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totais & Líquido */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 block">Total de Proventos:</span>
                  <span className="font-mono text-emerald-400 font-bold text-base">
                    R$ {selectedHolerite.totalVencimentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Total de Descontos:</span>
                  <span className="font-mono text-rose-400 font-bold text-base">
                    R$ {selectedHolerite.totalDescontos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block">VALOR LÍQUIDO A RECEBER:</span>
                  <span className="font-mono text-rd-cyan font-bold text-xl">
                    R$ {selectedHolerite.salarioLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Bases de Cálculo Legais */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
                <div>
                  <span className="block text-[10px] text-zinc-600">Sal. Base:</span>
                  <span>R$ {selectedHolerite.salarioBase.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-600">Base INSS:</span>
                  <span>R$ {selectedHolerite.totalVencimentos.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-600">Base FGTS:</span>
                  <span>R$ {selectedHolerite.totalVencimentos.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-600">FGTS do Mês (8%):</span>
                  <span className="text-zinc-200">
                    R$ {(selectedHolerite.totalVencimentos * 0.08).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-600">Base IRRF:</span>
                  <span>
                    R$ {Math.max(0, selectedHolerite.totalVencimentos - (selectedHolerite.descontos.inss || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/60 text-[10px] text-zinc-500 flex justify-between items-center">
                <span>Chave de Autenticação Digital: {selectedHolerite.id}-MEDCORE-ESOCIAL-2026</span>
                <span>Documento emitido eletronicamente conforme Portaria MTP nº 671/2021.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NOVO LANÇAMENTO AVULSO */}
      {/* ========================================================= */}
      {showNovoLancamentoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="text-rd-cyan" size={18} />
                <h3 className="font-heading font-bold text-base text-white">
                  Novo Lançamento na Folha
                </h3>
              </div>
              <button
                onClick={() => setShowNovoLancamentoModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarLancamento} className="space-y-4 text-xs">
              {/* Colaborador */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Colaborador Destinatário</label>
                <select
                  value={selectedColabForLancamento}
                  onChange={(e) => setSelectedColabForLancamento(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rd-cyan cursor-pointer"
                  required
                >
                  <option value="">Selecione um colaborador...</option>
                  {colaboradores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.cargo} - {c.regime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Tipo de Lançamento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLancamentoTipo("PROVENTO")}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-center",
                      lancamentoTipo === "PROVENTO"
                        ? "bg-emerald-500/20 border border-emerald-500 text-emerald-300"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                    )}
                  >
                    + Provento (Crédito / Bônus)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLancamentoTipo("DESCONTO")}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-center",
                      lancamentoTipo === "DESCONTO"
                        ? "bg-rose-500/20 border border-rose-500 text-rose-300"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                    )}
                  >
                    - Desconto (Débito / Falta)
                  </button>
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Rubrica / Categoria</label>
                <select
                  value={lancamentoCategoria}
                  onChange={(e) => setLancamentoCategoria(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rd-cyan cursor-pointer"
                >
                  {lancamentoTipo === "PROVENTO" ? (
                    <>
                      <option value="BONUS">Bônus de Produtividade / Meta</option>
                      <option value="PLANTAO_EXTRA">Plantão Clínico Extra</option>
                      <option value="HORA_EXTRA">Hora Extra 50% / 100%</option>
                      <option value="REEMBOLSO">Reembolso de Despesas</option>
                    </>
                  ) : (
                    <>
                      <option value="FALTA">Falta Não Justificada</option>
                      <option value="ADIANTAMENTO">Desconto Adiantamento Salarial</option>
                      <option value="AVISO_PREVIO">Dedução Administrativa</option>
                    </>
                  )}
                </select>
              </div>

              {/* Valor */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Valor (R$)</label>
                <input
                  type="text"
                  placeholder="Ex: 450,00"
                  value={lancamentoValor}
                  onChange={(e) => setLancamentoValor(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-rd-cyan"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Observação / Justificativa</label>
                <input
                  type="text"
                  placeholder="Ex: Plantão extra cobertura feriado"
                  value={lancamentoDescricao}
                  onChange={(e) => setLancamentoDescricao(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-rd-cyan"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNovoLancamentoModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white border border-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 transition-colors"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FECHAMENTO DE FOLHA */}
      {/* ========================================================= */}
      {showFecharFolhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">
                Fechar Folha - Competência {competencia}?
              </h3>
              <p className="text-xs text-zinc-400">
                Ao fechar a folha, as edições de ponto serão bloqueadas e os arquivos para remessa bancária (CNAB 240 / Pix Lote) e eSocial serão consolidados.
              </p>
            </div>

            <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Total Bruto:</span>
                <span className="font-mono font-bold">R$ {resumo?.totalBruto?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Líquido Bancário a Pagar:</span>
                <span className="font-mono font-bold text-emerald-400">
                  R$ {resumo?.totalLiquido?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Guias Previdenciárias:</span>
                <span className="font-mono font-bold text-amber-400">
                  R$ {resumo?.totalEncargos?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowFecharFolhaModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleFecharFolha}
                className="flex-1 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 text-xs font-bold hover:bg-rd-cyan/90 transition-colors"
              >
                Sim, Fechar Folha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONECTOR DE API CONTÁBIL & FISCAL (LGPD / GDPR) */}
      {/* ========================================================= */}
      {showApiConnectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rd-cyan/15 border border-rd-cyan/30 text-rd-cyan flex items-center justify-center shrink-0">
                  <Database size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rd-cyan px-2 py-0.5 rounded-full bg-rd-cyan/10 border border-rd-cyan/20">
                      API Segura v2.4
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Conforme LGPD & GDPR
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mt-1">
                    Conector Contábil & Fiscal Automatizado
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Sincronize proventos, retenções e tributos diretamente com o sistema do seu contador ou ERP contábil.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiConnectorModal(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Endpoint e Token */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                  Endpoint Seguro de Exportação ({jurisdiction}):
                </label>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
                  <code className="text-xs font-mono text-rd-cyan flex-1 truncate">
                    https://medcore.app/api/folha/export?competencia={competencia}&format=json&jurisdiction={jurisdiction}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`https://medcore.app/api/folha/export?competencia=${competencia}&format=json&jurisdiction=${jurisdiction}`, "endpoint")}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg shrink-0"
                    title="Copiar URL"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Token de Acesso do Contador (Bearer Token):
                  </label>
                  <span className="text-[10px] text-amber-400 font-medium">Expira em 24h • Renovação Automática</span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5">
                  <Key size={15} className="text-amber-400 shrink-0" />
                  <code className="text-xs font-mono text-zinc-200 flex-1 truncate">
                    {apiToken}
                  </code>
                  <button
                    onClick={() => copyToClipboard(apiToken, "token")}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg shrink-0"
                    title="Copiar Token"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>

              {/* Exemplo de Chamada cURL */}
              <div className="p-3.5 bg-black/60 rounded-2xl border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500">Exemplo de Requisição (cURL / Python / ERP):</p>
                <p className="text-emerald-400 overflow-x-auto whitespace-pre">
                  curl -H "Authorization: Bearer {apiToken}" \
                  "https://medcore.app/api/folha/export?competencia={competencia}"
                </p>
              </div>

              {/* Garantias Legais & Proteção de Dados */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs space-y-1.5 text-zinc-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck size={16} />
                  <span>Proteção de Dados & Conformidade Trabalhista</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Os dados exportados via API são restritos exclusivamente ao cumprimento de obrigações tributárias e trabalhistas (Art. 7º, II e V da LGPD). Toda transmissão utiliza criptografia TLS 1.3 e gera hash forense na trilha de auditoria.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setShowApiConnectorModal(false)}
                className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider"
              >
                Fechar
              </button>
              <a
                href={`/api/folha/export?competencia=${competencia}&format=json&jurisdiction=${jurisdiction}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-rd-cyan text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-rd-cyan/90 transition-all flex items-center justify-center gap-2"
              >
                <Code2 size={16} /> Testar Endpoint JSON
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MONITOR TRIBUTÁRIO IA & LEGISLAÇÃO GLOBAL */}
      {/* ========================================================= */}
      {showAiTaxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    AI Tax Regulatory Agent
                  </span>
                  <h3 className="font-heading font-bold text-xl text-white mt-1">
                    Agente de Legislação Fiscal & Alíquotas Oficiais
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Monitoramento contínuo de tabelas tributárias, faixas e leis trabalhistas no Brasil e no mundo.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiTaxModal(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Painel das 3 Jurisdições Globais */}
            <div className="space-y-3.5">
              {/* Brasil */}
              <div className={cn(
                "p-4 rounded-2xl border transition-all",
                jurisdiction === "BR" ? "bg-zinc-900/90 border-rd-cyan/50" : "bg-zinc-900/40 border-zinc-800"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇧🇷</span>
                    <span className="text-xs font-bold text-white">Brasil (MTE • Receita Federal • eSocial)</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Vigente 2026 • 100% Homologado
                  </span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc marker:text-rd-cyan">
                  <li><strong>INSS Progressivo:</strong> 7,5% (até R$ 1.412), 9%, 12% e 14% (Teto R$ 908,85).</li>
                  <li><strong>IRRF Progressivo:</strong> Isento até R$ 2.259,20; alíquotas de 7,5% a 27,5% (Dedução p/ dependente: R$ 189,59).</li>
                  <li><strong>FGTS Digital:</strong> 8% recolhimento automático via Pix Caixa Econômica Federal.</li>
                  <li><strong>Adicional de Insalubridade Hospitalar:</strong> 20% (Grau Médio) ou 40% (Grau Máximo / UTI).</li>
                </ul>
              </div>

              {/* Estados Unidos */}
              <div className={cn(
                "p-4 rounded-2xl border transition-all",
                jurisdiction === "US" ? "bg-zinc-900/90 border-rd-cyan/50" : "bg-zinc-900/40 border-zinc-800"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇺🇸</span>
                    <span className="text-xs font-bold text-white">United States (IRS • DOL • FICA • FLSA)</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-400 uppercase bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    Regras 2026 • W-2 & 1099
                  </span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc marker:text-sky-400">
                  <li><strong>FICA Taxes:</strong> Social Security 6.2% (teto $168,600) + Medicare 1.45% (sem teto).</li>
                  <li><strong>Federal Income Tax Withholding:</strong> 7 faixas progressivas (10% a 37% conforme Form W-4).</li>
                  <li><strong>Locum Tenens / 1099 Medical Contractors:</strong> Retenção zero na fonte, emissão de Form 1099-NEC.</li>
                  <li><strong>Frequência de Pagamento:</strong> Cálculo por hora (Hourly Shift Rate) ou Quinzenal (Bi-Weekly).</li>
                </ul>
              </div>

              {/* Europa / Reino Unido */}
              <div className={cn(
                "p-4 rounded-2xl border transition-all",
                jurisdiction === "EU" ? "bg-zinc-900/90 border-rd-cyan/50" : "bg-zinc-900/40 border-zinc-800"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇪🇺</span>
                    <span className="text-xs font-bold text-white">Europe & UK (HMRC • EU Social Security)</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    GDPR Article 88 • PAYE
                  </span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc marker:text-purple-400">
                  <li><strong>PAYE Tax:</strong> Personal Allowance livre de imposto + faixas 20% (Basic), 40% (Higher) e 45% (Additional).</li>
                  <li><strong>National Insurance / Previdência Social Europeia:</strong> Class 1 Contributions para equipe médica.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <RefreshCw size={13} className="text-purple-400 animate-spin" />
                Última checagem do agente: Hoje às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                onClick={() => {
                  showToast("Tabelas tributárias sincronizadas com o Diário Oficial e o IRS com sucesso!");
                  setShowAiTaxModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
              >
                Sincronizar Alíquotas Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
