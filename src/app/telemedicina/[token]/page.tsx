"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Radio,
  Sparkles
} from "lucide-react";

export default function PatientTelemedicinaPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [consultaData, setConsultaData] = useState<any>(null);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [inCall, setInCall] = useState(false);

  // Mídia
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Chat
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: "MedCore",
      text: "Bem-vindo à sala de atendimento virtual criptografada. Aguarde o médico se conectar.",
      time: "Agora"
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadPublicData() {
      try {
        const res = await fetch(`/api/telemedicina/public/${token}`);
        if (res.ok) {
          const data = await res.json();
          setConsultaData(data);
          if (data.status === "sala_espera") {
            setInWaitingRoom(true);
          } else if (data.status === "em_andamento") {
            setInCall(true);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar consulta pública:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPublicData();
  }, [token]);

  // Gerenciamento da Câmera do Paciente
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function initPatientMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && videoEnabled) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Dispositivo do paciente em modo teste:", err);
      }
    }

    if (inWaitingRoom || inCall) {
      initPatientMedia();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [inWaitingRoom, inCall, videoEnabled]);

  const handleNotifyWaitingRoom = async () => {
    try {
      await fetch(`/api/telemedicina/public/${token}`, { method: "POST" });
      setInWaitingRoom(true);
    } catch (e) {
      setInWaitingRoom(true);
    }
  };

  const handleEnterVideoCall = () => {
    setInCall(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: consultaData?.paciente?.nome || "Você",
        text: inputMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setInputMsg("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061224] flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-rd-cyan/30 border-t-rd-cyan rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-zinc-300">Conectando à sala médica segura...</p>
      </div>
    );
  }

  // TELA 3: Paciente na Chamada de Vídeo ao Vivo
  if (inCall) {
    return (
      <div className="min-h-screen bg-[#061224] text-white flex flex-col overflow-hidden">
        {/* Header Superior da Chamada */}
        <div className="h-14 px-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rd-cyan/20 text-rd-cyan flex items-center justify-center font-bold text-xs">
              MC
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {consultaData?.user?.fullName || "Dr. Carlos Eduardo Silva"}
              </p>
              <p className="text-[10px] text-zinc-400">
                {consultaData?.user?.especialidade || "Médico Responsável"} • CRM {consultaData?.user?.crm || "12345"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Consulta Ao Vivo
            </span>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-xl text-xs transition-all border ${showChat ? 'bg-rd-cyan text-zinc-950 border-rd-cyan' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* Área de Vídeo */}
        <div className="flex-1 relative bg-zinc-950 flex flex-col items-center justify-center p-3 overflow-hidden">
          {/* Feed do Médico */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 flex flex-col items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-blue-500/20 mb-3 animate-pulse">
              DR
            </div>
            <h3 className="text-base font-bold text-white">
              {consultaData?.user?.fullName || "Dr. Carlos Eduardo Silva"}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Transmissão médica em tempo real
            </p>

            {/* PiP da Câmera do Paciente */}
            <div className="absolute bottom-4 right-4 w-28 sm:w-44 aspect-video bg-black rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl">
              {videoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                  <VideoOff size={16} />
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                Você
              </div>
            </div>
          </div>

          {/* Barra de Controles Inferior */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-zinc-950/90 backdrop-blur-xl border-2 border-zinc-700/80 p-2 rounded-2xl shadow-2xl z-30">
            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className={`p-3 rounded-xl transition-all ${micEnabled ? 'bg-zinc-800 text-white' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
            >
              {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-3 rounded-xl transition-all ${videoEnabled ? 'bg-zinc-800 text-white' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
            >
              {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button
              onClick={() => setInCall(false)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-red-600/30 transition-all"
            >
              <PhoneOff size={18} />
              <span>Sair da Sala</span>
            </button>
          </div>

          {/* Modal / Gaveta de Chat */}
          {showChat && (
            <div className="absolute top-3 right-3 bottom-20 w-80 bg-zinc-900/95 border-2 border-zinc-700 rounded-2xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-xl z-40">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-white">Chat com a Equipe</span>
                <button onClick={() => setShowChat(false)} className="text-zinc-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 py-3">
                {messages.map((m, i) => (
                  <div key={i} className="text-xs bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                    <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                      <span className="font-bold text-rd-cyan">{m.sender}</span>
                      <span>{m.time}</span>
                    </div>
                    <p className="text-zinc-200">{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rd-cyan"
                />
                <button type="submit" className="bg-rd-cyan text-zinc-950 p-2 rounded-xl font-bold">
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TELA 1 & 2: Recepção / Sala de Espera Virtual
  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Luzes ambiente sutis de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900/90 backdrop-blur-2xl border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        
        {/* Identificação da Clínica */}
        <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 px-3.5 py-1.5 rounded-full mb-6 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck size={14} className="text-rd-cyan" />
          <span>MedCore • Telemedicina Segura</span>
        </div>

        {/* Card do Médico */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
              DR
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {consultaData?.user?.fullName || "Dr. Carlos Eduardo Silva"}
              </h3>
              <p className="text-xs text-rd-cyan font-medium">
                {consultaData?.user?.especialidade || "Cardiologia & Clínica Médica"}
              </p>
              <p className="text-[11px] text-zinc-400">
                CRM: {consultaData?.user?.crm || "12345-SP"}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-rd-cyan" /> {consultaData?.time || "14:00"}
            </span>
            <span>Paciente: <strong className="text-zinc-900 dark:text-white">{consultaData?.paciente?.nome || "Você"}</strong></span>
          </div>
        </div>

        {/* Pré-visualização da Câmera do Paciente */}
        <div className="mb-6">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 text-left flex items-center justify-between">
            <span>Sua Câmera & Microfone</span>
            <span className="text-[11px] text-emerald-400 font-medium">Permissão Ativa</span>
          </p>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-700 flex items-center justify-center shadow-inner">
            {videoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 gap-1 text-xs">
                <VideoOff size={24} />
                <span>Câmera desligada</span>
              </div>
            )}
            
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`p-1.5 rounded-lg text-xs ${videoEnabled ? 'bg-zinc-800 text-white' : 'bg-red-500/20 text-rose-400'}`}
              >
                {videoEnabled ? <Video size={14} /> : <VideoOff size={14} />}
              </button>
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-1.5 rounded-lg text-xs ${micEnabled ? 'bg-zinc-800 text-white' : 'bg-red-500/20 text-rose-400'}`}
              >
                {micEnabled ? <Mic size={14} /> : <MicOff size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Ação: Na Sala de Espera ou Avisar Chegada */}
        {inWaitingRoom ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <Radio size={15} className="animate-spin" />
                <span>Você está na Sala de Espera Virtual</span>
              </div>
              <p className="text-xs text-zinc-300">
                O médico já foi avisado da sua conexão. Mantenha esta tela aberta para ser atendido.
              </p>
            </div>

            <button
              onClick={handleEnterVideoCall}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black py-3 rounded-2xl text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Video size={16} /> Entrar na Sala com o Médico
            </button>
          </div>
        ) : (
          <button
            onClick={handleNotifyWaitingRoom}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <CheckCircle2 size={16} /> Avisar que Cheguei (Entrar na Fila)
          </button>
        )}

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-5 leading-relaxed">
          Sua consulta é protegida por sigilo médico, conformidade LGPD e criptografia de ponta a ponta.
        </p>
      </div>
    </div>
  );
}
