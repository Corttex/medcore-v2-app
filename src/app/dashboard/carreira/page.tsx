"use client";

import React, { useState, useMemo } from "react";
import { 
  Award, 
  Target, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  Star, 
  ChevronRight, 
  Printer, 
  Download, 
  ArrowUpRight,
  BrainCircuit,
  HeartHandshake,
  Share2,
  X
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

interface CertificadoItem {
  id: string;
  titulo: string;
  categoria: "Produtividade" | "Eficiência" | "Retenção" | "Compliance";
  dataEmissao: string;
  pontos: number;
  emissor: string;
  status: "Emitido" | "Em Progresso";
  descricao: string;
}

export default function CarreiraPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"visao-geral" | "metas" | "certificados" | "impacto">("visao-geral");
  const [selectedCertificado, setSelectedCertificado] = useState<CertificadoItem | null>(null);

  // Perfil dinâmico com fallback elegante
  const colaboradorNome = user?.full_name || "Mariana Silva";
  const colaboradorCargo = user?.cargo || "Secretária Executiva & Concierge";
  const colaboradorUnidade = "Unidade Jardins - SP";

  // KPIs de Produtividade & Desempenho
  const kpiData = {
    taxaConfirmacao: 94.6,
    taxaConfirmacaoMeta: 90.0,
    reducaoNoShow: 68.2, // % de redução de faltas
    tempoMedioResposta: "2.4 min",
    tempoRespostaMeta: "< 5 min",
    pacientesAtendidosMes: 342,
    consultasSalvasMes: 38,
    valorRetidoEstimado: 13300.00, // 38 * R$ 350
    scoreDraConte: 98, // de 100
    nivelMaturidade: "Nível 4 • Especialista Sênior"
  };

  const certificados: CertificadoItem[] = [
    {
      id: "CERT-2026-001",
      titulo: "Especialista em Retenção e Anti-Faltas Dra. Conte",
      categoria: "Retenção",
      dataEmissao: "15/10/2026",
      pontos: 450,
      emissor: "Dra. Conte Intelligence & MedCore Academy",
      status: "Emitido",
      descricao: "Certificação oficial concedida por manter taxa de no-show abaixo de 8% durante 3 meses consecutivos na operação da recepção."
    },
    {
      id: "CERT-2026-002",
      titulo: "Operadora Ágil: SLA de Atendimento Humanizado",
      categoria: "Eficiência",
      dataEmissao: "02/09/2026",
      pontos: 320,
      emissor: "Dra. Conte Intelligence & MedCore Academy",
      status: "Emitido",
      descricao: "Reconhecimento por tempo médio de resposta no WhatsApp inferior a 3 minutos com índice de satisfação NPS 98+."
    },
    {
      id: "CERT-2026-003",
      titulo: "Mestre em Gestão de Agendas Médicas Multiprofissionais",
      categoria: "Produtividade",
      dataEmissao: "20/07/2026",
      pontos: 280,
      emissor: "Dra. Conte Intelligence & MedCore Academy",
      status: "Emitido",
      descricao: "Capacidade comprovada de organização de salas, encaixes inteligentes e aproveitamento de 95% da ociosidade da clínica."
    },
    {
      id: "CERT-2026-004",
      titulo: "Guardiã da Conformidade LGPD & Prontuário Médico",
      categoria: "Compliance",
      dataEmissao: "Previsto para 10/11/2026",
      pontos: 200,
      emissor: "Dra. Conte Intelligence & MedCore Academy",
      status: "Em Progresso",
      descricao: "Trilha prática de segurança da informação, consentimento digital de pacientes e proteção de dados médicos sensíveis."
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ─── Top Header Card ─── */}
      <div className={`p-6 rounded-3xl border-2 relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-zinc-900/80 border-zinc-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]' 
          : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rd-cyan/15 to-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rd-cyan to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-rd-cyan/20">
                {colaboradorNome.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-surface text-white">
                <Sparkles size={12} />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-heading font-bold text-on-surface tracking-tight">
                  {colaboradorNome}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rd-cyan/15 text-rd-cyan border border-rd-cyan/30">
                  {kpiData.nivelMaturidade}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant font-medium mt-0.5">
                {colaboradorCargo} • {colaboradorUnidade}
              </p>
            </div>
          </div>

          {/* Score Dra. Conte Badge */}
          <div className="flex items-center gap-4 bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/50">
            <div className="text-right">
              <p className="text-[10px] font-heading font-semibold uppercase tracking-widest text-on-surface-variant">
                Score Dra. Conte
              </p>
              <p className="text-xl font-bold text-rd-cyan">
                {kpiData.scoreDraConte} <span className="text-xs text-on-surface-variant font-normal">/ 100</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan">
              <BrainCircuit size={24} className="animate-pulse" />
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-outline-variant/30 overflow-x-auto no-scrollbar">
          {[
            { id: "visao-geral", label: "Visão de Performance" },
            { id: "metas", label: "Metas & KPIs do Mês" },
            { id: "certificados", label: "Certificados & Selos" },
            { id: "impacto", label: "Relatório de Impacto Financeiro" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rd-cyan text-zinc-950 shadow-md font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── ABA 1: VISÃO GERAL & CARDS RÁPIDOS ─── */}
      {activeTab === "visao-geral" && (
        <div className="space-y-6">
          {/* Grid de Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading uppercase text-on-surface-variant">Taxa de Confirmação</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><CheckCircle2 size={16} /></span>
              </div>
              <p className="text-2xl font-bold text-emerald-500 mt-2">{kpiData.taxaConfirmacao}%</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Meta mensal: {kpiData.taxaConfirmacaoMeta}% (+4.6% superada)</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading uppercase text-on-surface-variant">Redução de No-Show</span>
                <span className="p-2 rounded-xl bg-rd-cyan/10 text-rd-cyan"><TrendingUp size={16} /></span>
              </div>
              <p className="text-2xl font-bold text-rd-cyan mt-2">{kpiData.reducaoNoShow}%</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Comparado à média do setor</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading uppercase text-on-surface-variant">Velocidade de Resposta</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400"><Clock size={16} /></span>
              </div>
              <p className="text-2xl font-bold text-on-surface mt-2">{kpiData.tempoMedioResposta}</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Meta: {kpiData.tempoRespostaMeta}</p>
            </div>

            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading uppercase text-on-surface-variant">Valor Retido no Mês</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><DollarSign size={16} /></span>
              </div>
              <p className="text-2xl font-bold text-amber-500 mt-2">
                {kpiData.valorRetidoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1">38 consultas salvas de faltas</p>
            </div>
          </div>

          {/* Destaque Dra. Conte Feedback */}
          <div className={`p-6 rounded-2xl border-2 border-rd-cyan/30 bg-gradient-to-r from-rd-cyan/10 via-indigo-600/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rd-cyan/20 border border-rd-cyan/40 text-rd-cyan rounded-2xl shrink-0">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold text-on-surface">
                  Parecer da Dra. Conte sobre seu Desempenho
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  &quot;Mariana demonstrou agilidade exemplar no reagendamento de desistências nos períodos da manhã. Sua postura pró-ativa recuperou R$ 13.300 em consultas que seriam perdidas pela clínica neste ciclo.&quot;
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab("impacto")}
              className="px-4 py-2 bg-rd-cyan text-zinc-950 font-heading text-xs font-bold rounded-xl shrink-0 hover:bg-rd-cyan/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              Ver Detalhes do Impacto <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ─── ABA 2: METAS & KPIS ─── */}
      {activeTab === "metas" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <h3 className="text-base font-heading font-bold text-on-surface mb-4 flex items-center gap-2">
              <Target className="text-rd-cyan" size={18} /> Metas Operacionais de Outubro
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface">Taxa de Confirmação Prévia</span>
                  <span className="text-emerald-500 font-bold">{kpiData.taxaConfirmacao}% / 90%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(kpiData.taxaConfirmacao, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface">Redução de No-Show (Faltas)</span>
                  <span className="text-rd-cyan font-bold">{kpiData.reducaoNoShow}% atingido</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-rd-cyan rounded-full" style={{ width: `${Math.min(kpiData.reducaoNoShow, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface">Tempo de Resposta ao Paciente</span>
                  <span className="text-indigo-400 font-bold">2.4 min (Excelente)</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface">Preenchimento de Cadastros Completos</span>
                  <span className="text-amber-500 font-bold">96% / 95%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <h3 className="text-base font-heading font-bold text-on-surface mb-4 flex items-center gap-2">
              <Star className="text-amber-500" size={18} /> Reconhecimento & Benefícios de Desempenho
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Bônus por Retenção Superada</p>
                  <p className="text-on-surface-variant">Elegível ao bônus trimestral por manter no-show abaixo de 10%.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Selo de Excelência Dra. Conte 2026</p>
                  <p className="text-on-surface-variant">Conquista do selo oficial para inclusão no LinkedIn e currículo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <CheckCircle2 className="text-rd-cyan shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Acesso à Trilha de Gestão de Clínicas</p>
                  <p className="text-on-surface-variant">Bolsa liberada para o curso executivo de liderança em recepção médica.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── ABA 3: CERTIFICADOS & SELOS ─── */}
      {activeTab === "certificados" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-heading font-bold text-on-surface">
                Certificações Oficiais Dra. Conte
              </h2>
              <p className="text-xs text-on-surface-variant">
                Comprovantes auditáveis de competência e capacitação prática na gestão da saúde.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-rd-cyan/15 text-rd-cyan border border-rd-cyan/30 text-xs font-bold">
              3 Certificados Ativos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificados.map((cert) => (
              <div 
                key={cert.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  cert.status === "Emitido" 
                    ? theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800 hover:border-rd-cyan/50' : 'bg-white border-zinc-200 hover:border-rd-cyan/50'
                    : 'opacity-70 border-dashed border-zinc-700 bg-surface-container-low'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-heading uppercase px-2 py-0.5 rounded-full bg-rd-cyan/10 text-rd-cyan font-bold border border-rd-cyan/20">
                      {cert.categoria}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cert.status === "Emitido" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {cert.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-heading font-bold text-on-surface line-clamp-2">
                    {cert.titulo}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {cert.descricao}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant">
                    {cert.dataEmissao}
                  </span>
                  {cert.status === "Emitido" ? (
                    <button 
                      onClick={() => setSelectedCertificado(cert)}
                      className="px-3 py-1.5 rounded-xl bg-rd-cyan text-zinc-950 font-heading text-xs font-bold hover:bg-rd-cyan/90 transition-all flex items-center gap-1"
                    >
                      Ver Certificado <Award size={14} />
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-500 font-semibold">Em Avaliação</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ABA 4: RELATÓRIO DE IMPACTO FINANCEIRO ─── */}
      {activeTab === "impacto" && (
        <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'} space-y-6`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
            <div>
              <span className="text-[11px] font-heading uppercase tracking-widest text-rd-cyan font-bold">
                Demonstrativo de Valor Gerado
              </span>
              <h2 className="text-xl font-heading font-bold text-on-surface mt-1">
                Relatório de Impacto Financeiro da Secretária / Recepção
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Cálculo baseado no resgate de desistências e encaixes ágeis registrados pelo sistema.
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant hover:bg-surface-container-high text-xs font-heading font-semibold text-on-surface flex items-center gap-2"
            >
              <Printer size={15} /> Imprimir / Salvar PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <p className="text-xs text-on-surface-variant">Consultas Salvas da Desistência</p>
              <p className="text-2xl font-bold text-on-surface mt-1">{kpiData.consultasSalvasMes} consultas</p>
              <p className="text-[11px] text-emerald-500 mt-1">Reagendadas em menos de 15 min</p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40">
              <p className="text-xs text-on-surface-variant">Ticket Médio por Atendimento</p>
              <p className="text-2xl font-bold text-on-surface mt-1">R$ 350,00</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Especialidades Gerais & Dermatologia</p>
            </div>

            <div className="p-4 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/30">
              <p className="text-xs text-rd-cyan font-bold uppercase tracking-wider">Faturamento Total Retido</p>
              <p className="text-2xl font-bold text-rd-cyan mt-1">
                {kpiData.valorRetidoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1">Retorno direto para a clínica</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3">
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-on-surface">
              Memória de Cálculo Auditável
            </h4>
            <div className="text-xs text-on-surface-variant space-y-1.5 leading-relaxed">
              <p>• <strong>Resgate Ativo via WhatsApp:</strong> 22 pacientes que haviam cancelado aceitaram novos horários ofertados no mesmo dia.</p>
              <p>• <strong>Otimização de Fila de Espera:</strong> 16 pacientes anteciparam suas consultas ocupando horários ociosos de médicos especialistas.</p>
              <p>• <strong>ROI do Colaborador:</strong> O valor financeiro protegido no mês ({kpiData.valorRetidoEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) supera em mais de 4x o custo de folha da posição de recepção, demonstrando alta lucratividade para a clínica.</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DE VISUALIZAÇÃO DO CERTIFICADO ─── */}
      {selectedCertificado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-2xl rounded-3xl border-2 p-8 relative shadow-2xl ${
            theme === 'dark' ? 'bg-zinc-950 border-rd-cyan/50 text-white' : 'bg-white border-zinc-300 text-zinc-900'
          }`}>
            <button
              onClick={() => setSelectedCertificado(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4 border-2 border-rd-cyan/30 p-8 rounded-2xl bg-gradient-to-b from-rd-cyan/5 to-transparent">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rd-cyan/20 border border-rd-cyan/40 flex items-center justify-center text-rd-cyan">
                <Award size={32} />
              </div>

              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-rd-cyan">
                  Certificado Oficial de Excelência
                </span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-on-surface">
                  {selectedCertificado.titulo}
                </h2>
              </div>

              <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                Certificamos que <strong>{colaboradorNome}</strong> concluiu com êxito os requisitos operacionais de alto impacto, demonstrando excelência na gestão de fluxos da clínica.
              </p>

              <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center text-xs text-on-surface-variant">
                <div className="text-left">
                  <p className="font-semibold text-on-surface">Código de Autenticidade</p>
                  <p className="font-mono text-[11px]">{selectedCertificado.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-on-surface">Emissor</p>
                  <p className="text-[11px] text-rd-cyan font-bold">{selectedCertificado.emissor}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 text-xs font-bold font-heading hover:bg-rd-cyan/90 transition-all flex items-center gap-2"
              >
                <Download size={15} /> Baixar Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
