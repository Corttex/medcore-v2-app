"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Smile, 
  Meh, 
  Frown, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  Send, 
  Sparkles, 
  Settings, 
  Star, 
  ArrowUpRight, 
  Clock, 
  ExternalLink, 
  Check, 
  X, 
  Share2, 
  Download, 
  HeartHandshake,
  Bot,
  Zap,
  Building2,
  Stethoscope
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AvaliacaoNPS {
  id: string;
  pacienteNome: string;
  pacienteTelefone: string;
  pacienteAvatar?: string;
  medicoNome: string;
  especialidade: string;
  unidade: string;
  nota: number; // 0 a 10
  comentario: string;
  sentimentoIa: "positivo" | "neutro" | "negativo";
  tagsIa: string[];
  data: string;
  statusTratamento: "pendente" | "em_contato" | "resolvido" | "nao_se_aplica";
  origem: "whatsapp" | "totem" | "link_direto";
}

const MOCK_AVALIACOES_INICIAIS: AvaliacaoNPS[] = [];

export default function NpsPage() {
  const { theme } = useTheme();

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoNPS[]>(MOCK_AVALIACOES_INICIAIS);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "promotores" | "neutros" | "detratores" | "pendentes">("todos");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>("todas");
  const [busca, setBusca] = useState<string>("");

  // Modais
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showNovoDisparoModal, setShowNovoDisparoModal] = useState<boolean>(false);
  const [disparoEnviadoComSucesso, setDisparoEnviadoComSucesso] = useState<boolean>(false);

  // Form de novo disparo
  const [novoPacienteNome, setNovoPacienteNome] = useState<string>("");
  const [novoPacienteTelefone, setNovoPacienteTelefone] = useState<string>("");
  const [novoMedicoNome, setNovoMedicoNome] = useState<string>("Dr. Roberto Guimarães (Dermatologia)");

  // Configurações da Régua de Automação
  const [npsAtivo, setNpsAtivo] = useState<boolean>(true);
  const [delayDisparoHoras, setDelayDisparoHoras] = useState<string>("2");
  const [googleMapsLink, setGoogleMapsLink] = useState<string>("https://g.page/r/medcore-clinica/review");
  const [alertaDetratorZap, setAlertaDetratorZap] = useState<string>("+55 11 99999-0000");

  // Estatísticas do NPS
  const totalAvaliacoes = avaliacoes.length;
  const promotores = avaliacoes.filter(a => a.nota >= 9);
  const neutros = avaliacoes.filter(a => a.nota >= 7 && a.nota <= 8);
  const detratores = avaliacoes.filter(a => a.nota <= 6);

  const pctPromotores = totalAvaliacoes > 0 ? Math.round((promotores.length / totalAvaliacoes) * 100) : 0;
  const pctNeutros = totalAvaliacoes > 0 ? Math.round((neutros.length / totalAvaliacoes) * 100) : 0;
  const pctDetratores = totalAvaliacoes > 0 ? Math.round((detratores.length / totalAvaliacoes) * 100) : 0;

  // NPS = % Promotores - % Detratores
  const scoreNPS = pctPromotores - pctDetratores;
  const mediaNotas = totalAvaliacoes > 0 
    ? (avaliacoes.reduce((acc, a) => acc + a.nota, 0) / totalAvaliacoes).toFixed(1)
    : "0.0";

  // Detratores pendentes de contato
  const detratoresPendentes = detratores.filter(d => d.statusTratamento === "pendente");

  // Filtros aplicados
  const avaliacoesFiltradas = useMemo(() => {
    return avaliacoes.filter(item => {
      // Filtro tipo
      if (filtroTipo === "promotores" && item.nota < 9) return false;
      if (filtroTipo === "neutros" && (item.nota < 7 || item.nota > 8)) return false;
      if (filtroTipo === "detratores" && item.nota > 6) return false;
      if (filtroTipo === "pendentes" && item.statusTratamento !== "pendente") return false;

      // Filtro especialidade
      if (filtroEspecialidade !== "todas" && item.especialidade !== filtroEspecialidade) return false;

      // Busca texto
      if (busca.trim() !== "") {
        const query = busca.toLowerCase();
        const matchNome = item.pacienteNome.toLowerCase().includes(query);
        const matchMedico = item.medicoNome.toLowerCase().includes(query);
        const matchComentario = item.comentario.toLowerCase().includes(query);
        const matchEspecialidade = item.especialidade.toLowerCase().includes(query);
        if (!matchNome && !matchMedico && !matchComentario && !matchEspecialidade) return false;
      }

      return true;
    });
  }, [avaliacoes, filtroTipo, filtroEspecialidade, busca]);

  // Alterar status de tratamento
  const handleUpdateStatus = (id: string, novoStatus: "pendente" | "em_contato" | "resolvido") => {
    setAvaliacoes(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, statusTratamento: novoStatus };
      }
      return item;
    }));
  };

  // Gerar link do WhatsApp para responder
  const handleGerarLinkWhatsApp = (item: AvaliacaoNPS) => {
    const telefoneLimpo = item.pacienteTelefone.replace(/\D/g, "");
    let mensagem = "";

    if (item.nota >= 9) {
      mensagem = `Olá ${item.pacienteNome}, tudo bem? Aqui é da equipe do MEDCore. Ficamos imensamente felizes com a sua nota ${item.nota} na consulta com ${item.medicoNome}! ✨ Se puder compartilhar esse carinho deixando uma avaliação no nosso Google, nos ajudaria muito: ${googleMapsLink} . Muito obrigado pela confiança!`;
    } else if (item.nota >= 7) {
      mensagem = `Olá ${item.pacienteNome}, tudo bem? Agradecemos muito pelo seu feedback sobre a consulta com ${item.medicoNome}. Seu comentário é fundamental para aprimorarmos continuamente nossa experiência. Conte sempre conosco!`;
    } else {
      mensagem = `Olá ${item.pacienteNome}, aqui é da coordenação de atendimento do MEDCore. Vimos sua avaliação e gostaríamos de pedir desculpas pelo ocorrido. Valorizamos muito o seu relato e gostaríamos de entender como podemos resolver e acolher você da melhor forma. Podemos conversar por aqui?`;
    }

    const url = `https://wa.me/${telefoneLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // Disparo avulso
  const handleDispararAvulso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPacienteNome || !novoPacienteTelefone) return;

    setDisparoEnviadoComSucesso(true);
    setTimeout(() => {
      setDisparoEnviadoComSucesso(false);
      setShowNovoDisparoModal(false);
      setNovoPacienteNome("");
      setNovoPacienteTelefone("");
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Barra de Status e Ações do Módulo de NPS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-surface border border-outline-variant/30 px-4 py-3 rounded-2xl shadow-sm">
        {/* Status da Automação */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowConfigModal(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm ${
              npsAtivo 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20" 
                : "bg-zinc-700/20 text-zinc-400 border-zinc-600 hover:bg-zinc-700/30"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${npsAtivo ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
            <span>Pós-Consulta WhatsApp: <strong className="text-emerald-500 dark:text-emerald-300">{npsAtivo ? "ATIVO (2h)" : "PAUSADO"}</strong></span>
          </button>
        </div>

        {/* Ações Rápidas */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowNovoDisparoModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Send size={15} />
            <span>Enviar Pesquisa Avulsa</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            title="Configurações da Régua de NPS"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SCORECARDS PRINCIPAIS DO NPS (ZONAS E BREAKDOWN)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Score Geral NPS */}
        <div className="p-6 rounded-3xl border border-rd-cyan/40 bg-gradient-to-br from-surface to-surface-container shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Score NPS Geral
            </span>
            <span className="px-2.5 py-1 rounded-full text-sm font-extrabold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              {scoreNPS >= 75 ? "Zona de Excelência" : scoreNPS >= 50 ? "Zona de Qualidade" : "Zona de Aperfeiçoamento"}
            </span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-heading font-extrabold text-on-surface">
              {scoreNPS > 0 ? `+${scoreNPS}` : scoreNPS}
            </span>
            <span className="text-xs text-emerald-500 font-bold flex items-center">
              <TrendingUp size={14} className="mr-0.5" /> +4 pts este mês
            </span>
          </div>

          <div className="pt-3 border-t border-outline-variant/30 flex justify-between text-xs text-on-surface-variant font-medium">
            <span>Nota Média: <strong className="text-on-surface">{mediaNotas} / 10</strong></span>
            <span>Total: <strong className="text-on-surface">{totalAvaliacoes} respostas</strong></span>
          </div>
        </div>

        {/* Promotores (9-10) */}
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-surface shadow-md flex flex-col justify-between hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Smile size={16} /> Promotores (9-10)
            </span>
            <span className="text-xs font-bold text-on-surface-variant font-mono">
              {promotores.length} pacientes
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl md:text-4xl font-heading font-extrabold text-emerald-500">
              {pctPromotores}%
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Pacientes leais que recomendam ativamente sua clínica para amigos.
            </p>
          </div>

          {/* Mini Barra de Progresso */}
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pctPromotores}%` }} />
          </div>
        </div>

        {/* Neutros (7-8) */}
        <div className="p-6 rounded-3xl border border-amber-500/30 bg-surface shadow-md flex flex-col justify-between hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Meh size={16} /> Neutros (7-8)
            </span>
            <span className="text-xs font-bold text-on-surface-variant font-mono">
              {neutros.length} pacientes
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl md:text-4xl font-heading font-extrabold text-amber-500">
              {pctNeutros}%
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Satisfeitos com a consulta, mas vulneráveis a ofertas da concorrência.
            </p>
          </div>

          {/* Mini Barra de Progresso */}
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${pctNeutros}%` }} />
          </div>
        </div>

        {/* Detratores (0-6) */}
        <div className="p-6 rounded-3xl border border-red-500/30 bg-surface shadow-md flex flex-col justify-between hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <Frown size={16} /> Detratores (0-6)
            </span>
            <span className="text-xs font-bold text-on-surface-variant font-mono">
              {detratores.length} pacientes
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl md:text-4xl font-heading font-extrabold text-red-500">
              {pctDetratores}%
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              {detratoresPendentes.length > 0 ? (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={13} /> {detratoresPendentes.length} pendente(s) de contato!
                </span>
              ) : (
                "Todos os casos foram acolhidos pela equipe."
              )}
            </p>
          </div>

          {/* Mini Barra de Progresso */}
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${pctDetratores}%` }} />
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BARRAS DE DISTRIBUIÇÃO DAS NOTAS 0 A 10 & INSIGHTS DE IA
      ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Distribuição das Notas 0 a 10 */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl border border-outline-variant/50 bg-surface space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-on-surface">
                Distribuição das Notas (0 a 10)
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Frequência de cada nota atribuída pelos pacientes nas últimas pesquisas.
              </p>
            </div>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1 rounded-xl border border-outline-variant/40">
              Taxa de Resposta: 76.4%
            </span>
          </div>

          {/* Barras de 0 a 10 */}
          <div className="grid grid-cols-11 gap-1.5 md:gap-3 items-end h-40 pt-4 border-b border-outline-variant/30 pb-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nota => {
              const count = avaliacoes.filter(a => a.nota === nota).length;
              const maxCount = Math.max(1, ...Array.from({ length: 11 }, (_, i) => avaliacoes.filter(a => a.nota === i).length));
              const heightPct = Math.max(8, (count / maxCount) * 100);

              let barColor = "bg-red-500/80 hover:bg-red-500";
              if (nota >= 9) barColor = "bg-emerald-500 hover:bg-emerald-400";
              else if (nota >= 7) barColor = "bg-amber-500/80 hover:bg-amber-500";

              return (
                <div key={nota} className="flex flex-col items-center justify-end h-full group">
                  <span className="text-sm md:text-xs font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                    {count}
                  </span>
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ${barColor}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className={`text-xs md:text-sm font-bold mt-2 ${nota >= 9 ? "text-emerald-500" : nota >= 7 ? "text-amber-500" : "text-red-400"}`}>
                    {nota}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Detratores (0 a 6)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Neutros (7 e 8)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Promotores (9 e 10)
              </span>
            </div>
            <span className="text-[11px] italic">
              Disparos realizados via WhatsApp Direct & Evolution API
            </span>
          </div>
        </div>

        {/* Insights Automáticos com IA (MEDCore AI Insights) */}
        <div className="p-6 md:p-8 rounded-3xl border border-rd-cyan/30 bg-gradient-to-br from-surface to-surface-container space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-on-surface">
                MEDCore AI Insights
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Sentimento dos comentários analisados
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Empatia e Atenção Médica", score: 98, status: "positivo" },
              { label: "Estrutura e Limpeza Clínica", score: 96, status: "positivo" },
              { label: "Agilidade no WhatsApp", score: 89, status: "positivo" },
              { label: "Tempo de Espera na Recepção", score: 42, status: "negativo" },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-2xl bg-surface border border-outline-variant/40 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface">{item.label}</span>
                  <span className={item.status === "positivo" ? "text-emerald-500" : "text-red-400"}>
                    {item.score}% satisfação
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.status === "positivo" ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-on-surface space-y-1">
            <span className="font-extrabold uppercase text-sm text-amber-500 tracking-wider flex items-center gap-1">
              <AlertTriangle size={12} /> Ponto de Atenção Detectado:
            </span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              2 pacientes mencionaram espera superior a 40 minutos na Unidade Morumbi. Considere revisar o intervalo da agenda médica nessa unidade.
            </p>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FILTROS E FEED DETALHADO DE AVALIAÇÕES
      ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-5">
        
        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* Tabs de Filtro */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "todos", label: "Todas as Avaliações", count: totalAvaliacoes },
              { id: "promotores", label: "⭐ Promotores (9-10)", count: promotores.length },
              { id: "neutros", label: "😐 Neutros (7-8)", count: neutros.length },
              { id: "detratores", label: "🚨 Detratores (0-6)", count: detratores.length },
              { id: "pendentes", label: "⚠️ Pendentes de Resgate", count: detratoresPendentes.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFiltroTipo(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${
                  filtroTipo === tab.id
                    ? "bg-rd-cyan text-zinc-950 border-rd-cyan shadow-md shadow-rd-cyan/20"
                    : "bg-surface text-on-surface-variant border-outline-variant/50 hover:text-on-surface hover:border-rd-cyan/40"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Busca e Especialidade */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={filtroEspecialidade}
              onChange={e => setFiltroEspecialidade(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs md:text-sm font-semibold text-on-surface outline-none focus:border-rd-cyan"
            >
              <option value="todas">Todas as Especialidades</option>
              <option value="Dermatologia">Dermatologia</option>
              <option value="Estética Facial">Estética Facial</option>
              <option value="Clínica Geral">Clínica Geral</option>
              <option value="Ginecologia">Ginecologia</option>
            </select>

            <div className="relative flex-1 md:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Buscar paciente, médico..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs md:text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-rd-cyan"
              />
            </div>
          </div>
        </div>

        {/* Lista de Avaliações */}
        <div className="space-y-3">
          {avaliacoesFiltradas.length === 0 ? (
            <div className="p-12 text-center bg-surface rounded-3xl border border-outline-variant/40 space-y-2">
              <Smile size={36} className="text-on-surface-variant mx-auto opacity-40" />
              <p className="text-sm font-bold text-on-surface">Nenhuma avaliação encontrada com os filtros selecionados.</p>
              <p className="text-xs text-on-surface-variant">Tente alterar os termos da busca ou selecionar outra categoria.</p>
            </div>
          ) : (
            avaliacoesFiltradas.map(item => {
              const isPromotor = item.nota >= 9;
              const isNeutro = item.nota >= 7 && item.nota <= 8;
              const isDetrator = item.nota <= 6;

              return (
                <div 
                  key={item.id}
                  className={`p-5 md:p-6 rounded-3xl border transition-all duration-200 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md ${
                    isDetrator 
                      ? "border-red-500/40 hover:border-red-500/70 bg-red-500/[0.02]" 
                      : isPromotor 
                        ? "border-emerald-500/25 hover:border-emerald-500/50" 
                        : "border-outline-variant/50 hover:border-amber-500/40"
                  }`}
                >
                  {/* Bloco Esquerda: Nota e Dados do Paciente */}
                  <div className="flex items-start gap-4">
                    {/* Badge da Nota com Ícone */}
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border shadow-sm ${
                      isPromotor 
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-500" 
                        : isNeutro 
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-500" 
                          : "bg-red-500/15 border-red-500/30 text-red-500"
                    }`}>
                      <span className="text-xl font-heading font-extrabold leading-none">{item.nota}</span>
                      <span className="text-xs font-bold uppercase mt-0.5">
                        {isPromotor ? "Promotor" : isNeutro ? "Neutro" : "Detrator"}
                      </span>
                    </div>

                    {/* Dados */}
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm md:text-base font-bold text-on-surface">
                          {item.pacienteNome}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          {item.pacienteTelefone}
                        </span>
                        <span className="text-sm text-on-surface-variant font-semibold px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/30">
                          {item.data}
                        </span>
                      </div>

                      {/* Médico e Especialidade */}
                      <p className="text-xs text-on-surface-variant flex items-center gap-2 font-medium">
                        <span className="flex items-center gap-1 text-rd-cyan font-semibold">
                          <Stethoscope size={13} /> {item.medicoNome}
                        </span>
                        <span>•</span>
                        <span>{item.especialidade}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building2 size={13} /> {item.unidade}
                        </span>
                      </p>

                      {/* Comentário do Paciente */}
                      <p className="text-xs md:text-sm text-on-surface font-medium leading-relaxed italic pt-1">
                        "{item.comentario}"
                      </p>

                      {/* Tags de IA */}
                      {item.tagsIa && item.tagsIa.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tagsIa.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="text-sm font-semibold px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/40"
                            >
                              🏷️ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bloco Direita: Status de Tratamento e Ações */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/20 shrink-0">
                    {/* Seletor de Status (Apenas para detratores ou neutros) */}
                    {isDetrator && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-on-surface-variant">Resgate:</span>
                        <select
                          value={item.statusTratamento}
                          onChange={e => handleUpdateStatus(item.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border outline-none ${
                            item.statusTratamento === "pendente"
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : item.statusTratamento === "em_contato"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          <option value="pendente" className="bg-zinc-900 text-red-400">Pendente de Resgate ⚠️</option>
                          <option value="em_contato" className="bg-zinc-900 text-amber-400">Em Contato 📞</option>
                          <option value="resolvido" className="bg-zinc-900 text-emerald-400">Resolvido & Acolhido ✅</option>
                        </select>
                      </div>
                    )}

                    {/* Botão de Resposta / Acolhimento via WhatsApp */}
                    <button
                      onClick={() => handleGerarLinkWhatsApp(item)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-heading font-bold transition-all shadow-sm active:scale-95 ${
                        isPromotor 
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25" 
                          : isDetrator 
                            ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20" 
                            : "bg-rd-cyan/15 text-rd-cyan border border-rd-cyan/30 hover:bg-rd-cyan/25"
                      }`}
                    >
                      <MessageSquare size={14} />
                      {isPromotor ? "Convidar para Avaliar no Google" : isDetrator ? "Resgatar no WhatsApp" : "Agradecer no WhatsApp"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE CONFIGURAÇÕES DA RÉGUA DE NPS
      ═══════════════════════════════════════════════════════════════ */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-outline-variant/60 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            <div className="p-6 bg-surface-container border-b border-outline-variant/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rd-cyan">Automação Inteligente</span>
                <h3 className="text-lg md:text-xl font-heading font-bold text-on-surface mt-0.5">
                  Configurar Régua NPS Pós-Consulta
                </h3>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-2 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs md:text-sm">
              {/* Toggle Ativo/Pausado */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">Disparo Automático no WhatsApp 24/7</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Dispara a pesquisa assim que o médico finaliza o atendimento no prontuário.
                  </p>
                </div>
                <button
                  onClick={() => setNpsAtivo(!npsAtivo)}
                  className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${npsAtivo ? "bg-emerald-500" : "bg-zinc-700"}`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${npsAtivo ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Tempo de Espera do Disparo */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface">Tempo de Espera Pós-Consulta</label>
                <select
                  value={delayDisparoHoras}
                  onChange={e => setDelayDisparoHoras(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3 py-2 font-semibold text-on-surface outline-none focus:border-rd-cyan"
                >
                  <option value="0.5">30 minutos após a finalização da consulta</option>
                  <option value="2">2 horas após a consulta (Recomendado para procedimentos)</option>
                  <option value="6">6 horas após a consulta</option>
                  <option value="24">No dia seguinte (24 horas após)</option>
                </select>
              </div>

              {/* Link do Google Meu Negócio para Promotores */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500" /> Link de Avaliação no Google (para notas 9 e 10)
                </label>
                <input
                  type="text"
                  value={googleMapsLink}
                  onChange={e => setGoogleMapsLink(e.target.value)}
                  placeholder="https://g.page/r/sua-clinica/review"
                  className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3 py-2 font-mono text-xs text-on-surface outline-none focus:border-rd-cyan"
                />
                <p className="text-[11px] text-on-surface-variant">
                  Pacientes promotores são direcionados para deixar 5 estrelas no seu Google Meu Negócio.
                </p>
              </div>

              {/* Notificação Imediata de Detratores */}
              <div className="space-y-1.5">
                <label className="font-bold text-on-surface flex items-center gap-1.5 text-red-400">
                  <AlertTriangle size={14} /> WhatsApp da Gerência para Alertas Críticos (Notas 0 a 6)
                </label>
                <input
                  type="text"
                  value={alertaDetratorZap}
                  onChange={e => setAlertaDetratorZap(e.target.value)}
                  placeholder="+55 11 99999-0000"
                  className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3 py-2 font-mono text-xs text-on-surface outline-none focus:border-rd-cyan"
                />
                <p className="text-[11px] text-on-surface-variant">
                  A gerência é notificada em menos de 1 minuto para ligar e acolher o paciente antes de reclamações públicas.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface-container border-t border-outline-variant/40 flex justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 rounded-xl border border-outline-variant/60 font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-xs md:text-sm"
              >
                Salvar Configurações
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE DISPARO DE PESQUISA AVULSA
      ═══════════════════════════════════════════════════════════════ */}
      {showNovoDisparoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-outline-variant/60 rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rd-cyan">Disparo Rápido</span>
                <h3 className="text-lg md:text-xl font-heading font-bold text-on-surface mt-0.5">
                  Enviar Pesquisa Avulsa
                </h3>
              </div>
              <button
                onClick={() => setShowNovoDisparoModal(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container"
              >
                <X size={18} />
              </button>
            </div>

            {disparoEnviadoComSucesso ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
                <p className="font-bold text-on-surface">Pesquisa Enviada com Sucesso!</p>
                <p className="text-xs text-on-surface-variant">A mensagem foi disparada no WhatsApp do paciente com os botões de 0 a 10.</p>
              </div>
            ) : (
              <form onSubmit={handleDispararAvulso} className="space-y-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Nome do Paciente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Mariana Costa"
                    value={novoPacienteNome}
                    onChange={e => setNovoPacienteNome(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-on-surface outline-none focus:border-rd-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">WhatsApp com DDD</label>
                  <input
                    type="text"
                    required
                    placeholder="+55 11 98888-7777"
                    value={novoPacienteTelefone}
                    onChange={e => setNovoPacienteTelefone(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3.5 py-2.5 font-mono text-on-surface outline-none focus:border-rd-cyan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-on-surface">Médico Atendente</label>
                  <select
                    value={novoMedicoNome}
                    onChange={e => setNovoMedicoNome(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/60 rounded-xl px-3 py-2.5 text-on-surface outline-none focus:border-rd-cyan"
                  >
                    <option value="Dr. Roberto Guimarães (Dermatologia)">Dr. Roberto Guimarães (Dermatologia)</option>
                    <option value="Dra. Camilla Rossi (Estética Facial)">Dra. Camilla Rossi (Estética Facial)</option>
                    <option value="Dr. Marcelo Paiva (Clínica Geral)">Dr. Marcelo Paiva (Clínica Geral)</option>
                    <option value="Dra. Patrícia Mendes (Ginecologia)">Dra. Patrícia Mendes (Ginecologia)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-rd-cyan text-zinc-950 font-heading font-bold text-sm shadow-md hover:bg-rd-cyan/90 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={15} /> Disparar no WhatsApp Agora
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
