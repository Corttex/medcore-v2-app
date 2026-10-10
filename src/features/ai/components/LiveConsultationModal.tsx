"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mic,
  MicOff,
  Sparkles,
  Stethoscope,
  Sparkle,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Edit3,
  RefreshCw,
  Search,
  Building,
  HeartPulse,
  Syringe,
  Pill,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Paciente {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
}

interface Hipotese {
  diagnostico: string;
  cid?: string;
  probabilidade?: string;
  justificativa?: string;
}

interface Medicamento {
  id?: string;
  nome: string;
  dosagem: string;
  posologia: string;
  duracao?: string;
  justificativa?: string;
}

interface Procedimento {
  id?: string;
  nome: string;
  regiao?: string;
  indicacao?: string;
  sessoes?: string;
  cuidados?: string;
}

interface Exame {
  nome: string;
  motivo: string;
}

interface LiveConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "medico" | "estetica";
}

export function LiveConsultationModal({
  isOpen,
  onClose,
  initialMode = "medico"
}: LiveConsultationModalProps) {
  // Modalidade de Atendimento: "medico" ou "estetica"
  const [mode, setMode] = useState<"medico" | "estetica">(initialMode);
  
  // Estado da Escuta & Voz
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Paciente
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [pacienteSearch, setPacienteSearch] = useState("");
  const [pacienteNomeLivre, setPacienteNomeLivre] = useState("");

  // Sugestões da IA (Em tempo real)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumoCaso, setResumoCaso] = useState("");
  const [hipotesesSugeridas, setHipotesesSugeridas] = useState<Hipotese[]>([]);
  const [medicamentosSugeridos, setMedicamentosSugeridos] = useState<Medicamento[]>([]);
  const [procedimentosSugeridos, setProcedimentosSugeridos] = useState<Procedimento[]>([]);
  const [examesSugeridos, setExamesSugeridos] = useState<Exame[]>([]);
  const [alertasClinicos, setAlertasClinicos] = useState<string[]>([]);

  // Itens Aprovados Oficialmente pelo Médico
  const [hipoteseAprovada, setHipoteseAprovada] = useState("");
  const [cidAprovado, setCidAprovado] = useState("");
  const [medicamentosAprovados, setMedicamentosAprovados] = useState<Medicamento[]>([]);
  const [procedimentosAprovados, setProcedimentosAprovados] = useState<Procedimento[]>([]);
  const [examesAprovados, setExamesAprovados] = useState<Exame[]>([]);
  const [condutaManual, setCondutaManual] = useState("");

  // Modal de Impressão e Salvamento
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceAnalysisRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar Pacientes Cadastrados
  useEffect(() => {
    if (isOpen) {
      fetch("/api/pacientes")
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setPacientes(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Cronômetro da Consulta
  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  // Inicializar Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentSessionText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentSessionText += event.results[i][0].transcript;
          }

          if (currentSessionText.trim()) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${currentSessionText.trim()}` : currentSessionText.trim();
              
              // Dispara análise debounced a cada 4 segundos após novas falas
              if (debounceAnalysisRef.current) clearTimeout(debounceAnalysisRef.current);
              debounceAnalysisRef.current = setTimeout(() => {
                triggerAIAnalysis(updated);
              }, 4000);

              return updated;
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech Recognition Error:", event.error);
          if (event.error !== "no-speech") {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // Se ainda deve continuar ouvindo, reinicia
          if (isListening) {
            try {
              recognition.start();
            } catch {
              setIsListening(false);
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert("Seu navegador não possui suporte nativo à gravação Web Speech. Você pode digitar as falas manualmente.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Disparar Análise da IA
  const triggerAIAnalysis = async (textToAnalyze?: string) => {
    const text = textToAnalyze || transcript;
    if (!text || text.trim().length < 5) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/live-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text,
          mode,
          patientName: selectedPaciente?.nome || pacienteNomeLivre || "Paciente em Atendimento"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResumoCaso(data.resumoCaso || "");
        if (Array.isArray(data.hipoteses)) setHipotesesSugeridas(data.hipoteses);
        if (Array.isArray(data.medicamentos)) setMedicamentosSugeridos(data.medicamentos);
        if (Array.isArray(data.procedimentos)) setProcedimentosSugeridos(data.procedimentos);
        if (Array.isArray(data.exames)) setExamesSugeridos(data.exames);
        if (Array.isArray(data.alertas)) setAlertasClinicos(data.alertas);

        // Se nenhuma hipótese foi aprovada ainda e há uma com alta probabilidade, sugere por padrão
        if (!hipoteseAprovada && data.hipoteses?.length > 0) {
          setHipoteseAprovada(data.hipoteses[0].diagnostico);
          setCidAprovado(data.hipoteses[0].cid || "");
        }
      }
    } catch (err) {
      console.error("Falha ao analisar consulta:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Funções de Aprovação Médica
  const aprovarMedicamento = (med: Medicamento) => {
    const medWithId = { ...med, id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
    setMedicamentosAprovados((prev) => [...prev, medWithId]);
  };

  const removerMedicamentoAprovado = (index: number) => {
    setMedicamentosAprovados((prev) => prev.filter((_, i) => i !== index));
  };

  const aprovarProcedimento = (proc: Procedimento) => {
    const procWithId = { ...proc, id: `proc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
    setProcedimentosAprovados((prev) => [...prev, procWithId]);
  };

  const removerProcedimentoAprovado = (index: number) => {
    setProcedimentosAprovados((prev) => prev.filter((_, i) => i !== index));
  };

  const aprovarExame = (ex: Exame) => {
    setExamesAprovados((prev) => [...prev, ex]);
  };

  const removerExameAprovado = (index: number) => {
    setExamesAprovados((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar no Banco
  const handleFinalizarESalvar = async () => {
    setIsSaving(true);
    setSavedSuccessMsg("");

    try {
      const res = await fetch("/api/consultas/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pacienteId: selectedPaciente?.id,
          pacienteNome: selectedPaciente?.nome || pacienteNomeLivre || "Paciente",
          mode,
          hipoteses: [{ diagnostico: hipoteseAprovada, cid: cidAprovado }],
          medicamentos: medicamentosAprovados,
          procedimentos: procedimentosAprovados,
          exames: examesAprovados,
          observacoes: condutaManual,
          transcricao: transcript
        })
      });

      if (res.ok) {
        setSavedSuccessMsg("Atendimento salvo no prontuário do paciente com sucesso!");
        if (isListening) toggleListening();
        setTimeout(() => {
          setSavedSuccessMsg("");
        }, 5000);
      } else {
        alert("Erro ao salvar atendimento no banco de dados.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão ao salvar atendimento.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-[1500px] h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* ======================================================== */}
        {/* HEADER SUPERIOR: Controles, Modalidade e Escuta          */}
        {/* ======================================================== */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Identificação e Toggle Médico / Estética */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-white">
                  Consulta com Dra. Conte IA
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Assistant
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Escuta ativa contínua e raciocínio clínico com validação médica obrigatória
              </p>
            </div>

            {/* Alternador de Perfil: Médico vs Estética */}
            <div className="hidden md:flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 ml-4">
              <button
                onClick={() => setMode("medico")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === "medico"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                Clínica Geral & Especialidades
              </button>

              <button
                onClick={() => setMode("estetica")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === "estetica"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Sparkle className="w-3.5 h-3.5" />
                Estética & Procedimentos
              </button>
            </div>
          </div>

          {/* Seleção do Paciente e Botão de Escuta Contínua */}
          <div className="flex items-center gap-3">
            
            {/* Seletor rápido de paciente */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Nome do Paciente..."
                value={selectedPaciente ? selectedPaciente.nome : pacienteNomeLivre}
                onChange={(e) => {
                  setSelectedPaciente(null);
                  setPacienteNomeLivre(e.target.value);
                }}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
              {pacientes.length > 0 && !selectedPaciente && pacienteNomeLivre.length > 1 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl max-h-40 overflow-y-auto z-20 shadow-xl">
                  {pacientes
                    .filter((p) => p.nome.toLowerCase().includes(pacienteNomeLivre.toLowerCase()))
                    .slice(0, 5)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPaciente(p);
                          setPacienteNomeLivre("");
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 text-zinc-300 border-b border-zinc-800/50 last:border-0"
                      >
                        <p className="font-medium text-white">{p.nome}</p>
                        {p.cpf && <p className="text-[10px] text-zinc-500">CPF: {p.cpf}</p>}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Cronômetro */}
            <div className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Botão de Gravação / Escuta Contínua */}
            <button
              onClick={toggleListening}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95",
                isListening
                  ? "bg-rose-500 text-white shadow-rose-500/30 animate-pulse border border-rose-400"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-white"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Pausar Escuta</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Iniciar Escuta Contínua</span>
                </>
              )}
            </button>

            {/* Fechar */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mensagem de sucesso ao salvar */}
        {savedSuccessMsg && (
          <div className="px-6 py-2.5 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {savedSuccessMsg}
            </span>
            <button
              onClick={() => setShowPrintPreview(true)}
              className="underline hover:text-white"
            >
              Imprimir documento agora
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* CORPO PRINCIPAL: 3 COLUNAS INTEGRALMENTE CONECTADAS       */}
        {/* ======================================================== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
          
          {/* ------------------------------------------------------ */}
          {/* COLUNA 1: Transcrição ao Vivo & Diálogo da Consulta     */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-4 flex flex-col h-full bg-zinc-950/60 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-semibold text-sm text-white">
                  Diálogo & Transcrição
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isListening && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Gravando falas...
                  </span>
                )}
                <button
                  onClick={() => triggerAIAnalysis()}
                  disabled={isAnalyzing || transcript.length < 5}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Forçar análise instantânea das falas atuais"
                >
                  <RefreshCw className={cn("w-3 h-3", isAnalyzing && "animate-spin")} />
                  Analisar
                </button>
              </div>
            </div>

            {/* Área de Transcrição */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
              {transcript ? (
                <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/70 text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-cyan-500/30">
                  {transcript}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                    <Mic className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-400">
                    Aguardando início das falas...
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                    Clique no botão verde acima ou comece a falar. A Dra. Conte captará tanto a voz do médico quanto do paciente.
                  </p>
                </div>
              )}
            </div>

            {/* Input para digitação de observações manuais pelo médico */}
            <div className="pt-3 border-t border-zinc-800/80 shrink-0">
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                Adicionar fala ou anotação manual:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Paciente nega alergias, PA 120/80..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const val = e.currentTarget.value.trim();
                      setTranscript((prev) => (prev ? `${prev}\n${val}` : val));
                      e.currentTarget.value = "";
                      setTimeout(() => triggerAIAnalysis(), 500);
                    }
                  }}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* COLUNA 2: Sugestões Dinâmicas da Dra. Conte (Live AI)   */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-4 flex flex-col h-full bg-zinc-900/30 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-heading font-semibold text-sm text-white">
                  Sugestões da Dra. Conte
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
                Pendente de Aprovação
              </span>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 scrollbar-thin">
              {/* Resumo Clínico em Andamento */}
              {resumoCaso && (
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-2xl">
                  <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Resumo do Caso em Tempo Real
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{resumoCaso}</p>
                </div>
              )}

              {/* Seção 1: Hipóteses Diagnósticas / Queixas */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {mode === "medico" ? "Hipóteses Diagnósticas (CID-10)" : "Diagnóstico & Queixa Estética"}
                </h4>

                {hipotesesSugeridas.length > 0 ? (
                  <div className="space-y-2">
                    {hipotesesSugeridas.map((hip, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all flex items-start justify-between gap-3 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs text-white">
                              {hip.diagnostico}
                            </span>
                            {hip.cid && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-cyan-300">
                                {hip.cid}
                              </span>
                            )}
                            {hip.probabilidade && (
                              <span className="text-[10px] text-zinc-500">
                                ({hip.probabilidade})
                              </span>
                            )}
                          </div>
                          {hip.justificativa && (
                            <p className="text-[11px] text-zinc-400 leading-normal">
                              {hip.justificativa}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setHipoteseAprovada(hip.diagnostico);
                            setCidAprovado(hip.cid || "");
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0",
                            hipoteseAprovada === hip.diagnostico
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : "bg-zinc-800 text-zinc-300 hover:bg-cyan-500 hover:text-white"
                          )}
                        >
                          <Plus className="w-3 h-3" />
                          {hipoteseAprovada === hip.diagnostico ? "Aprovado" : "Adotar"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
                    Aguardando contexto para sugerir diagnósticos...
                  </p>
                )}
              </div>

              {/* Seção 2: Sugestões de Remédios (Modo Médico) */}
              {mode === "medico" && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-cyan-400" />
                    Sugestões de Medicamentos
                  </h4>

                  {medicamentosSugeridos.length > 0 ? (
                    <div className="space-y-2">
                      {medicamentosSugeridos.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs text-white">
                                {med.nome}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                                {med.dosagem}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-300 mb-1">
                              {med.posologia}
                            </p>
                            {med.justificativa && (
                              <p className="text-[10px] text-zinc-500 italic">
                                {med.justificativa}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => aprovarMedicamento(med)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            Prescrever
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
                      Nenhum medicamento sugerido no momento.
                    </p>
                  )}
                </div>
              )}

              {/* Seção 3: Sugestões de Procedimentos (Modo Estética) */}
              {mode === "estetica" && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-rose-400" />
                    Procedimentos Recomendados
                  </h4>

                  {procedimentosSugeridos.length > 0 ? (
                    <div className="space-y-2">
                      {procedimentosSugeridos.map((proc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-rose-500/50 transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="flex-1">
                            <span className="font-semibold text-xs text-white block mb-0.5">
                              {proc.nome}
                            </span>
                            {proc.regiao && (
                              <span className="text-[10px] text-rose-400 font-medium block mb-1">
                                Região: {proc.regiao}
                              </span>
                            )}
                            {proc.indicacao && (
                              <p className="text-[11px] text-zinc-400 mb-1">
                                {proc.indicacao}
                              </p>
                            )}
                            {proc.cuidados && (
                              <p className="text-[10px] text-zinc-500 italic">
                                Cuidados: {proc.cuidados}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => aprovarProcedimento(proc)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/40">
                      Nenhum procedimento sugerido ainda.
                    </p>
                  )}
                </div>
              )}

              {/* Seção 4: Exames Complementares */}
              {examesSugeridos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Exames Complementares Sugeridos
                  </h4>
                  <div className="space-y-2">
                    {examesSugeridos.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-xs text-white">{ex.nome}</p>
                          <p className="text-[10px] text-zinc-400">{ex.motivo}</p>
                        </div>
                        <button
                          onClick={() => aprovarExame(ex)}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Solicitar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alertas Clínicos */}
              {alertasClinicos.length > 0 && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Lembretes de Segurança Clínica</span>
                  </div>
                  {alertasClinicos.map((alerta, i) => (
                    <p key={i} className="text-[11px] text-amber-300/90 leading-tight">
                      • {alerta}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* COLUNA 3: Prescrição & Conduta Oficial do Médico       */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-4 flex flex-col h-full bg-zinc-950 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-heading font-semibold text-sm text-white">
                  Prescrição Oficial Aprovada
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                Aprovação Médica
              </span>
            </div>

            {/* Aviso de Responsabilidade */}
            <div className="mt-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 leading-tight flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Somente os itens aprovados e confirmados por você farão parte da receita final a ser impressa ou enviada.
              </span>
            </div>

            {/* Lista de Itens Aprovados */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 scrollbar-thin">
              {/* Diagnóstico Definido */}
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Diagnóstico / CID Oficial
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hipoteseAprovada}
                    onChange={(e) => setHipoteseAprovada(e.target.value)}
                    placeholder="Diagnóstico do paciente..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={cidAprovado}
                    onChange={(e) => setCidAprovado(e.target.value)}
                    placeholder="CID-10"
                    className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-cyan-300 font-mono text-center focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Medicamentos Aprovados */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Medicamentos ({medicamentosAprovados.length})
                  </h5>
                  <button
                    onClick={() => {
                      const novo = {
                        nome: "Novo Medicamento",
                        dosagem: "Dose",
                        posologia: "Instruções de uso"
                      };
                      aprovarMedicamento(novo);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Manual
                  </button>
                </div>

                {medicamentosAprovados.length > 0 ? (
                  <div className="space-y-2">
                    {medicamentosAprovados.map((med, i) => (
                      <div
                        key={i}
                        className="p-3 bg-zinc-900/90 border border-emerald-500/30 rounded-xl relative group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <input
                            type="text"
                            value={med.nome}
                            onChange={(e) => {
                              const updated = [...medicamentosAprovados];
                              updated[i].nome = e.target.value;
                              setMedicamentosAprovados(updated);
                            }}
                            className="font-semibold text-xs text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-cyan-400 focus:outline-none flex-1"
                          />
                          <input
                            type="text"
                            value={med.dosagem}
                            onChange={(e) => {
                              const updated = [...medicamentosAprovados];
                              updated[i].dosagem = e.target.value;
                              setMedicamentosAprovados(updated);
                            }}
                            className="text-[10px] font-mono text-cyan-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 w-20 text-right focus:outline-none"
                          />
                          <button
                            onClick={() => removerMedicamentoAprovado(i)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                            title="Remover medicamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={med.posologia}
                          onChange={(e) => {
                            const updated = [...medicamentosAprovados];
                            updated[i].posologia = e.target.value;
                            setMedicamentosAprovados(updated);
                          }}
                          className="w-full text-[11px] text-zinc-300 bg-zinc-950/60 p-1.5 rounded border border-zinc-800/80 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                    Nenhum medicamento aprovado ainda. Clique em "Prescrever" na coluna ao lado.
                  </p>
                )}
              </div>

              {/* Procedimentos Aprovados (Estética) */}
              {mode === "estetica" && (
                <div>
                  <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Procedimentos Aprovados ({procedimentosAprovados.length})
                  </h5>
                  {procedimentosAprovados.length > 0 ? (
                    <div className="space-y-2">
                      {procedimentosAprovados.map((proc, i) => (
                        <div
                          key={i}
                          className="p-3 bg-zinc-900/90 border border-rose-500/30 rounded-xl relative"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-xs text-white">
                              {proc.nome}
                            </span>
                            <button
                              onClick={() => removerProcedimentoAprovado(i)}
                              className="text-zinc-500 hover:text-rose-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {proc.regiao && (
                            <p className="text-[11px] text-rose-300">Região: {proc.regiao}</p>
                          )}
                          {proc.cuidados && (
                            <p className="text-[10px] text-zinc-400 italic mt-1">{proc.cuidados}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic p-3 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                      Nenhum procedimento aprovado ainda.
                    </p>
                  )}
                </div>
              )}

              {/* Exames Solicitados */}
              {examesAprovados.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Exames Solicitados ({examesAprovados.length})
                  </h5>
                  <div className="space-y-1.5">
                    {examesAprovados.map((ex, i) => (
                      <div
                        key={i}
                        className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-200">{ex.nome}</span>
                        <button
                          onClick={() => removerExameAprovado(i)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conduta e Orientações Gerais */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Orientações Gerais ao Paciente & Conduta
                </label>
                <textarea
                  rows={3}
                  value={condutaManual}
                  onChange={(e) => setCondutaManual(e.target.value)}
                  placeholder="Orientações de repouso, hidratação, retorno em 15 dias..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>
            </div>

            {/* BOTÕES DE AÇÃO FINAL: Imprimir & Salvar */}
            <div className="pt-3 border-t border-zinc-800 shrink-0 space-y-2">
              <button
                onClick={() => setShowPrintPreview(true)}
                disabled={medicamentosAprovados.length === 0 && procedimentosAprovados.length === 0 && !hipoteseAprovada}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Visualizar & Imprimir Receita / Termo
              </button>

              <button
                onClick={handleFinalizarESalvar}
                disabled={isSaving}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isSaving ? "Salvando Prontuário..." : "Finalizar & Salvar no Prontuário"}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL DE PRÉ-VISUALIZAÇÃO DE IMPRESSÃO (Receituário A4)   */}
        {/* ======================================================== */}
        {showPrintPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
            <div className="bg-white text-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header do Modal de Impressão */}
              <div className="px-6 py-3 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-600">
                  Pré-visualização do Documento Impresso
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir Agora
                  </button>
                  <button
                    onClick={() => setShowPrintPreview(false)}
                    className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Folha A4 Simulação */}
              <div id="print-area" className="p-8 overflow-y-auto font-serif space-y-6 flex-1">
                {/* Cabeçalho da Clínica */}
                <div className="text-center pb-4 border-b-2 border-zinc-800">
                  <h1 className="text-xl font-bold tracking-tight text-zinc-950 uppercase">
                    Hospital Central — MEDCore
                  </h1>
                  <p className="text-xs text-zinc-600 font-sans mt-0.5">
                    Centro Clínico e Especialidades Médicas Integradas
                  </p>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    Av. das Américas, 4200 • CNPJ: 12.345.678/0001-90 • Tel: (11) 4002-8922
                  </p>
                </div>

                {/* Dados do Paciente */}
                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 font-sans text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-zinc-500">PACIENTE: </span>
                    <span className="font-semibold text-zinc-900">
                      {selectedPaciente?.nome || pacienteNomeLivre || "Paciente em Atendimento"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-zinc-500">DATA: </span>
                    <span className="font-semibold text-zinc-900">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Título do Documento */}
                <div className="text-center pt-2">
                  <h2 className="text-base font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1 inline-block">
                    {mode === "estetica" ? "PLANO DE PROCEDIMENTOS & HOMECARE" : "RECEITUÁRIO MÉDICO"}
                  </h2>
                  {hipoteseAprovada && (
                    <p className="text-xs font-sans text-zinc-600 mt-1">
                      Hipótese / Diagnóstico: <strong>{hipoteseAprovada}</strong> {cidAprovado && `(CID ${cidAprovado})`}
                    </p>
                  )}
                </div>

                {/* Lista de Medicamentos Prescritos */}
                {medicamentosAprovados.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-sans font-bold uppercase text-zinc-700 tracking-wider">
                      Uso / Medicamentos:
                    </h3>
                    <ol className="list-decimal list-inside space-y-3 font-sans text-xs">
                      {medicamentosAprovados.map((med, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong className="text-zinc-950 font-bold">{med.nome}</strong> — <span>{med.dosagem}</span>
                          <p className="pl-4 text-zinc-700 mt-0.5">{med.posologia}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Procedimentos Estéticos (se houver) */}
                {procedimentosAprovados.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-sans font-bold uppercase text-zinc-700 tracking-wider">
                      Procedimentos em Consultório:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 font-sans text-xs">
                      {procedimentosAprovados.map((proc, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong>{proc.nome}</strong> ({proc.regiao || "Face"})
                          {proc.cuidados && <p className="pl-4 text-zinc-600 text-[11px]">{proc.cuidados}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exames Solicitados */}
                {examesAprovados.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-sans font-bold uppercase text-zinc-700 tracking-wider">
                      Exames Complementares:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 font-sans text-xs text-zinc-800">
                      {examesAprovados.map((ex, idx) => (
                        <li key={idx}>{ex.nome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conduta / Orientações */}
                {condutaManual && (
                  <div className="pt-2 font-sans text-xs text-zinc-700">
                    <h3 className="font-bold uppercase text-zinc-700 tracking-wider mb-1">
                      Orientações:
                    </h3>
                    <p className="whitespace-pre-wrap">{condutaManual}</p>
                  </div>
                )}

                {/* Rodapé e Assinatura Médica */}
                <div className="pt-12 text-center font-sans">
                  <div className="w-64 border-t border-zinc-800 mx-auto pt-1">
                    <p className="text-xs font-bold text-zinc-900">Dr(a). Responsável</p>
                    <p className="text-[10px] text-zinc-500">CRM/UF • Assinatura e Carimbo Médico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
