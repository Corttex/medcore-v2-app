"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  Monitor,
  MessageSquare,
  FileText,
  Sparkles,
  ShieldCheck,
  Send,
  Pill,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  Maximize2,
  Minimize2,
  Stethoscope
} from "lucide-react";
import { Teleconsulta, ChatMessage } from "../types";

interface TelemedicinaRoomModalProps {
  consulta: Teleconsulta | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishConsulta: (id: string, prontuarioData: any) => Promise<void>;
}

export function TelemedicinaRoomModal({
  consulta,
  isOpen,
  onClose,
  onFinishConsulta,
}: TelemedicinaRoomModalProps) {
  if (!isOpen || !consulta) return null;

  // Estados dos Controles de Mídia
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"ai_scribe" | "prontuario" | "chat">("ai_scribe");
  const [isCopied, setIsCopied] = useState(false);

  // Duração da Chamada
  const [seconds, setSeconds] = useState(0);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "sistema",
      senderName: "MedCore Sistema",
      text: "Conexão de videoconferência segura estabelecida com criptografia ponta a ponta.",
      timestamp: "14:00"
    },
    {
      id: "msg-2",
      sender: "paciente",
      senderName: consulta.paciente?.nome || "Paciente",
      text: "Boa tarde, Doutor! Estou te ouvindo perfeitamente.",
      timestamp: "14:01"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // AI Scribe & Prontuário
  const [anamnese, setAnamnese] = useState(
    "Paciente comparece à teleconsulta referindo queixa de pressão arterial instável nos últimos 5 dias, com picos de 150x95 mmHg relatados no período matutino."
  );
  const [diagnostico, setDiagnostico] = useState("Hipertensão Arterial Sistêmica Estágio 1 (CID-10: I10)");
  const [conduta, setConduta] = useState(
    "Ajuste da dosagem de Losartana Potássica de 50mg para 50mg 1x ao dia pela manhã associada a monitoramento diário da PA (MAPA caseiro). Retorno em 30 dias."
  );
  const [prescricao, setPrescricao] = useState("1. Losartana Potássica 50mg - Tomar 1 comprimido pela manhã em jejum por 30 dias.\n2. Hidroclorotiazida 25mg - 1 comprimido ao dia.");

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSoapSummary, setAiSoapSummary] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Cronômetro da consulta
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inicialização de Câmera Local
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupLocalStream() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoEnabled) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Câmera local em modo simulação:", err);
      }
    }
    setupLocalStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoEnabled]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "medico",
      senderName: "Você (Médico)",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleGenerateSoapAI = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiSoapSummary(`[RESUMO CLÍNICO SOAP GERADO POR IA]
• Subjetivo: Paciente relata cefaleia nucal associada a picos pressóricos matinais (150/95 mmHg). Sem queixas de dor torácica ou dispneia.
• Objetivo: Paciente lúcido, orientado, eupneico. Apresenta boa aderência prévia aos hábitos de vida, sem edema visível em membros inferiores.
• Avaliação: Descontrole pressórico pontual / HAS Estágio 1 sob tratamento.
• Plano Terapêutico: Manter aferição residencial 2x/dia. Ajuste posológico e emissão de receita eletrônica com assinatura ICP-Brasil.`);
      setAiGenerating(false);
    }, 1200);
  };

  const handleTransferToProntuario = () => {
    if (aiSoapSummary) {
      setConduta((prev) => `${prev}\n\n${aiSoapSummary}`);
      setActiveTab("prontuario");
    }
  };

  const handleFinishCall = async () => {
    const confirmFinish = window.confirm(
      "Deseja encerrar a teleconsulta e salvar as anotações clínicas no prontuário do paciente?"
    );
    if (!confirmFinish) return;

    setIsSaving(true);
    try {
      await onFinishConsulta(consulta.id, {
        anamnese,
        diagnostico,
        conduta,
        prescricao,
        duracaoSegundos: seconds,
      });
      onClose();
    } catch (e) {
      console.error("Erro ao salvar:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPatientLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://medcore.gestaocomercial360.com.br";
    const link = `${origin}/telemedicina/${consulta.tokenPublico}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#061224] text-white">
        
        {/* Topo da Sala: Informações do Paciente e Indicador Criptografado */}
        <header className="h-16 px-6 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {consulta.paciente?.nome || "Paciente"}
                </h2>
                <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-700">
                  {consulta.paciente?.convenio?.nome || "Particular"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                {consulta.title} • {consulta.paciente?.telefone || "(11) 98765-4321"}
              </p>
            </div>
          </div>

          {/* Cronômetro e Segurança */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-1.5 rounded-xl shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-white tracking-wider">
                {formatTimer(seconds)}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-xl">
              <ShieldCheck size={14} />
              <span>TLS 1.3 / E2EE</span>
            </div>

            <button
              onClick={handleCopyPatientLink}
              title="Copiar link seguro do paciente"
              className="flex items-center gap-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 transition-colors"
            >
              {isCopied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{isCopied ? "Link Copiado" : "Link do Paciente"}</span>
            </button>

            <button
              onClick={() => setSidePanelOpen(!sidePanelOpen)}
              className={`p-2 rounded-xl text-xs font-bold transition-all border ${sidePanelOpen ? 'bg-rd-cyan text-zinc-950 border-rd-cyan' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'}`}
              title="Alternar Painel de Prontuário & IA"
            >
              <Sparkles size={16} />
            </button>
          </div>
        </header>

        {/* Corpo Principal: Área de Vídeo + Painel Lateral */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Lado Esquerdo: Área de Vídeo da Conferência */}
          <div className="flex-1 relative bg-gradient-to-b from-zinc-950 to-zinc-900 flex flex-col justify-between p-4 overflow-hidden">
            
            {/* Stream Remoto do Paciente (Feed Principal) */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-zinc-950 border-2 border-zinc-800/90 shadow-2xl flex items-center justify-center group">
              
              {/* Vídeo / Simulação Ultra Realista do Paciente */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-radial from-zinc-900 to-zinc-950">
                <div className="relative">
                  {/* Avatar Central com Efeito Pulsante de Áudio */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 text-white font-bold text-3xl sm:text-4xl border-4 border-zinc-800 animate-pulse">
                    {consulta.paciente?.nome?.slice(0, 2).toUpperCase() || "PA"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-zinc-950 flex items-center justify-center text-zinc-950">
                    <Mic size={14} className="stroke-[3]" />
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-white tracking-wide">
                  {consulta.paciente?.nome || "Paciente Conectado"}
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Áudio e vídeo de alta fidelidade transmitindo
                </p>

                {/* Onda de Áudio Estilizada */}
                <div className="flex items-center gap-1 mt-4">
                  {[24, 48, 16, 64, 32, 56, 40, 20, 60, 36].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-rd-cyan/80 rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Tag Superior no Vídeo */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Paciente Remoto • 1080p 60fps</span>
              </div>

              {/* PiP da Câmera do Médico (Canto Inferior Direito) */}
              <div className="absolute bottom-6 right-6 w-36 sm:w-52 aspect-video bg-zinc-950 rounded-2xl overflow-hidden border-2 border-zinc-700/90 shadow-2xl z-20 group/pip transition-transform hover:scale-105">
                {videoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 gap-1">
                    <VideoOff size={20} />
                    <span className="text-[10px] font-bold">Câmera Desligada</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-white border border-white/10">
                  Você (Dr.)
                </div>
              </div>
            </div>

            {/* Barra de Controles Flutuante Liquid Glass Inferior */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-950/85 backdrop-blur-2xl border-2 border-zinc-700/80 p-2 sm:p-2.5 rounded-3xl shadow-2xl">
                
                {/* Botão Áudio / Microfone */}
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  title={micEnabled ? "Desativar Microfone" : "Ativar Microfone"}
                  className={`p-3 rounded-2xl font-bold transition-all ${micEnabled ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
                >
                  {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                {/* Botão Vídeo / Câmera */}
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  title={videoEnabled ? "Desativar Câmera" : "Ativar Câmera"}
                  className={`p-3 rounded-2xl font-bold transition-all ${videoEnabled ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
                >
                  {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                </button>

                {/* Compartilhar Tela */}
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  title="Compartilhar Tela com o Paciente"
                  className={`p-3 rounded-2xl font-bold transition-all ${isScreenSharing ? 'bg-rd-cyan text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  <Monitor size={18} />
                </button>

                {/* Chat com o Paciente */}
                <button
                  onClick={() => {
                    setSidePanelOpen(true);
                    setActiveTab("chat");
                  }}
                  title="Abrir Chat"
                  className={`p-3 rounded-2xl font-bold transition-all ${activeTab === 'chat' && sidePanelOpen ? 'bg-rd-cyan text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  <MessageSquare size={18} />
                </button>

                {/* Prescrição / Prontuário */}
                <button
                  onClick={() => {
                    setSidePanelOpen(true);
                    setActiveTab("prontuario");
                  }}
                  title="Abrir Prontuário"
                  className={`p-3 rounded-2xl font-bold transition-all ${activeTab === 'prontuario' && sidePanelOpen ? 'bg-rd-cyan text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                >
                  <FileText size={18} />
                </button>

                {/* Botão de Encerrar Chamada */}
                <button
                  onClick={handleFinishCall}
                  disabled={isSaving}
                  title="Finalizar Teleconsulta"
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-4 sm:px-5 py-3 rounded-2xl shadow-lg shadow-red-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <PhoneOff size={18} />
                  <span className="hidden sm:inline">Encerrar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lado Direito: Painel Lateral Integrado (AI Scribe, Prontuário e Chat) */}
          {sidePanelOpen && (
            <aside className="w-full md:w-[420px] lg:w-[480px] bg-zinc-900/95 border-l border-zinc-800/90 flex flex-col backdrop-blur-2xl z-20 shrink-0">
              
              {/* Abas do Painel */}
              <div className="flex items-center border-b border-zinc-800 p-2 gap-1.5 bg-zinc-950/40">
                <button
                  onClick={() => setActiveTab("ai_scribe")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'ai_scribe' ? 'bg-zinc-800 text-rd-cyan shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Sparkles size={14} /> AI Scribe
                </button>

                <button
                  onClick={() => setActiveTab("prontuario")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'prontuario' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}
                >
                  <FileText size={14} /> Prontuário
                </button>

                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'chat' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white'}`}
                >
                  <MessageSquare size={14} /> Chat
                </button>

                <button
                  onClick={() => setSidePanelOpen(false)}
                  className="p-2 rounded-xl text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Conteúdo da Aba Ativa */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* ABA 1: AI Scribe (Transcrição e Resumo Inteligente) */}
                {activeTab === "ai_scribe" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="bg-rd-cyan/10 border border-rd-cyan/25 rounded-2xl p-4 flex items-start gap-3">
                      <Sparkles size={18} className="text-rd-cyan shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-white">MEDCore AI Scribe Ativo</h4>
                        <p className="text-[11px] text-zinc-300 mt-0.5">
                          Ouvindo e analisando o diálogo clínico em tempo real para estruturar o prontuário no padrão SOAP.
                        </p>
                      </div>
                    </div>

                    {/* Transcrição em Tempo Real Simulada */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-zinc-300">Transcrição da Conversa</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          Gravando
                        </span>
                      </div>

                      <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 text-xs space-y-2.5 max-h-48 overflow-y-auto font-sans leading-relaxed">
                        <p className="text-zinc-400">
                          <strong className="text-rd-cyan">Dr. Carlos:</strong> Boa tarde Mariana! Como você tem se sentido desde que iniciamos o tratamento para pressão?
                        </p>
                        <p className="text-zinc-300">
                          <strong className="text-emerald-400">Mariana:</strong> Doutor, tive alguns episódios de dor de cabeça pela manhã e quando medi deu 15 por 9.
                        </p>
                        <p className="text-zinc-400">
                          <strong className="text-rd-cyan">Dr. Carlos:</strong> Compreendo. Vamos ajustar a dosagem e adicionar um acompanhamento diário com retorno em 30 dias.
                        </p>
                      </div>
                    </div>

                    {/* Botão de Geração de Resumo SOAP com IA */}
                    <button
                      onClick={handleGenerateSoapAI}
                      disabled={aiGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold p-3 rounded-2xl text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      {aiGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processando inteligência clínica...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Gerar Resumo SOAP Clínico</span>
                        </>
                      )}
                    </button>

                    {/* Resultado do SOAP */}
                    {aiSoapSummary && (
                      <div className="bg-zinc-950 border border-zinc-700/80 rounded-2xl p-4 space-y-3 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rd-cyan flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Resumo SOAP Estruturado
                          </span>
                          <button
                            onClick={handleTransferToProntuario}
                            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            Inserir no Prontuário <ChevronRight size={13} />
                          </button>
                        </div>
                        <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {aiSoapSummary}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* ABA 2: Prontuário & Prescrição Digital */}
                {activeTab === "prontuario" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Anamnese & Queixa Principal
                      </label>
                      <textarea
                        rows={3}
                        value={anamnese}
                        onChange={(e) => setAnamnese(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan leading-relaxed resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Diagnóstico / Hipótese Clínica
                      </label>
                      <input
                        type="text"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Conduta & Orientações
                      </label>
                      <textarea
                        rows={3}
                        value={conduta}
                        onChange={(e) => setConduta(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan leading-relaxed resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                        <span>Receita / Prescrição Digital</span>
                        <span className="text-[10px] text-rd-cyan font-bold">Assinatura Digital Ativa</span>
                      </label>
                      <textarea
                        rows={3}
                        value={prescricao}
                        onChange={(e) => setPrescricao(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 font-mono text-[11px] focus:outline-none focus:border-rd-cyan resize-none"
                      />
                    </div>

                    <button
                      onClick={handleFinishCall}
                      disabled={isSaving}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold p-3 rounded-2xl text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                    >
                      <CheckCircle2 size={16} />
                      <span>{isSaving ? "Salvando Prontuário..." : "Salvar no Prontuário & Emitir Documentos"}</span>
                    </button>
                  </div>
                )}

                {/* ABA 3: Chat com o Paciente */}
                {activeTab === "chat" && (
                  <div className="h-full flex flex-col justify-between space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                      {chatMessages.map((msg) => {
                        const isDoctor = msg.sender === "medico";
                        const isSystem = msg.sender === "sistema";
                        if (isSystem) {
                          return (
                            <div key={msg.id} className="text-center p-2 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400">
                              {msg.text}
                            </div>
                          );
                        }
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-zinc-500 mb-1 font-semibold">
                              {msg.senderName} • {msg.timestamp}
                            </span>
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${isDoctor ? 'bg-blue-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none'}`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Enviar mensagem para o paciente..."
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan"
                      />
                      <button
                        type="submit"
                        className="p-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-cyan-400 font-bold transition-all"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
