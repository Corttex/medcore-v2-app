"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Activity, FileText, CheckCircle2, Mic, MicOff, Bot, X, 
  FileSignature, Pill, Loader2, ArrowRight, Sparkles, Plus, Clock, 
  Printer, AlertTriangle, Eye, ZoomIn, ZoomOut, Contrast, RotateCw, 
  Layers, Bookmark, Check, ShieldAlert
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

// Templates Pré-definidos de Laudo Radiológico
const LAUDO_TEMPLATES = [
  {
    nome: "RX Tórax Normal",
    modalidade: "RX",
    texto: `EXAME: RADIOGRAFIA DO TÓRAX (PA E PERFIL)

INDICAÇÃO CLÍNICA: Avaliação de rotina / dispneia leve.

TÉCNICA: Radiografias obtidas em projeções ortogonais habituais.

ANÁLISE:
- Campos pleuropulmonares com transparência e trama vascular preservadas.
- Ausência de condensações parenquimatosas, infiltrados alveolares ou nódulos.
- Seios costofrênicos e cardiofrênicos livres.
- Cúpulas diafragmáticas com contornos regulares e posição anatômica normal.
- Área cardíaca e pedículo vascular com morfologia e dimensões normais.
- Estruturas ósseas da caixa torácica sem alterações anatômicas relevantes.

CONCLUSÃO:
Exame radiológico do tórax dentro dos limites da normalidade.
CID-10 sugerido: Z00.0 (Exame médico geral)`
  },
  {
    nome: "TC Crânio Normal",
    modalidade: "TC",
    texto: `EXAME: TOMOGRAFIA COMPUTADORIZADA DO CRÂNIO

INDICAÇÃO CLÍNICA: Cefaleia crônica / investigação neurológica.

TÉCNICA: Cortes axiais volumétricos de alta resolução sem contraste iodado.

ANÁLISE:
- Parênquima encefálico com coeficientes de atenuação tomográfica preservados, sem evidências de lesões isquêmicas recentes ou hemorragias intra/extra-axiais.
- Sistema ventricular supra e infratentorial de morfologia, situação e dimensões normais para a faixa etária.
- Cisternas da base e sulcos corticais com amplitude habitual.
- Linha média centrada, sem sinais de efeito expansivo.
- Estruturas ósseas da calota e da base do crânio com aspecto conservado.

CONCLUSÃO:
Estudo tomográfico do crânio sem evidências de lesões encefálicas agudas.
CID-10 sugerido: R51 (Cefaleia)`
  },
  {
    nome: "RM Joelho (LCA/Menisco)",
    modalidade: "RM",
    texto: `EXAME: RESSONÂNCIA MAGNÉTICA DO JOELHO

INDICAÇÃO CLÍNICA: Entorse articular / dor e bloqueio mecânico.

TÉCNICA: Sequências multiplanares ponderadas em T1, T2 e DP com saturação de gordura.

ANÁLISE:
- Ligamento cruzado anterior (LCA): Espessado, heterogêneo e com descontinuidade de suas fibras no terço médio, compatível com ruptura completa.
- Ligamento cruzado posterior (LCP): Íntegro, com trajeto e sinal preservados.
- Menisco medial: Ruptura oblíqua complexa estendendo-se à superfície articular no corno posterior (Grau III).
- Menisco lateral: Morfologia e sinal preservados.
- Ligamentos colaterais tibial e fibular sem alterações.
- Derrame articular fêmoro-tibial moderado com discreta sinovite reacional.

CONCLUSÃO:
1. Ruptura completa do ligamento cruzado anterior (LCA).
2. Lesão meniscal complexa do corno posterior do menisco medial.
3. Derrame articular articular fêmoro-tibial moderado.
CID-10 sugerido: S83.5 (Entorse e distensão envolvendo ligamento cruzado anterior)`
  },
  {
    nome: "USG Abdome Total",
    modalidade: "US",
    texto: `EXAME: ULTRASSONOGRAFIA DO ABDOME TOTAL

INDICAÇÃO CLÍNICA: Dor abdominal vaga / check-up.

ANÁLISE:
- Fígado com dimensões normais, contornos regulares e ecotextura homogênea, sem nódulos evidentes.
- Vesícula biliar com paredes finas e conteúdo anecóico, sem cálculos ou debris.
- Vias biliares intra e extra-hepáticas sem sinais de dilatação.
- Pâncreas e baço com dimensões e ecotextura normais.
- Rins tópicos, com limites nítidos, espessura córtico-medular preservada e sem hidronefrose ou litíase calculosa detectável.
- Bexiga repleta, de paredes lisas e regulares.
- Ausência de líquido livre na cavidade peritoneal.

CONCLUSÃO:
Ultrassonografia do abdome total dentro dos limites ecográficos da normalidade.
CID-10 sugerido: R10.4 (Outras dores abdominais e as não especificadas)`
  }
];

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
  const [activeTab, setActiveTab] = useState<"editor" | "pacs">("editor");
  const [isCritico, setIsCritico] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // PACS Viewer States
  const [zoomLevel, setZoomLevel] = useState(1);
  const [invertedColor, setInvertedColor] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [activeSlice, setActiveSlice] = useState(14);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (selectedUnitId) fetchData();
  }, [selectedUnitId]);

  // Inicializar Speech Recognition para Ditado por Voz
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";

        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          setTextoLaudo(prev => {
            const separator = prev.endsWith("\n") || prev === "" ? "" : " ";
            return prev + separator + transcript;
          });
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("O seu navegador não possui suporte nativo à Web Speech API. Recomendamos o Google Chrome ou Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

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

  const handleApplyTemplate = (template: typeof LAUDO_TEMPLATES[0]) => {
    setTextoLaudo(template.texto);
    setCopiedTemplate(template.nome);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const handleSimulateAi = () => {
    if (!textoLaudo) return;
    setIsAiGenerating(true);
    
    setTimeout(() => {
      let conclusion = "\n\n**CONCLUSÃO CLÍNICA SINTETIZADA:**\n";
      if (textoLaudo.toLowerCase().includes("ruptura") || textoLaudo.toLowerCase().includes("lca")) {
        conclusion += "Ruptura completa do LCA associada a lesão meniscal medial. Recomendada avaliação cirúrgica ortopédica imediata.\nCID-10: S83.5";
      } else if (textoLaudo.toLowerCase().includes("tórax") || textoLaudo.toLowerCase().includes("pleuropulmonares")) {
        conclusion += "Estudo radiológico torácico sem alterações parenquimatosas agudas evidentes.\nCID-10: Z00.0";
      } else if (textoLaudo.toLowerCase().includes("crânio") || textoLaudo.toLowerCase().includes("encefálico")) {
        conclusion += "Ausência de hemorragias agudas intra ou extra-axiais ou efeito de massa.\nCID-10: R51";
      } else {
        conclusion += "Achados analisados e estruturados em conformidade com as diretrizes do CBR/Colégio Brasileiro de Radiologia.";
      }

      setTextoLaudo(prev => prev + conclusion);
      setIsAiGenerating(false);
    }, 1200);
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
          textoLaudo: (isCritico ? "[ACHADO CRÍTICO COMUNICADO]\n" : "") + textoLaudo,
          conclusao: "",
          assinar
        })
      });
      setActiveExame(null);
      setIsCritico(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handlePrintLaudo = () => {
    window.print();
  };

  const filtered = exames.filter(e => 
    e.paciente?.nome?.toLowerCase().includes(search.toLowerCase()) || 
    e.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    e.modalidade?.toLowerCase().includes(search.toLowerCase())
  );

  const aguardandoCount = exames.filter(e => e.status !== 'LAUDADO').length;
  const laudadosCount = exames.filter(e => e.status === 'LAUDADO').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Action Bar Superior Padronizada do Design System (Zero H1 duplicado) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
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
              <p className="text-xs font-bold text-amber-500 dark:text-amber-400">
                <span>{aguardandoCount}</span> aguardando laudo
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <p className="text-xs font-bold text-emerald-500">Fila em dia</p>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="text-emerald-500 font-bold">{laudadosCount}</span> laudados
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rd-cyan/10 hover:bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30 transition-all"
            title="Popular exames simulados para teste de laudo"
          >
            <Sparkles size={14} />
            <span>Gerar Exames Teste</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Worklist de Exames e Editor Liquid Glass */}
      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-170px)] pb-2">
        
        {/* Coluna Esquerda: Lista de Exames */}
        <div className={`flex flex-col ${activeExame ? 'hidden lg:flex lg:w-4/12' : 'w-full'}`}>
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
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhum exame na worklist</p>
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
                    onClick={() => { 
                      setActiveExame(e); 
                      setTextoLaudo(e.laudo?.textoLaudo || "");
                      setIsCritico(Boolean(e.laudo?.textoLaudo?.includes("[ACHADO CRÍTICO]")));
                      setActiveTab("editor");
                    }}
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
                        <span className={`w-2 h-2 rounded-full ${isLaudado ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isLaudado ? 'text-emerald-500' : 'text-amber-500 dark:text-amber-400'}`}>
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

        {/* Coluna Direita: Editor de Laudo & Visualizador PACS Liquid Glass */}
        {activeExame ? (
          <div className="
            flex-1
            bg-white dark:bg-zinc-900/90
            backdrop-blur-xl
            border-2 border-zinc-200 dark:border-zinc-700/80
            rounded-2xl flex flex-col overflow-hidden shadow-xl
            animate-in slide-in-from-right-4 duration-300
          ">
            {/* Header do Editor com Navegação de Abas PACS/Laudo */}
            <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <FileText className="text-rd-cyan" size={16} /> 
                    Laudo: <span className="text-rd-cyan">{activeExame.modalidade}</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Paciente: <strong className="text-zinc-700 dark:text-zinc-300">{activeExame.paciente?.nome}</strong> • {activeExame.titulo}
                  </p>
                </div>
              </div>

              {/* Seletor de Abas: Editor vs PACS */}
              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-300 dark:border-zinc-700">
                  <button 
                    onClick={() => setActiveTab("editor")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === "editor" ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                  >
                    <FileText size={13} /> Editor
                  </button>
                  <button 
                    onClick={() => setActiveTab("pacs")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === "pacs" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                  >
                    <Layers size={13} /> Visualizador PACS
                  </button>
                </div>

                <button 
                  onClick={handlePrintLaudo} 
                  className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  title="Imprimir / Exportar Laudo Oficial"
                >
                  <Printer size={16} />
                </button>

                <button 
                  onClick={() => setActiveExame(null)} 
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Fechar painel"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Destaque Clínico / Suspeita */}
            {activeExame.observacoes && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-start gap-2.5">
                <Pill className="text-amber-500 shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Suspeita Clínica / Indicação</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">{activeExame.observacoes}</p>
                </div>
              </div>
            )}

            {/* Conteúdo da Aba Ativa */}
            {activeTab === "editor" ? (
              <div className="flex-1 p-5 flex flex-col gap-3 relative overflow-hidden">
                
                {/* Barra de Templates e Macros Rápidas */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0 flex items-center gap-1">
                    <Bookmark size={12} className="text-rd-cyan" /> Macros Rápidas:
                  </span>
                  {LAUDO_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.nome}
                      onClick={() => handleApplyTemplate(tmpl)}
                      disabled={activeExame.status === 'LAUDADO'}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 flex items-center gap-1 ${
                        copiedTemplate === tmpl.nome 
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500" 
                          : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-rd-cyan/50"
                      }`}
                    >
                      {copiedTemplate === tmpl.nome ? <Check size={11} /> : null}
                      {tmpl.nome}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      Corpo do Laudo Médico
                    </label>

                    {/* Toggle Achado Crítico */}
                    <button
                      type="button"
                      onClick={() => setIsCritico(!isCritico)}
                      disabled={activeExame.status === 'LAUDADO'}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                        isCritico 
                          ? "bg-rose-500/20 text-rose-500 border-rose-500/40 shadow-sm" 
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:text-zinc-700"
                      }`}
                      title="Marcar se houver achado de emergência que exige comunicação imediata"
                    >
                      <ShieldAlert size={12} />
                      {isCritico ? "Achado Crítico Ativo!" : "Marcar Achado Crítico"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleListening}
                      disabled={activeExame.status === 'LAUDADO'}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isListening 
                          ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30' 
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                      }`}
                    >
                      {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                      {isListening ? "Parar Ditado" : "Ditar por Voz"}
                    </button>
                    
                    <button 
                      onClick={handleSimulateAi}
                      disabled={!textoLaudo || isAiGenerating || activeExame.status === 'LAUDADO'}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
                    >
                      {isAiGenerating ? <Loader2 size={13} className="animate-spin" /> : <Bot size={13} />} 
                      IA: Sugerir Conclusão + CID
                    </button>
                  </div>
                </div>

                <textarea 
                  value={textoLaudo}
                  onChange={(e) => setTextoLaudo(e.target.value)}
                  disabled={activeExame.status === 'LAUDADO'}
                  className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-4 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rd-cyan transition-colors resize-none leading-relaxed custom-scrollbar disabled:opacity-75 disabled:cursor-not-allowed font-mono font-medium"
                  placeholder="Digite o laudo radiológico aqui, clique em uma macro no topo ou utilize o comando 'Ditar por Voz'..."
                />
              </div>
            ) : (
              /* Visualizador PACS / DICOM Simulado de Alta Resolução */
              <div className="flex-1 bg-black flex flex-col p-4 relative overflow-hidden select-none">
                {/* Barra de Ferramentas PACS */}
                <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-xl mb-3 text-xs text-zinc-300 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-rd-cyan uppercase tracking-wider text-[11px]">PACS Viewer (DICOM)</span>
                    <span className="text-zinc-600">|</span>
                    <span>Série: <strong>AXIAL T2 / DP</strong></span>
                    <span>Corte: <strong>{activeSlice} de 32</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                      className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white" 
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400 w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button 
                      onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                      className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white" 
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button 
                      onClick={() => setInvertedColor(!invertedColor)}
                      className={`p-1 rounded-lg ${invertedColor ? "bg-rd-cyan text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-white"}`} 
                      title="Inverter Tons de Cinza"
                    >
                      <Contrast size={14} />
                    </button>
                  </div>
                </div>

                {/* Viewport Radiológico */}
                <div className="flex-1 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black">
                  {/* Informações de Canto / Metadados DICOM */}
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-400 space-y-0.5 pointer-events-none z-10">
                    <p className="font-bold text-white">{activeExame.paciente?.nome}</p>
                    <p>ID: {activeExame.id.slice(0, 8)}</p>
                    <p>MOD: {activeExame.modalidade}</p>
                    <p>FOV: 240mm</p>
                  </div>

                  <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-400 text-right space-y-0.5 pointer-events-none z-10">
                    <p className="font-bold text-rd-cyan">MEDCORE PACS 2.0</p>
                    <p>WL: 350 / WW: 1500</p>
                    <p>KVP: 120 / MA: 250</p>
                  </div>

                  {/* Canvas de Imagem Simulada de Alta Resolução com Filtros */}
                  <div 
                    className="relative transition-transform duration-150 flex items-center justify-center"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      filter: `${invertedColor ? "invert(1)" : "invert(0)"} brightness(${brightness}%)`
                    }}
                  >
                    {/* Visualização Esquemática de Imagem Radiológica */}
                    <div className="w-80 h-80 rounded-2xl border border-zinc-700/50 bg-radial-gradient flex items-center justify-center relative overflow-hidden shadow-2xl bg-zinc-900">
                      <div className="w-64 h-64 rounded-full border-4 border-dashed border-zinc-600/40 flex items-center justify-center">
                        <div className="w-44 h-44 rounded-full bg-zinc-800/80 border-2 border-zinc-500/50 flex flex-col items-center justify-center">
                          <Activity size={48} className="text-zinc-400 opacity-60 animate-pulse" />
                          <span className="text-[10px] font-mono text-zinc-400 mt-2">{activeExame.modalidade} SLICE #{activeSlice}</span>
                        </div>
                      </div>
                      
                      {/* Grid de Medição */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    </div>
                  </div>

                  {/* Controle de Cortes / Slider */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 rounded-full z-10">
                    <span className="text-[10px] text-zinc-400 font-mono">Corte:</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="32" 
                      value={activeSlice} 
                      onChange={(e) => setActiveSlice(Number(e.target.value))}
                      className="w-44 accent-rd-cyan cursor-pointer"
                    />
                    <span className="text-[10px] text-zinc-300 font-mono">{activeSlice}/32</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rodapé do Editor */}
            <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
              <div>
                {isCritico && (
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    <AlertTriangle size={14} /> Laudo marcado com achado crítico de emergência
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeExame.status === 'LAUDADO' ? (
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30">
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

          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/40 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-center text-zinc-400">
            <div>
              <FileText size={32} className="mx-auto mb-2 text-zinc-500 opacity-60" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Nenhum exame selecionado</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Selecione um exame da fila à esquerda para emitir ou revisar o laudo e visualizar imagens DICOM.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
