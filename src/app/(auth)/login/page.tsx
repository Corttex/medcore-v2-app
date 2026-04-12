"use client";

import { LoginForm } from "@/modules/auth/components/LoginForm";
import { Logo } from "@/modules/shared/components/Logo";
import { ShieldCheck, Zap, Activity } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-0 lg:p-8">
      {/* Background Ambient Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px]"></div>
      </div>

      <main className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 min-h-screen lg:min-h-[800px] lg:h-[800px] overflow-hidden lg:rounded-[2rem] shadow-2xl border-none lg:border lg:border-outline-variant/15 glass-panel z-10 transition-all duration-700">
        
        {/* Left Side: Visual Narrative */}
        <div className="hidden lg:flex relative flex-col justify-end p-16 overflow-hidden">
          <img 
            alt="Professional medical environment" 
            className="absolute inset-0 object-cover w-full h-full grayscale brightness-[0.25] contrast-125 scale-110" 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          
          <div className="relative z-10 space-y-6">
            <Logo className="mb-8" iconSize={36} textSize="text-3xl" />
            
            <h1 className="font-heading text-6xl font-black tracking-tighter leading-[0.9] italic">
              The Clinical <br/>
              <span className="text-gradient">Observer.</span>
            </h1>
            
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed font-medium">
              Transformando dados clínicos complexos em inteligência executiva com precisão editorial e autoridade diagnóstica.
            </p>

            <div className="pt-12 grid grid-cols-3 gap-8 border-t border-outline-variant/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                   <ShieldCheck size={12} /> Precisão
                </div>
                <div className="font-heading font-black text-2xl">99.9%</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                   <Zap size={12} /> Latência
                </div>
                <div className="font-heading font-black text-2xl">&lt;12ms</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                   <Activity size={12} /> Status IA
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                  <span className="font-heading font-black text-xl uppercase tracking-tighter">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interaction */}
        <div className="flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-surface-container-low/30 backdrop-blur-md lg:border-l lg:border-outline-variant/10">
          <div className="w-full max-w-sm mx-auto">
            <div className="lg:hidden mb-12 flex justify-center">
              <Logo />
            </div>
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer Security Badge */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-20">
        <div className="flex items-center gap-3 px-6 py-2.5 bg-surface-container-low/60 backdrop-blur-md rounded-full border border-outline-variant/15 text-[10px] font-black text-on-surface-variant uppercase tracking-widest shadow-2xl transition-all hover:bg-surface-container-low/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Ambiente Seguro 256-bit TLS
        </div>
      </div>
    </div>
  );
}
