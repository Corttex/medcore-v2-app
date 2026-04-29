"use client";

import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import { Logo } from "@/modules/shared/components/Logo";
import { ShieldCheck, Zap, Activity, Users } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="h-screen bg-black text-on-surface grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      
      {/* Left Side: Immersive Visual (Image) */}
      <div className="hidden lg:flex relative flex-col justify-end p-20 overflow-hidden">
        <img 
          alt="Profissionais médicos analisando dados" 
          className="absolute inset-0 object-cover w-full h-full grayscale brightness-[0.2] contrast-125 scale-110" 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
        />
        {/* Violet Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent mix-blend-overlay"></div>
        
        <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-4">
            <h1 className="font-heading text-6xl font-black tracking-tighter leading-[0.85] italic">
              Expanda sua <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400">Eficiência.</span>
            </h1>
            <p className="text-zinc-400 max-w-md text-xl leading-relaxed font-medium">
              Junte-se à maior rede de gestão inteligente e auditoria médica do país.
            </p>
          </div>

          <div className="pt-12 grid grid-cols-2 gap-10 border-t border-zinc-800/50">
            <div className="space-y-2 group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/80">
                 <ShieldCheck size={14} /> Segurança Superior
              </div>
              <div className="font-heading font-black text-2xl text-white">LGPD Compliance</div>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/80">
                 <Users size={14} /> Escalabilidade
              </div>
              <div className="font-heading font-black text-2xl text-white">Multi-unidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Interaction (Register Form) */}
      <div className="relative flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-zinc-950/20 backdrop-blur-3xl lg:border-l lg:border-zinc-800/20">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden grayscale brightness-[0.3] contrast-125 opacity-20 mix-blend-screen">
          <img 
            src="/images/bg-auth.png" 
            alt="Medical Background" 
            className="w-full h-full object-cover scale-110"
          />
        </div>

        {/* Background Ambient Elements (Violet/Teal Glows) */}
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[480px] relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
          <div className="lg:hidden mb-12">
            <Logo />
          </div>
          
          <main className="w-full">
            <RegisterForm />
          </main>

          {/* Floating Security Badge - Now inside the content flow for perfect alignment */}
          <div className="mt-8 flex justify-center pointer-events-none animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-3 px-6 py-2.5 bg-zinc-900/60 backdrop-blur-xl rounded-full border border-zinc-800/80 text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-2xl transition-all hover:bg-zinc-900/90 group">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6] animate-pulse"></span>
              <span className="group-hover:text-violet-300 transition-colors">Processamento em Tempo Real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
