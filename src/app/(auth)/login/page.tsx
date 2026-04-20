"use client";

import { LoginForm } from "@/modules/auth/components/LoginForm";
import { Logo } from "@/modules/shared/components/Logo";
import { ShieldCheck, Zap, Activity } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="h-screen bg-black text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden grayscale brightness-[0.3] contrast-125 opacity-20 mix-blend-screen">
        <img 
          src="/images/bg-auth.png" 
          alt="Medical Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Background Ambient Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center">
        {/* Logo and Slogan Section */}
        <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Logo width={180} height={54} />
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">
            Seu painel totalmente personalizado
          </p>
        </div>

        {/* Login Form Container */}
        <main className="w-full relative animate-in fade-in zoom-in-95 duration-700 delay-150">
          <LoginForm />
        </main>

        {/* Footer Security Badge */}
        <div className="mt-8 flex justify-center animate-in fade-in duration-1000 delay-300">
          <div className="group flex items-center gap-3 px-6 py-2.5 bg-zinc-900/60 backdrop-blur-xl rounded-full border border-zinc-800/80 text-[10px] font-black text-zinc-400 uppercase tracking-widest shadow-2xl transition-all hover:bg-zinc-900/90 shadow-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
            <span className="group-hover:text-emerald-300 transition-colors">Ambiente Seguro 256-bit TLS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
