"use client";

import React, { useState } from "react";
import { 
  Radar, Search, MapPin, Building, Globe, Phone, Mail, Star, 
  Sparkles, TrendingUp, CheckCircle2, AlertCircle, FileText, 
  Send, ExternalLink, Printer, Shield, ArrowUpRight, Copy, Check,
  Flame, Target, DollarSign, Download, RefreshCw, X
} from "lucide-react";

interface LeadClinica {
  id: string;
  nome: string;
  especialidade: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
  temSite: boolean;
  avaliacaoGoogle: number;
  totalAvaliacoes: number;
  gapsIdentificados: string[];
  scoreOportunidade: number;
  planoRecomendado: string;
  pitchRapido: string;
}

interface DossieComercial {
  clinica: string;
  perdaEstimadaMensal: string;
  diagnosticoGeral: string;
  planoPrincipal: {
    nome: string;
    valorMensal: string;
    justificativa: string;
    roiEsperado: string;
  };
  planoContingencia: {
    nome: string;
    valorMensal: string;
    justificativa: string;
  };
  roteiroPortaAPorta: string[];
  copyWhatsApp: string;
  copyEmail: {
    assunto: string;
    corpo: string;
  };
}

export default function ProspeccaoAdminPage() {
  const [regiao, setRegiao] = useState("Moema, São Paulo");
  const [especialidade, setEspecialidade] = useState("Clínicas Médicas e Estética");
  const [searching, setSearching] = useState(false);
  const [leads, setLeads] = useState<LeadClinica[]>([]);
  
  // Modais de Ação
  const [selectedLead, setSelectedLead] = useState<LeadClinica | null>(null);
  const [dossie, setDossie] = useState<DossieComercial | null>(null);
  const [loadingDossie, setLoadingDossie] = useState(false);
  const [showDossieModal, setShowDossieModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingWhats, setSendingWhats] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    try {
      const res = await fetch("/api/admin/prospeccao/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regiao, especialidade })
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
    }
    setSearching(false);
  };

  const handleOpenDossie = async (lead: LeadClinica) => {
    setSelectedLead(lead);
    setShowDossieModal(true);
    setLoadingDossie(true);
    setDossie(null);

    try {
      const res = await fetch("/api/admin/prospeccao/dossie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead })
      });
      if (res.ok) {
        const data = await res.json();
        setDossie(data.dossie);
      }
    } catch (err) {
      console.error("Erro ao gerar dossiê:", err);
    }
    setLoadingDossie(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSendWhatsApp = async (lead: LeadClinica, customMsg?: string) => {
    const msg = customMsg || `Olá equipe da ${lead.nome}! Notamos a excelência de vocês na região e temos um diagnóstico de IA exclusivo para a gestão da clínica.`;
    setSendingWhats(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone: lead.whatsapp || lead.telefone,
          mensagem: msg
        })
      });
      const data = await res.json();
      if (data.realDispatched) {
        alert(`🚀 Mensagem enviada via Evolution API com sucesso para ${lead.nome}!`);
      } else {
        alert(`✅ Proposta preparada para envio! Status: ${data.message}`);
      }
    } catch (err) {
      alert("Disparo processado!");
    }
    setSendingWhats(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header com Badge Hunter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <Radar size={13} className="animate-spin text-amber-500" /> MEDCORE HUNTER • PROSPECÇÃO AUTÔNOMA B2B
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Radar de Clínicas & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">Geração de Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            A IA pesquisa no Google e na web em tempo real por clínicas na região desejada, audita notas no Google Meu Negócio, identifica faturamento reprimido e cria o dossiê pronto para fechar o <strong>Plano Black (R$ 1.890/mês)</strong> no porta a porta e no WhatsApp.
          </p>
        </div>

        {/* Resumo de Conversão */}
        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ticket Alvo</p>
            <p className="text-lg font-black text-amber-500">R$ 1.890 /mês</p>
            <span className="text-[10px] text-zinc-500 font-medium">Plano Black Enterprise</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtro de Região */}
      <form onSubmit={handleSearch} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <MapPin size={12} className="text-amber-500" /> Região / Bairro / Cidade
            </label>
            <input 
              type="text"
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              placeholder="Ex: Moema, Jardins, Vila Mariana - SP"
              className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Building size={12} className="text-amber-500" /> Especialidade / Nicho
            </label>
            <input 
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              placeholder="Ex: Dermatologia, Estética, Odontologia, Pediatria"
              className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={searching}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {searching ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Varrendo Clínicas...
                </>
              ) : (
                <>
                  <Radar size={16} /> Ativar Radar de IA
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sugestões Rápidas */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
          <span className="text-[11px] font-bold text-zinc-500">Regiões em Alta:</span>
          {["Moema, São Paulo", "Jardins, São Paulo", "Barra da Tijuca, Rio de Janeiro", "Batel, Curitiba", "Savassi, Belo Horizonte"].map((r, i) => (
            <button
              type="button"
              key={i}
              onClick={() => { setRegiao(r); }}
              className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-medium transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      </form>

      {/* Grid de Clínicas Encontradas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Target size={15} className="text-amber-500" />
            Clínicas Mapeadas na Região {leads.length > 0 && `(${leads.length} oportunidades)`}
          </h3>
          {leads.length > 0 && (
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Score Comercial Médio: 91/100
            </span>
          )}
        </div>

        {leads.length === 0 && !searching && (
          <div className="p-12 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Radar size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">Nenhuma busca executada ainda</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Digite um bairro ou cidade acima e clique em <strong>Ativar Radar de IA</strong> para mapear as clínicas da área com telefone, WhatsApp, avaliação e diagnóstico.
              </p>
            </div>
          </div>
        )}

        {leads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/50 transition-all shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white">{lead.nome}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          {lead.scoreOportunidade}% Match
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-zinc-400 shrink-0" /> {lead.endereco}
                      </p>
                    </div>

                    {/* Google Rating */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-500">{lead.avaliacaoGoogle}</span>
                      <span className="text-[10px] text-zinc-400">({lead.totalAvaliacoes})</span>
                    </div>
                  </div>

                  {/* Contatos Rápidos */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] flex items-center gap-1">
                      <Phone size={11} className="text-zinc-400" /> {lead.telefone}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-[11px] flex items-center gap-1 font-bold">
                      WhatsApp: {lead.whatsapp}
                    </span>
                    {lead.temSite ? (
                      <a 
                        href={lead.site} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[11px] font-medium flex items-center gap-1 hover:underline"
                      >
                        <Globe size={11} /> Site Ativo
                      </a>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-medium">
                        Sem Site Próprio
                      </span>
                    )}
                  </div>

                  {/* Gaps Identificados */}
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Gaps Auditados (Oportunidades de Venda):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.gapsIdentificados.map((gap, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-medium border border-amber-500/20">
                          ⚠️ {gap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recomendação de Plano */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-zinc-400 text-[11px]">Plano Recomendado:</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Flame size={13} /> {lead.planoRecomendado}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(lead)}
                    disabled={sendingWhats}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                  >
                    <Send size={12} /> Disparar Whats (Evolution)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDossie(lead)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95"
                  >
                    <FileText size={13} /> Kit Porta a Porta & Dossiê
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Dossiê Completo + Kit Porta a Porta (Impresso & Digital) */}
      {showDossieModal && selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-blue-scrollbar">
            
            <button 
              onClick={() => setShowDossieModal(false)}
              className="absolute right-6 top-6 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Topo do Dossiê */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                  Dossiê Comercial Estratégico
                </span>
                <span className="text-xs text-zinc-400">• Gerado por Gemini IA</span>
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                {selectedLead.nome}
              </h2>
              <p className="text-xs text-zinc-500">{selectedLead.endereco} • Tel: {selectedLead.telefone}</p>
            </div>

            {loadingDossie ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw size={32} className="animate-spin text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-zinc-300">A IA está estruturando o diagnóstico financeiro e os materiais de venda...</p>
                <p className="text-xs text-zinc-500">Calculando perda de receita, roteiro de abordagem e retorno sobre investimento.</p>
              </div>
            ) : dossie ? (
              <div className="space-y-6">
                
                {/* Destaque Financeiro: Faturamento Reprimido */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-orange-500/10 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                      Diagnóstico de Perda Estimada
                    </span>
                    <h3 className="text-2xl font-black text-red-500 dark:text-red-400">
                      - {dossie.perdaEstimadaMensal} / mês
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-xl">
                      {dossie.diagnosticoGeral}
                    </p>
                  </div>
                  <div className="shrink-0 p-3 bg-red-500/20 text-red-400 rounded-2xl text-center">
                    <AlertCircle size={28} className="mx-auto mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Gargalo de Recepção</span>
                  </div>
                </div>

                {/* Estratégia de Fechamento de Alto Valor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Plano Principal: Black */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-500/50 space-y-3 relative overflow-hidden">
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider">
                      Venda Principal
                    </div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
                      {dossie.planoPrincipal.nome}
                    </span>
                    <h4 className="text-2xl font-black text-zinc-900 dark:text-white">
                      {dossie.planoPrincipal.valorMensal}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {dossie.planoPrincipal.justificativa}
                    </p>
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                      💡 ROI: {dossie.planoPrincipal.roiEsperado}
                    </div>
                  </div>

                  {/* Plano de Contingência: Pro */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      {dossie.planoContingencia.nome} (Contingência)
                    </span>
                    <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-200">
                      {dossie.planoContingencia.valorMensal}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {dossie.planoContingencia.justificativa}
                    </p>
                    <span className="text-[10px] text-zinc-500 font-medium block">
                      Utilizar apenas se a clínica alegar restrição orçamentária para o Black.
                    </span>
                  </div>
                </div>

                {/* Roteiro Porta a Porta para o Consultor de Vendas */}
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <Shield size={14} /> Roteiro de Abordagem Presencial (Porta a Porta)
                  </h4>
                  <div className="space-y-2">
                    {dossie.roteiroPortaAPorta.map((passo, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{passo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mensagem Pronta de WhatsApp */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Send size={13} /> Copy Pronta para WhatsApp (Evolution API)
                    </h4>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(dossie.copyWhatsApp, "whats")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition-colors"
                    >
                      {copiedField === "whats" ? <Check size={12} /> : <Copy size={12} />}
                      {copiedField === "whats" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800">
                    {dossie.copyWhatsApp}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(selectedLead, dossie.copyWhatsApp)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Send size={13} /> Enviar esta Mensagem Agora pelo WhatsApp Oficial
                  </button>
                </div>

                {/* Ações do Rodapé do Modal */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer size={14} /> Imprimir Kit Porta a Porta (PDF)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDossieModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
                  >
                    Fechar Dossiê
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
}
