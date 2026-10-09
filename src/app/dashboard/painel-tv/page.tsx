"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, MapPin, Volume2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_CALLS = [
  { id: 1, senha: "Maria Fernanda Silva", guiche: "Consultório 3", time: "Agora" },
  { id: 2, senha: "Pedro Henrique Costa", guiche: "Recepção", time: "Há 5 min" },
  { id: 3, senha: "Ana Paula Souza", guiche: "Triagem", time: "Há 12 min" },
  { id: 4, senha: "Carlos Almeida", guiche: "Consultório 1", time: "Há 25 min" },
];

export default function PainelTVPage() {
  const [currentCall, setCurrentCall] = useState(MOCK_CALLS[0]);
  const [history, setHistory] = useState(MOCK_CALLS.slice(1));
  const [blink, setBlink] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Efeito de piscar na última chamada
  useEffect(() => {
    setBlink(true);
    const audio = new Audio("/bell.mp3"); // Apenas ilustrativo, o arquivo precisaria existir em /public
    // audio.play().catch(e => console.log("Audio play blocked by browser policy"));
    
    const timeout = setTimeout(() => setBlink(false), 5000); // Para de piscar após 5 seg
    return () => clearTimeout(timeout);
  }, [currentCall]);

  return (
    <div className="fixed inset-0 bg-zinc-950 flex overflow-hidden z-[100] font-sans text-white">
      {/* Lado Esquerdo - Mídia / Carrossel */}
      <div className="w-1/2 h-full bg-zinc-900 relative overflow-hidden flex flex-col items-center justify-center border-r-4 border-rd-cyan/30">
        <div className="absolute top-8 left-8 z-10 bg-zinc-950/80 p-4 rounded-2xl backdrop-blur-md">
          <Logo className="scale-150" />
        </div>
        
        {/* Imagem de Fundo Genérica (Simulando Institucional) */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-rd-cyan/20 to-blue-900/20" />
        
        <div className="z-10 text-center px-12">
          <h1 className="text-5xl font-heading font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rd-cyan to-white">
            Bem-vindo à MEDCore
          </h1>
          <p className="text-2xl text-zinc-300 font-medium">
            Por favor, aguarde ser chamado pelo painel. Tenha em mãos o seu documento.
          </p>
        </div>

        {/* Rodapé Esquerdo - Relógio */}
        <div className="absolute bottom-8 left-8 z-10">
           <h2 className="text-4xl font-bold font-heading">
             {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </h2>
           <p className="text-xl text-zinc-400 capitalize">
             {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
           </p>
        </div>
      </div>

      {/* Lado Direito - Senhas */}
      <div className="w-1/2 h-full flex flex-col bg-zinc-950">
        {/* Chamada Principal (Gigante) */}
        <div className={cn(
          "flex-1 flex flex-col items-center justify-center p-12 transition-colors duration-500",
          blink ? "bg-rd-cyan/20 border-b border-rd-cyan/50" : "bg-zinc-950 border-b border-zinc-800"
        )}>
          <div className="w-full text-center animate-in zoom-in duration-500">
            <div className="flex items-center justify-center gap-4 mb-6">
               <Megaphone className={blink ? "text-rd-cyan animate-bounce" : "text-zinc-500"} size={48} />
               <h2 className="text-3xl font-bold uppercase tracking-widest text-zinc-400">Próximo Paciente</h2>
            </div>
            
            <h1 className={cn(
              "text-7xl lg:text-8xl font-black font-heading tracking-tight mb-8 leading-tight",
              blink ? "text-white drop-shadow-[0_0_25px_rgba(45,212,191,0.8)] scale-105 transition-transform" : "text-white"
            )}>
              {currentCall.senha}
            </h1>
            
            <div className="inline-flex items-center gap-4 px-10 py-6 bg-zinc-900 border-2 border-rd-cyan rounded-3xl shadow-2xl">
              <MapPin className="text-rd-cyan" size={40} />
              <span className="text-5xl font-bold text-rd-cyan">{currentCall.guiche}</span>
            </div>
          </div>
        </div>

        {/* Histórico Recentes */}
        <div className="h-1/3 bg-zinc-900/50 p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Volume2 size={24} />
            Últimas Chamadas
          </h3>
          <div className="flex flex-col gap-4">
            {history.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <span className="text-3xl font-bold font-heading text-zinc-300 truncate max-w-[50%]">{item.senha}</span>
                <div className="flex items-center gap-6">
                  <span className="text-xl text-zinc-400 flex items-center gap-2">
                     <MapPin size={20} /> {item.guiche}
                  </span>
                  <span className="text-sm font-bold text-zinc-600 uppercase w-20 text-right">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
