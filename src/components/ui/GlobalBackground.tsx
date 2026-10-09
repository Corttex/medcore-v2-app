import React from "react";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-300 bg-background">
      {/* Imagem de Fundo Visível tanto em Light quanto Dark Mode */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
          alt="Background Texture" 
          className="w-full h-full object-cover grayscale brightness-95"
        />
      </div>

      {/* Mesh Gradient Animado */}
      {/* Esfera 1: Cyan (Azul Clínico) */}
      <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-[var(--color-rd-cyan)] rounded-full blur-[120px] opacity-15 dark:opacity-20 animate-float"></div>
      
      {/* Esfera 2: Mint (Azul Médico) */}
      <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-[#D0E9FD] dark:bg-[var(--color-rd-mint)] rounded-full blur-[150px] opacity-40 dark:opacity-40 animate-float-delayed"></div>
      
      {/* Esfera 3: Navy Sutil */}
      <div className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vw] bg-[var(--color-rd-navy)] rounded-full blur-[100px] opacity-[0.06] dark:opacity-5 animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
