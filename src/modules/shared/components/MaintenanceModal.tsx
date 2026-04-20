"use client";

import React from "react";
import { Wrench, Clock, X, AlertTriangle } from "lucide-react";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  message: string;
}

export function MaintenanceModal({ isOpen, onClose, moduleName, message }: MaintenanceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface shadow-card animate-in fade-in zoom-in duration-300">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-brand/20 blur-[80px]" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-outline-variant/30 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg- brand/10 text-brand">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-on-surface">Módulo em Manutenção</h3>
              <p className="text-sm text-on-surface-variant">{moduleName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Body */}
        <div className="relative p-6 space-y-4">
          <div className="flex items-start gap-4 rounded-xl bg-brand/5 p-4 border border-brand/10">
            <AlertTriangle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed text-on-surface/90">
              {message}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Clock className="h-4 w-4" />
            <span>Nossa equipe está trabalhando para liberar este recurso em breve.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-outline-variant/30 p-6 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-brand py-3 font-bold text-white shadow-lg shadow-brand/20 hover:bg-brand-container transition-all"
          >
            Entendi, volterei mais tarde
          </button>
        </div>
      </div>
    </div>
  );
}
