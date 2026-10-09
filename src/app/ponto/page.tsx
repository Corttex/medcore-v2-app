"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, MapPin, CheckCircle, Fingerprint, Lock, ShieldCheck, MapPinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export default function PontoEletronicoPage() {
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"PIN" | "CAMERA" | "SUCCESS">("PIN");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fake validation
  const handlePinSubmit = () => {
    if (pin.length >= 4) {
      setStep("CAMERA");
      startCamera();
      getLocation();
    } else {
      toast.error("O PIN deve ter no mínimo 4 dígitos.");
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Não foi possível acessar a localização. Autorize no seu navegador.");
        }
      );
    } else {
      setLocationError("Geolocalização não suportada.");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Não foi possível acessar a câmera.");
    }
  };

  const handleCapture = () => {
    if (!location) {
      toast.error("Aguarde a localização ser capturada.");
      return;
    }
    setIsCapturing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Stop camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCapturing(false);
      setStep("SUCCESS");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <Logo className="scale-125" />
        </div>

        {step === "PIN" && (
          <div className="w-full bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rd-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rd-cyan/20">
                <Fingerprint className="text-rd-cyan" size={32} />
              </div>
              <h2 className="text-xl font-bold text-white font-heading">Ponto Eletrônico</h2>
              <p className="text-sm text-zinc-400 mt-1">Identifique-se com seu PIN numérico.</p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all",
                    pin.length > i 
                      ? "border-rd-cyan bg-rd-cyan/10 text-rd-cyan shadow-[0_0_15px_rgba(45,212,191,0.2)]" 
                      : "border-zinc-800 bg-zinc-900 text-zinc-600"
                  )}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setPin(prev => prev.length < 4 ? prev + num : prev)}
                  className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xl transition-colors active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPin("")}
                className="h-14 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-bold transition-colors active:scale-95 text-xs uppercase"
              >
                Limpar
              </button>
              <button
                onClick={() => setPin(prev => prev.length < 4 ? prev + "0" : prev)}
                className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xl transition-colors active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => setPin(prev => prev.slice(0, -1))}
                className="h-14 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-bold transition-colors active:scale-95"
              >
                ←
              </button>
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4}
              className="w-full py-4 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rd-cyan/90 transition-all shadow-lg shadow-rd-cyan/20 flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              Entrar
            </button>
          </div>
        )}

        {step === "CAMERA" && (
          <div className="w-full bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white font-heading">Selfie de Segurança</h2>
              <p className="text-sm text-zinc-400 mt-1">Enquadre seu rosto para validar o ponto.</p>
            </div>

            <div className="relative w-full aspect-[3/4] bg-zinc-950 rounded-2xl overflow-hidden mb-6 border border-zinc-700 shadow-inner">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }}
              />
              
              {/* Overlay guides */}
              <div className="absolute inset-0 border-[3px] border-dashed border-white/20 rounded-2xl m-4 pointer-events-none" />
            </div>

            <div className={cn(
              "flex items-center gap-3 p-3 rounded-xl mb-6",
              location ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-amber-500/10 border border-amber-500/30"
            )}>
              {location ? (
                <MapPin className="text-emerald-400 shrink-0" size={24} />
              ) : (
                <MapPinOff className="text-amber-400 shrink-0" size={24} />
              )}
              <div className="flex-1 text-left">
                <p className={cn("text-xs font-bold uppercase", location ? "text-emerald-400" : "text-amber-400")}>
                  Geolocalização
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {locationError ? locationError : location ? "Dentro da cerca virtual (Válido)" : "Buscando satélites..."}
                </p>
              </div>
            </div>

            <button
              onClick={handleCapture}
              disabled={isCapturing || !location}
              className="w-full py-4 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rd-cyan/90 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center gap-2"
            >
              {isCapturing ? (
                <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <Camera size={24} />
              )}
              {isCapturing ? "Registrando..." : "Bater Ponto"}
            </button>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="w-full bg-zinc-900/80 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-in zoom-in duration-500 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-500 animate-pulse">
              <CheckCircle className="text-emerald-500" size={48} />
            </div>
            
            <h2 className="text-2xl font-bold text-white font-heading">Ponto Registrado!</h2>
            <p className="text-emerald-400 font-bold text-lg mt-2">
              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            
            <div className="mt-6 p-4 bg-zinc-950 rounded-xl border border-zinc-800 w-full flex items-center gap-3 text-left">
               <ShieldCheck className="text-zinc-500 shrink-0" size={24} />
               <div>
                 <p className="text-xs text-zinc-500 uppercase font-bold">Validação</p>
                 <p className="text-sm text-zinc-300">Identidade e Localização confirmadas.</p>
               </div>
            </div>

            <button
              onClick={() => {
                setStep("PIN");
                setPin("");
                setLocation(null);
              }}
              className="w-full mt-8 py-4 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
