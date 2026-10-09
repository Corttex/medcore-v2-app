"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  X,
  RefreshCw,
  UserCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  Stethoscope,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ActionData {
  paciente?: any;
  link?: string;
  prontuarioLink?: string;
  dataStr?: string;
  horaStr?: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  actionExecuted?: boolean;
  actionType?: string;
  actionData?: ActionData;
}

export function FloatingMedicalCopilot() {
  const { selectedUnitId } = useDashboardContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-msg",
      role: "ai",
      content:
        "Olá! Sou a **Dra. Conte**, sua Copilot Médica e Executiva do MEDCore.\n\nVocê pode **digitar ou falar no microfone** para me pedir ações automáticas, como:\n- *\"Cadastre o paciente Marcos Silva, CPF 123.456.789-00, telefone 11 98888-7777, convênio Unimed\"*\n- *\"Agende uma consulta para amanhã às 15:00\"*\n- *\"Crie um lembrete para revisar os laudos de raio-X\"*\n\nComo posso ajudar você agora?",
      timestamp: "Agora",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Largura redimensionável
  const [width, setWidth] = useState(420);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const doDrag = (dragEvent: MouseEvent) => {
      // Movendo o mouse para a esquerda (deltaX negativo) aumenta a largura
      const deltaX = dragEvent.clientX - startX;
      const newWidth = Math.max(320, Math.min(startWidth - deltaX, window.innerWidth * 0.94));
      setWidth(newWidth);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Inicializar Reconhecimento de Voz (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setInputValue(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Erro no reconhecimento de voz:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Atalho de Teclado: Alt + A para alternar Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll automático para o final da conversa
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Alternar gravação de voz
  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Seu navegador não possui suporte nativo à gravação de voz em tempo real.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Erro ao iniciar gravação:", err);
      }
    }
  };

  // Enviar Mensagem
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          unitId: selectedUnitId,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: data.reply || "Ação concluída com sucesso.",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        actionExecuted: data.actionExecuted,
        actionType: data.actionType,
        actionData: data.data,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Erro no Copilot:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "ai",
          content: "❌ Desculpe, não consegui processar o comando no momento. Verifique sua conexão.",
          timestamp: "Agora",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `initial-${Date.now()}`,
        role: "ai",
        content: "Conversa reiniciada. Como posso ajudar com seus pacientes e clínica agora?",
        timestamp: "Agora",
      },
    ]);
  };

  return (
    <>
      {/* Botão Flutuante (FAB) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Tooltip elegante em pill */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-outline-variant/60 shadow-lg text-xs font-semibold text-on-surface hover:border-rd-cyan/60 hover:text-rd-cyan transition-all group backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dra. Conte • Copilot</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-mono text-on-surface-variant group-hover:text-rd-cyan">
              Alt+A
            </span>
          </button>
        )}

        {/* Botão Principal */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 group",
            isOpen
              ? "bg-zinc-800 text-white rotate-90 border border-zinc-700"
              : "bg-gradient-to-tr from-rd-navy to-rd-cyan text-white shadow-[0_0_30px_rgba(0,169,255,0.45)] hover:shadow-[0_0_40px_rgba(0,169,255,0.7)] hover:scale-105 border-2 border-rd-cyan/40"
          )}
          title="Dra. Conte • Copilot Clínico MEDCore (Alt + A)"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <div className="relative">
                <Stethoscope size={24} className="text-white group-hover:rotate-12 transition-transform duration-300" />
                <Sparkles size={12} className="absolute -top-1 -right-1 text-rd-cyan animate-pulse" />
              </div>
              {/* Anel pulsante */}
              <span className="absolute inset-0 rounded-2xl border-2 border-rd-cyan/30 animate-ping pointer-events-none" />
            </>
          )}
        </button>
      </div>

      {/* Janela Flutuante do Copilot */}
      {isOpen && (
        <div 
          style={{ width: `${width}px` }}
          className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-[94vw] h-[640px] max-h-[85vh] bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Alça de Redimensionamento (Esquerda) */}
          <div 
            onMouseDown={startDrag}
            className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-rd-cyan/50 active:bg-rd-cyan z-50 transition-colors"
            title="Arraste para redimensionar a largura"
          />

          {/* Header do Copilot */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rd-navy to-rd-cyan/80 flex items-center justify-center text-white border border-rd-cyan/30 shadow-md">
                <Stethoscope size={20} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-950 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-white leading-tight">
                    Dra. Conte
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rd-cyan/15 text-rd-cyan border border-rd-cyan/30">
                    Copilot
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Pronta para cadastros e ações clínicas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Limpar conversa"
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Minimizar (Alt+A)"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col space-y-1.5 max-w-[88%]",
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-xs leading-relaxed",
                    msg.role === "user"
                      ? "bg-rd-cyan text-zinc-950 font-medium rounded-br-xs shadow-md shadow-rd-cyan/20"
                      : "bg-zinc-900 border border-zinc-800/80 text-zinc-200 rounded-bl-xs shadow-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap prose prose-invert prose-xs max-w-none leading-relaxed [&_p]:mb-3 [&_ul]:pl-4 [&_ul]:list-disc [&_ul]:my-3 [&_li]:mb-1.5 [&_strong]:text-rd-cyan">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Card Interativo de Ação Executada (Ex: Paciente Cadastrado) */}
                  {msg.actionExecuted && msg.actionType === "CADASTRAR_PACIENTE" && msg.actionData?.paciente && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 size={14} /> Ficha Criada no Banco de Dados
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-0.5">
                        <div className="font-semibold text-white">{msg.actionData.paciente.nome}</div>
                        <div>CPF: <span className="font-mono">{msg.actionData.paciente.cpf || "Não informado"}</span></div>
                        <div>Tel: <span className="font-mono">{msg.actionData.paciente.telefone || "Não informado"}</span></div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/dashboard/pacientes`}
                          onClick={() => setIsOpen(false)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-center font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                        >
                          Ver Lista de Pacientes <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Card Interativo de Agendamento */}
                  {msg.actionExecuted && msg.actionType === "AGENDAR_CONSULTA" && msg.actionData?.link && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-blue-500/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                        <Calendar size={14} /> Agendamento Pré-Configurado
                      </div>
                      <Link
                        href={msg.actionData.link}
                        onClick={() => setIsOpen(false)}
                        className="block py-1.5 px-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center font-bold text-[10px] transition-colors"
                      >
                        Abrir Agenda Médica →
                      </Link>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-zinc-500 font-mono px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs w-fit">
                <RefreshCw size={13} className="animate-spin text-rd-cyan" />
                <span>Dra. Conte está executando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas de Ação */}
          <div className="px-4 py-2 border-t border-zinc-900 bg-zinc-900/30 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() =>
                handleSendMessage(
                  "Cadastre o paciente Lucas Ferreira, CPF 345.678.901-22, telefone (11) 98765-4321, convênio Unimed"
                )
              }
              className="px-2.5 py-1 rounded-xl bg-zinc-800/80 hover:bg-rd-cyan/15 hover:border-rd-cyan/40 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-rd-cyan font-medium whitespace-nowrap transition-all flex items-center gap-1"
            >
              <UserCheck size={12} className="text-emerald-400" /> Cadastrar paciente teste
            </button>
            <button
              onClick={() => handleSendMessage("Agendar consulta para amanhã às 14:00")}
              className="px-2.5 py-1 rounded-xl bg-zinc-800/80 hover:bg-rd-cyan/15 hover:border-rd-cyan/40 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-rd-cyan font-medium whitespace-nowrap transition-all flex items-center gap-1"
            >
              <Calendar size={12} className="text-blue-400" /> Agendar consulta
            </button>
            <button
              onClick={() => handleSendMessage("Quais as doses recomendadas de Amoxicilina + Clavulanato?")}
              className="px-2.5 py-1 rounded-xl bg-zinc-800/80 hover:bg-rd-cyan/15 hover:border-rd-cyan/40 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-rd-cyan font-medium whitespace-nowrap transition-all flex items-center gap-1"
            >
              <Stethoscope size={12} className="text-violet-400" /> Dúvida clínica
            </button>
          </div>

          {/* Barra de Entrada (Texto & Microfone) */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/60 shrink-0 space-y-2">
            {isRecording && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Ouvindo sua voz em português... Fale o comando!</span>
                </div>
                <button
                  onClick={toggleRecording}
                  className="text-[10px] font-bold uppercase underline"
                >
                  Parar
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Botão de Microfone de Voz */}
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "p-2.5 rounded-2xl border transition-all shrink-0 cursor-pointer",
                  isRecording
                    ? "bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-rd-cyan hover:border-rd-cyan/50"
                )}
                title={speechSupported ? "Falar comando por voz" : "Reconhecimento de voz não suportado neste navegador"}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Input Textual */}
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    e.currentTarget.style.height = 'auto';
                  }
                }}
                rows={1}
                placeholder={isRecording ? "Ouvindo sua voz..." : "Peça para cadastrar, agendar ou tirar dúvidas..."}
                className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rd-cyan transition-all resize-none custom-scrollbar"
                disabled={loading}
              />

              {/* Botão de Enviar */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || loading}
                className="p-2.5 rounded-2xl bg-rd-cyan hover:bg-rd-cyan/90 disabled:opacity-40 disabled:hover:bg-rd-cyan text-zinc-950 font-bold transition-all shrink-0 cursor-pointer shadow-md shadow-rd-cyan/20"
                title="Enviar comando"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
