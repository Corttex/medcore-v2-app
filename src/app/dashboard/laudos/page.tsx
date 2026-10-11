"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Activity, FileText, CheckCircle2, Mic, Bot, X, 
  FileSignature, Pill, Loader2, ArrowRight, Sparkles, Plus, Clock 
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

export default function LaudosWorklistPage() {
  const { selectedUnitId } = useDashboardContext();
  const [exames, setExames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // States para o Editor de Laudo
  const [activeExame, setActiveExame] = useState<any | null>(null);
  const [textoLaudo, setTextoLaudo] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedUnitId) fetchData();
  }, [selectedUnitId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/laudos?unitId=${selectedUnitId}`);
      if (res.ok) setExames(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleMockSeed = async () => {
    if (!selectedUnitId) return;
    await fetch(`/api/laudos/seed?unitId=${selectedUnitId}`);
    fetchData();
  };

  const handleSimulateAi = () => {
    if (!textoLaudo) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setTextoLaudo(prev => prev + "\n\n**CONCLUSÃO:**\nAchados compatíveis com ruptura completa do ligamento cruzado anterior (LCA) e lesão meniscal medial. Ausência de derrame articular significativo.");
      setIsAiGenerating(false);
    }, 1500);
  };

  const handleSaveLaudo = async (assinar: boolean) => {
    if (!activeExame) return;
    setSaving(true);
    try {
      await fetch('/api/laudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exameId: activeExame.id,
          textoLaudo,
          conclusao: "",
          assinar
        })
      });
      setActiveExame(null);
      fetchData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const filtered = exames.filter(e => 
    e.paciente?.nome?.toLowerCase().includes(search.toLowerCase()) || 
    e.titulo?.toLowerCase().includes(search.toLowerCase())
  );

  const aguardandoCount = exames.filter(e => e.status !== 'LAUDADO').length;
  const laudadosCount = exames.filter(e => e.status === 'LAUDADO').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Action Bar Superior Padronizada do Design System (Zero H1 duplicado) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        {/* Lado Esquerdo: Contadores Dinâmicos em Tempo Real */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-xl">
            <Activity size={14} className="text-rd-cyan" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <span className="text-rd-cyan font-bold">{exames.length}</span> exames na worklist
            </p>
          </div>

          {aguardandoCount > 0 ? (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs font-bold text-amber-400">
                <span>{aguardandoCount}</span> aguardando laudo
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <p className="text-xs font-bold text-emerald-400">Fila em dia</p>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-emerald-400 font-bold">{laudadosCount}</span> laudados
            </span>
          </div>
        </div>

        {/* Lado Direito: Busca e Botão Gerador de Teste */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input 
              type="text" 
              placeholder="Buscar exame ou paciente..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-rd-cyan transition-all"
            />
          </div>

          <button 
            onClick={handleMockSeed} 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition-all"
            title="Popular exames simulados para teste de laudo"
          >
            <Sparkles size={14} className="text-rd-cyan" />
            <span>Gerar Exames Teste</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Worklist de Exames e Editor Liquid Glass */}
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-170px)] pb-2">
        
        {/* Coluna Esquerda: Lista de Exames */}
        <div className={`flex flex-col ${activeExame ? 'hidden lg:flex lg:w-5/12' : 'w-full'}`}>
          <div className="
            flex-1 overflow-y-auto
            bg-white dark:bg-zinc-900/85
            backdrop-blur-xl
            border-2 border-zinc-200 dark:border-zinc-700/80
            rounded-2xl p-3 space-y-2.5 custom-scrollbar shadow-sm
          ">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-zinc-400 gap-2">
                <Loader2 size={24} className="animate-spin text-rd-cyan" />
                <p className="text-xs font-medium">Carregando worklist de exames...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 gap-2">
                <Activity size={28} className="text-rd-cyan opacity-40" />
                <p className="text-xs font-bold text-zinc-300">Nenhum exame na worklist</p>
                <p className="text-[11px] text-zinc-500 max-w-xs">
                  Clique em "Gerar Exames Teste" no topo para criar amostras para laudo.
                </p>
              </div>
            ) : (
              filtered.map((e) => {
                const isSelected = activeExame?.id === e.id;
                const isLaudado = e.status === 'LAUDADO';

                return (
                  <button 
                    key={e.id} 
                    onClick={() => { setActiveExame(e); setTextoLaudo(e.laudo?.textoLaudo || ""); }}
                    className={`
                      w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden group
                      ${isSelected 
                        ? 'bg-rd-cyan/10 border-rd-cyan shadow-md shadow-rd-cyan/5' 
                        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-rd-cyan/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-xs text-zinc-900 dark:text-white truncate pr-2">
                        {e.paciente?.nome || "Paciente"}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                        {e.modalidade}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mb-3 truncate">
                      {e.titulo}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isLaudado ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isLaudado ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {isLaudado ? 'Laudado' : 'Aguardando Laudo'}
                        </span>
                      </div>
                      {!isLaudado && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rd-cyan">
                          Laudar <ArrowRight size={12} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna Direita: Editor de Laudo Liquid Glass */}
        {activeExame ? (
          <div className="
            flex-1
            bg-white dark:bg-zinc-900/90
            backdrop-blur-xl
            border-2 border-zinc-200 dark:border-zinc-700/80
            rounded-2xl flex flex-col overflow-hidden shadow-xl
            animate-in slide-in-from-right-4 duration-300
          ">
            {/* Header do Editor */}
            <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <FileText className="text-rd-cyan" size={16} /> 
                  Laudo: <span className="text-rd-cyan">{activeExame.modalidade}</span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Paciente: <strong className="text-zinc-700 dark:text-zinc-300">{activeExame.paciente?.nome}</strong> • Exame: {activeExame.titulo}
                </p>
              </div>
              <button 
                onClick={() => setActiveExame(null)} 
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Fechar editor"
              >
                <X size={18} />
              </button>
            </div>

            {/* Destaque Clínico / Suspeita */}
            {activeExame.observacoes && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-start gap-2.5">
                <Pill className="text-amber-400 shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Suspeita Clínica / Indicação</p>
                  <p className="text-xs text-amber-200/90 font-medium">{activeExame.observacoes}</p>
                </div>
              </div>
            )}

            {/* Área de Texto / Ditado por Voz e IA */}
            <div className="flex-1 p-5 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  Corpo do Laudo Médico
                  {isListening && (
                    <span className="text-[11px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Escutando Ditado...
                    </span>
                  )}
                </label>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsListening(!isListening)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isListening ? 'bg-rose-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'}`}
                  >
                    <Mic size={13} /> Ditar por Voz
                  </button>
                  <button 
                    onClick={handleSimulateAi}
                    disabled={!textoLaudo || isAiGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
                  >
                    {isAiGenerating ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />} 
                    IA: Sugerir Conclusão
                  </button>
                </div>
              </div>

              <textarea 
                value={textoLaudo}
                onChange={(e) => setTextoLaudo(e.target.value)}
                disabled={activeExame.status === 'LAUDADO'}
                className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-4 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan transition-colors resize-none leading-relaxed custom-scrollbar disabled:opacity-75 disabled:cursor-not-allowed font-sans font-medium"
                placeholder="Digite o laudo radiológico aqui ou utilize o comando 'Ditar por Voz'..."
              />
            </div>

            {/* Rodapé do Editor */}
            <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-end gap-3">
              {activeExame.status === 'LAUDADO' ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 size={16} /> Laudo Assinado Eletronicamente
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => handleSaveLaudo(false)}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Salvar Rascunho
                  </button>
                  <button 
                    onClick={() => handleSaveLaudo(true)}
                    disabled={saving || !textoLaudo}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 transition-all"
                  >
                    <FileSignature size={15} /> Assinar e Emitir Laudo
                  </button>
                </>
              )}
            </div>

          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/40 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-center text-zinc-400">
            <div>
              <FileText size={32} className="mx-auto mb-2 text-zinc-500 opacity-60" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhum exame selecionado</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Selecione um exame da fila à esquerda para emitir ou revisar o laudo.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
