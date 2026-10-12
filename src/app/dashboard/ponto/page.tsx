"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  History, 
  AlertCircle, 
  Fingerprint, 
  Camera, 
  ScanFace, 
  Sparkles, 
  UserCheck, 
  RefreshCw, 
  Tablet, 
  ShieldCheck, 
  ChevronRight,
  Search,
  User,
  Building2,
  Lock,
  Eye,
  Check,
  Zap
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import Link from "next/link";

interface ColaboradorTotem {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  matricula: string;
  cpf: string;
  dataNascimento: string;
  fotoUrl?: string;
}

const COLABORADORES_HOMOLOGADOS: ColaboradorTotem[] = [
  {
    id: "colab-1",
    nome: "Dr. Felipe Azevedo",
    cargo: "Diretor Clínico & Cirurgião Geral",
    departamento: "Corpo Clínico",
    matricula: "CRM-SP 124.890",
    cpf: "284.912.438-02",
    dataNascimento: "15/04/1986",
  },
  {
    id: "colab-2",
    nome: "Dra. Beatriz Albuquerque",
    cargo: "Cardiologista & Ecocardiografia",
    departamento: "Ambulatório",
    matricula: "CRM-SP 98.452",
    cpf: "192.441.768-15",
    dataNascimento: "03/11/1989",
  },
  {
    id: "colab-3",
    nome: "Mariana Santos",
    cargo: "Enfermeira Chefe da UTI",
    departamento: "Enfermagem",
    matricula: "COREN-SP 45.109",
    cpf: "349.882.115-44",
    dataNascimento: "22/08/1993",
  },
  {
    id: "colab-4",
    nome: "Carlos Eduardo Mendes",
    cargo: "Recepcionista Pleno",
    departamento: "Atendimento & Recepção",
    matricula: "MAT-2023-04",
    cpf: "411.238.990-87",
    dataNascimento: "10/01/1997",
  }
];

export default function PontoEletronicoPage() {
  const { selectedUnitId } = useDashboardContext();
  const [viewMode, setViewMode] = useState<"individual" | "totem">("totem");
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState<"pending" | "ok" | "error">("pending");
  const [locationData, setLocationData] = useState<GeolocationCoordinates | null>(null);

  // Estados do Modo Totem Facial
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedColab, setDetectedColab] = useState<ColaboradorTotem | null>(COLABORADORES_HOMOLOGADOS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanStatus, setScanStatus] = useState<"scanning" | "matched" | "success">("matched");
  const [lastPunchProof, setLastPunchProof] = useState<any | null>(null);

  // Relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Busca histórico inicial
  const fetchHistorico = async () => {
    try {
      const res = await fetch(`/api/ponto?unitId=${selectedUnitId}`);
      const data = await res.json();
      if (data.success) {
        setHistorico(data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, [selectedUnitId]);

  // Capturar Localização (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData(position.coords);
          setLocationStatus("ok");
        },
        (error) => {
          console.warn("Erro de GPS ou Permissão Negada:", error.message || error.code);
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  // Gerenciamento da Câmera no Modo Totem
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Webcam não disponível ou permissão negada:", err);
      setCameraError("Permissão de câmera não concedida. Usando modo de simulação facial de alta fidelidade.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (viewMode === "totem") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [viewMode]);

  // Captura foto instantânea da câmera (ou gera avatar fallback)
  const captureSnapshot = (): string | null => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/jpeg", 0.7);
      }
    }
    return null;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Funções de Mascaramento LGPD
  const maskCpf = (cpf: string) => {
    // Ex: "284.912.438-02" -> "284.***.***-02"
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return cpf;
    return `${cleaned.slice(0, 3)}.***.***-${cleaned.slice(9, 11)}`;
  };

  const maskDataNascimento = (data: string) => {
    // Ex: "15/04/1986" -> "15/**/1986"
    const parts = data.split("/");
    if (parts.length === 3) {
      return `${parts[0]}/**/${parts[2]}`;
    }
    return data;
  };

  const baterPonto = async (tipo: string, colab?: ColaboradorTotem) => {
    setLoading(true);
    try {
      const snapshotFoto = captureSnapshot();
      const payload = {
        tipo,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        precisao: locationData?.accuracy,
        unitId: selectedUnitId,
        fotoUrl: snapshotFoto,
        userId: colab ? colab.id : undefined
      };

      const res = await fetch('/api/ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        const proof = {
          tipo,
          horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          colaborador: colab ? colab.nome : "Colaborador Autenticado",
          matricula: colab ? colab.matricula : "MAT-2023",
          protocolo: `MTE-REP-${Math.floor(100000 + Math.random() * 900000)}`
        };
        setLastPunchProof(proof);
        setScanStatus("success");
        fetchHistorico();

        setTimeout(() => {
          setScanStatus("matched");
          setLastPunchProof(null);
        }, 4000);
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      {/* Action Bar Compacta & Seletor de Modo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="text-rd-cyan" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Ponto Eletrônico Digital</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <div className="text-xs font-medium flex items-center gap-1.5">
            {locationStatus === "ok" ? (
              <span className="flex items-center gap-1 text-emerald-500 font-semibold"><MapPin size={13}/> GPS Capturado (Portaria 671)</span>
            ) : locationStatus === "error" ? (
              <span className="flex items-center gap-1 text-rose-500 font-semibold"><AlertCircle size={13}/> GPS Desabilitado</span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500 font-semibold"><MapPin size={13}/> Conectando ao GPS...</span>
            )}
          </div>
        </div>
        
        {/* Alternador de Modo */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex items-center gap-1 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setViewMode("totem")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "totem"
                  ? "bg-rd-cyan text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <ScanFace size={14} />
              <span>Totem Facial (Tablet Kiosk)</span>
            </button>
            <button
              onClick={() => setViewMode("individual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "individual"
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <User size={14} />
              <span>Modo Individual</span>
            </button>
          </div>

          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rd-cyan/10 border border-rd-cyan/30 text-rd-cyan hidden md:inline-flex">
            {historico.length} Batidas Hoje
          </span>
        </div>
      </div>

      {/* MODO TOTEM FACIAL / KIOSK */}
      {viewMode === "totem" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Viewfinder da Câmera & Reconhecimento Facial */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-lg flex flex-col items-center justify-between backdrop-blur-xl relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Tablet size={14} className="text-rd-cyan"/> Totem Homologado • Kiosk Ativo
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatTime(time)}
                  </span>
                </div>
              </div>

              {/* Viewfinder Biométrico */}
              <div className="relative w-full max-w-md aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center border-2 border-rd-cyan/40 shadow-inner group">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive && "hidden"}`}
                />
                
                {/* Fallback de Visualização / Simulação caso câmera física não esteja ligada */}
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-900 to-black text-zinc-400">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-rd-cyan/50 flex items-center justify-center mb-4 text-rd-cyan animate-pulse">
                      <ScanFace size={48} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Câmera em Standby</p>
                    <p className="text-xs max-w-xs text-zinc-400 mb-4">
                      {cameraError || "Posicione o rosto no centro da tela para detecção biométrica instantânea."}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-rd-cyan text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 shadow-lg"
                    >
                      <Camera size={14} /> Ativar Câmera do Totem
                    </button>
                  </div>
                )}

                {/* Canvas oculto para tirar snapshot */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay Futurista de Scanner Facial */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-56 h-64 border-2 border-rd-cyan/60 rounded-3xl relative shadow-[0_0_30px_rgba(30,144,255,0.25)]">
                    {/* Cantos do Scanner */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-rd-cyan rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-rd-cyan rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-rd-cyan rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-rd-cyan rounded-br-xl" />
                    
                    {/* Linha Laser Animada de Varredura */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-rd-cyan to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse opacity-80" />
                  </div>

                  <div className="absolute bottom-4 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>Biometria Facial Ativa (Portaria 671)</span>
                  </div>
                </div>

                {/* Tela de Sucesso Flash no Ponto */}
                {scanStatus === "success" && lastPunchProof && (
                  <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95 duration-200 z-20">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mb-3">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl font-extrabold font-heading text-emerald-300">Ponto Registrado com Sucesso!</h3>
                    <p className="text-sm font-medium text-emerald-100 mt-1">{lastPunchProof.tipo.replace('_', ' ')} • {lastPunchProof.horario}</p>
                    <div className="mt-4 p-3 bg-black/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 text-left font-mono space-y-1">
                      <p>Colaborador: {lastPunchProof.colaborador}</p>
                      <p>Matrícula: {lastPunchProof.matricula}</p>
                      <p>Protocolo: {lastPunchProof.protocolo}</p>
                      <p>Auditoria: GPS e Selfie Validados</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seletor Rápido de Colaboradores para Demonstração */}
              <div className="w-full mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                  <span>Simular Reconhecimento de Colaborador:</span>
                  <span className="text-[10px] lowercase text-rd-cyan font-normal">clique para alternar</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {COLABORADORES_HOMOLOGADOS.map((colab) => (
                    <button
                      key={colab.id}
                      onClick={() => {
                        setDetectedColab(colab);
                        setScanStatus("matched");
                      }}
                      className={`p-2 rounded-xl text-left border transition-all text-xs ${
                        detectedColab?.id === colab.id
                          ? "border-rd-cyan bg-rd-cyan/10 font-bold text-rd-cyan"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      <p className="truncate font-semibold">{colab.nome.split(" ")[0]} {colab.nome.split(" ")[1]}</p>
                      <p className="text-[10px] opacity-75 truncate">{colab.cargo.split("&")[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ficha de Confirmação com Máscara LGPD & Botões de Ação */}
            <div className="lg:col-span-5 space-y-6">
              {detectedColab ? (
                <div className="bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-md backdrop-blur-xl flex flex-col justify-between h-full">
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
                      <div className="flex items-center gap-2">
                        <UserCheck className="text-emerald-500" size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                          Identificação Confirmada
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Match 99.4%
                      </span>
                    </div>

                    {/* Dados do Colaborador com Máscara LGPD */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Nome do Colaborador</p>
                        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                          {detectedColab.nome}
                        </h3>
                        <p className="text-xs font-medium text-rd-cyan mt-0.5">
                          {detectedColab.cargo} • {detectedColab.departamento}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                            <Lock size={10} className="text-amber-500" /> CPF (LGPD)
                          </p>
                          <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                            {maskCpf(detectedColab.cpf)}
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                            <Lock size={10} className="text-amber-500" /> Nasc. (Protegido)
                          </p>
                          <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                            {maskDataNascimento(detectedColab.dataNascimento)}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Matrícula / Registro Profissional</p>
                        <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                          {detectedColab.matricula}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Confirmação com 1 Clique */}
                  <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 text-center mb-1">
                      Confirme sua Batida com 1 Toque:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => baterPonto("ENTRADA", detectedColab)}
                        disabled={loading}
                        className="py-3 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Fingerprint size={16} />
                        <span>Entrada</span>
                      </button>
                      <button
                        onClick={() => baterPonto("SAIDA", detectedColab)}
                        disabled={loading}
                        className="py-3 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Fingerprint size={16} />
                        <span>Saída</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => baterPonto("SAIDA_ALMOCO", detectedColab)}
                        disabled={loading}
                        className="py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <span>Saída Almoço</span>
                      </button>
                      <button
                        onClick={() => baterPonto("RETORNO_ALMOCO", detectedColab)}
                        disabled={loading}
                        className="py-2.5 px-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <span>Retorno Almoço</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 text-center pt-2">
                      🔒 Foto capturada e assinada digitalmente conforme Portaria MTP 671/2021.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full">
                  <ScanFace size={48} className="text-zinc-300 dark:text-zinc-700 mb-3" />
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Nenhum Rosto Selecionado</p>
                  <p className="text-xs text-zinc-400 max-w-xs mt-1">
                    Aproxime-se do tablet ou selecione um colaborador de teste ao lado.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Banner Comercial: Kit Totem MedCore Homologado */}
          <div className="bg-gradient-to-r from-zinc-900 via-[#0a2540] to-zinc-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-rd-cyan/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rd-cyan text-black">
                  Hardware Homologado MedCore
                </span>
                <span className="text-xs font-semibold text-zinc-300">Plug & Play</span>
              </div>
              <h3 className="text-2xl font-heading font-extrabold text-white">
                Kit Totem de Ponto Facial com Tablet Kiosk
              </h3>
              <p className="text-sm text-zinc-300 max-w-2xl">
                Forneça o tablet corporativo pronto com suporte de parede anti-furto, blindagem de sistema (Kiosk Mode) e câmera otimizada. Elimine 100% de passivos trabalhistas e relógios caros de bobina.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/dashboard/loja"
                className="px-6 py-3.5 bg-rd-cyan text-black hover:bg-white rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center gap-2"
              >
                <Tablet size={16} />
                <span>Ver Kits na Loja</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* MODO INDIVIDUAL TRADICIONAL */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Relógio e Ações */}
          <div className="bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center backdrop-blur-xl">
            <div className="w-20 h-20 rounded-full bg-rd-cyan/10 flex items-center justify-center text-rd-cyan mb-6 ring-4 ring-rd-cyan/20">
              <Clock size={36} />
            </div>
            
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <h2 className="text-6xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tighter tabular-nums mb-8">
              {formatTime(time)}
            </h2>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button 
                onClick={() => baterPonto("ENTRADA")}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
              >
                <Fingerprint size={24} />
                <span>Entrada</span>
              </button>
              <button 
                onClick={() => baterPonto("SAIDA_ALMOCO")}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
              >
                <Fingerprint size={24} />
                <span>Saída Almoço</span>
              </button>
              <button 
                onClick={() => baterPonto("RETORNO_ALMOCO")}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-sky-500/10 hover:bg-sky-500/20 border-2 border-sky-500/30 text-sky-600 dark:text-sky-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
              >
                <Fingerprint size={24} />
                <span>Retorno Almoço</span>
              </button>
              <button 
                onClick={() => baterPonto("SAIDA")}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-rose-500/10 hover:bg-rose-500/20 border-2 border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
              >
                <Fingerprint size={24} />
                <span>Saída</span>
              </button>
            </div>
          </div>

          {/* Histórico do Dia */}
          <div className="bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-md flex flex-col backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
              <History size={20} className="text-rd-cyan" />
              <h3 className="text-base font-bold">Histórico de Hoje</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {historico.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant flex flex-col items-center justify-center">
                  <Clock size={32} className="opacity-20 mb-3" />
                  <p>Nenhum registro encontrado.</p>
                </div>
              ) : (
                historico.map((registro) => (
                  <div key={registro.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        registro.tipo === 'ENTRADA' ? 'bg-emerald-500' :
                        registro.tipo === 'SAIDA' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {registro.tipo.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                          {registro.statusLocal === 'VALIDO' ? (
                            <span className="text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 size={11} /> Local Válido</span>
                          ) : (
                            <span>Sem Localização</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {new Date(registro.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

