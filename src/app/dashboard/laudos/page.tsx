"use client";

import React, { useState, useEffect } from "react";
import { Search, Activity, FileText, CheckCircle2, Mic, Bot, X, Edit, FileSignature, Pill, Loader2, ArrowRight } from "lucide-react";
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
    }, 2000);
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
          conclusao: "", // Pode ser extraido do texto futuramente
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
    e.paciente?.nome.toLowerCase().includes(search.toLowerCase()) || 
    e.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 flex h-[calc(100vh-120px)] flex-col lg:flex-row gap-6">
      
      {/* Esquerda: Worklist */}
      <div className={`flex-1 flex flex-col ${activeExame ? 'hidden lg:flex lg:w-1/3' : 'w-full'}`}>
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tighter text-on-surface flex items-center gap-2">
              <Activity className="text-rd-cyan" /> Central de Laudos
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">Worklist de exames aguardando laudo</p>
          </div>
          <button onClick={handleMockSeed} className="text-sm uppercase font-bold text-zinc-500 hover:text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Gerar Exames de Teste
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text" 
            placeholder="Buscar exame ou paciente..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-rd-cyan focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-surface border border-outline-variant/30 rounded-[2rem] p-3 space-y-2 custom-scrollbar shadow-sm">
          {loading ? (
            <p className="text-center text-zinc-500 p-8 text-sm">Carregando exames...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-zinc-500 p-8 text-sm">Nenhum exame na worklist.</p>
          ) : (
            filtered.map((e) => (
              <button 
                key={e.id} 
                onClick={() => { setActiveExame(e); setTextoLaudo(e.laudo?.textoLaudo || ""); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${activeExame?.id === e.id ? 'bg-rd-cyan/10 border-rd-cyan/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' : 'bg-surface-container-lowest border-transparent hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm text-white truncate pr-2">{e.paciente?.nome}</span>
                  <span className="text-sm font-bold bg-white/10 px-2 py-0.5 rounded-md text-zinc-300">{e.modalidade}</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mb-3 truncate">{e.titulo}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${e.status === 'LAUDADO' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                    <span className="text-sm uppercase font-bold text-zinc-400 tracking-wider">
                      {e.status === 'LAUDADO' ? 'Laudado' : 'Aguardando'}
                    </span>
                  </div>
                  {e.status === 'AGUARDANDO_LAUDO' && <ArrowRight size={14} className="text-rd-cyan" />}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Direita: Área do Laudo */}
      {activeExame && (
        <div className="flex-[2] bg-surface border border-outline-variant/30 rounded-[2rem] flex flex-col overflow-hidden shadow-sm animate-in slide-in-from-right-8 duration-500">
          
          {/* Header Editor */}
          <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-white mb-1 flex items-center gap-2">
                <FileText className="text-rd-cyan" size={20} /> Laudo: {activeExame.modalidade}
              </h2>
              <p className="text-sm text-zinc-400">
                Paciente: <span className="font-semibold text-zinc-300">{activeExame.paciente?.nome}</span> • 
                Exame: <span className="text-zinc-300">{activeExame.titulo}</span>
              </p>
            </div>
            <button onClick={() => setActiveExame(null)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
              <X size={16} />
            </button>
          </div>

          {/* Destaque Clinico */}
          {activeExame.observacoes && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-start gap-3">
              <Pill className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-bold text-amber-500/80 uppercase tracking-widest mb-0.5">Suspeita / Observação Clínica</p>
                <p className="text-xs text-amber-100/90 font-medium">{activeExame.observacoes}</p>
              </div>
            </div>
          )}

          {/* Area de Texto / Microfone */}
          <div className="flex-1 p-6 flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
               <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 Editor de Laudo
                 {isListening && <span className="text-sm bg-error/20 text-error border border-error/30 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span> Escutando Ditado...</span>}
               </label>

               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsListening(!isListening)}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isListening ? 'bg-error text-white' : 'bg-surface-container-low text-zinc-300 hover:bg-white/10'}`}
                 >
                   <Mic size={14} /> Ditar (Voz)
                 </button>
                 <button 
                   onClick={handleSimulateAi}
                   disabled={!textoLaudo || isAiGenerating}
                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-white disabled:opacity-50"
                 >
                   {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />} 
                   IA: Concluir Laudo
                 </button>
               </div>
            </div>

            <textarea 
              value={textoLaudo}
              onChange={(e) => setTextoLaudo(e.target.value)}
              disabled={activeExame.status === 'LAUDADO'}
              className="flex-1 w-full bg-black/20 border border-outline-variant/20 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors resize-none leading-relaxed custom-scrollbar disabled:opacity-70 disabled:cursor-not-allowed"
              placeholder="Digite o laudo aqui ou use o botão 'Ditar' para iniciar o reconhecimento de voz..."
            />
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest flex justify-end gap-3">
             {activeExame.status === 'LAUDADO' ? (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-400/20">
                  <CheckCircle2 size={18} /> Laudo Assinado Eletronicamente
                </div>
             ) : (
                <>
                  <button 
                    onClick={() => handleSaveLaudo(false)}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
                  >
                    Salvar Rascunho
                  </button>
                  <button 
                    onClick={() => handleSaveLaudo(true)}
                    disabled={saving || !textoLaudo}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rd-cyan text-zinc-950 shadow-glow disabled:opacity-50 flex items-center gap-2"
                  >
                    <FileSignature size={16} /> Assinar e Finalizar
                  </button>
                </>
             )}
          </div>

        </div>
      )}

    </div>
  );
}
