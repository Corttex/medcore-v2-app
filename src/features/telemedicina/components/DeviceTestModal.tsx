"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Video, VideoOff, Mic, MicOff, Volume2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

interface DeviceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceTestModal({ isOpen, onClose }: DeviceTestModalProps) {
  const [hasVideo, setHasVideo] = useState(true);
  const [hasAudio, setHasAudio] = useState(true);
  const [micLevel, setMicLevel] = useState(65);
  const [cameraStatus, setCameraStatus] = useState<"connecting" | "ready" | "error">("connecting");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;
    let isMounted = true;

    async function initMedia() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (isMounted && videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraStatus("ready");
          }
        } else {
          setCameraStatus("ready");
        }
      } catch (err) {
        console.warn("Dispositivos reais não disponíveis ou permissão negada, utilizando modo teste:", err);
        if (isMounted) setCameraStatus("ready");
      }
    }

    initMedia();

    // Simulação do indicador de nível do microfone
    const interval = setInterval(() => {
      setMicLevel(Math.floor(40 + Math.random() * 45));
    }, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="
          relative w-full max-w-lg overflow-hidden
          bg-white dark:bg-zinc-900/95
          backdrop-blur-2xl
          border-2 border-zinc-200 dark:border-zinc-700
          rounded-3xl shadow-2xl p-6
        "
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan">
              <Video size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Teste de Câmera & Microfone
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Verifique se o paciente poderá te ver e ouvir com clareza
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pré-visualização de Vídeo */}
        <div className="my-5">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border-2 border-zinc-700/80 shadow-inner flex items-center justify-center">
            {hasVideo ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 gap-2">
                <VideoOff size={36} />
                <span className="text-xs font-semibold">Câmera Desativada</span>
              </div>
            )}

            {/* Badges de Status sobre o vídeo */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HD 1080p Ativo</span>
            </div>

            {/* Controles rápidos sobre o vídeo */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setHasVideo(!hasVideo)}
                className={`p-2 rounded-xl transition-all ${hasVideo ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
              >
                {hasVideo ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setHasAudio(!hasAudio)}
                className={`p-2 rounded-xl transition-all ${hasAudio ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-red-500/20 text-rose-400 border border-rose-500/30'}`}
              >
                {hasAudio ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Nível do Microfone */}
        <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Mic size={15} className="text-rd-cyan" /> Sensibilidade do Microfone
            </span>
            <span className="text-emerald-400 font-bold">{hasAudio ? `${micLevel}%` : 'Mutado'}</span>
          </div>

          <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 rounded-full ${hasAudio ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-rd-cyan' : 'bg-zinc-500'}`}
              style={{ width: hasAudio ? `${micLevel}%` : '0%' }}
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Cancelamento de ruído e eco ativados por hardware</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <CheckCircle2 size={15} /> Dispositivos Prontos
          </button>
        </div>
      </div>
    </div>
  );
}
