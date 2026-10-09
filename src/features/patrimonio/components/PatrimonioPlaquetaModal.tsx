"use client";

import React, { useRef } from "react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import { X, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PatrimonioPlaquetaModalProps {
  patrimonio: any;
  onClose: () => void;
  theme?: string;
}

export function PatrimonioPlaquetaModal({ patrimonio, onClose, theme = 'dark' }: PatrimonioPlaquetaModalProps) {
  const plaquetaRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!plaquetaRef.current) return;
    try {
      const canvas = await html2canvas(plaquetaRef.current, {
        scale: 4, // Alta resolução para impressão
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `plaqueta-${patrimonio.codigoTag}.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Não foi possível gerar a imagem da plaqueta.");
    }
  };

  const qrCodeUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard/os/nova?patrimonioId=${patrimonio.id}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className={cn(
        "rounded-3xl border shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95",
        theme === 'dark' ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"
      )}>
        <div className="flex justify-between items-center">
          <h2 className={cn(
            "font-heading text-xl font-bold",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}>
            Plaqueta de Identificação
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/20 transition-colors">
            <X size={20} className={theme === 'dark' ? "text-zinc-400" : "text-zinc-500"} />
          </button>
        </div>

        {/* Plaqueta Container */}
        <div className="flex justify-center p-4 bg-zinc-100 rounded-2xl border border-dashed border-zinc-300">
          <div 
            ref={plaquetaRef} 
            className="bg-white w-[300px] p-6 border-2 border-zinc-900 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 text-center"
            style={{ fontFamily: "sans-serif" }}
          >
            <div className="w-full flex items-center justify-between border-b-2 border-zinc-200 pb-2">
              <h1 className="text-xl font-black text-black tracking-tighter">MED<span className="text-blue-600">Core</span></h1>
              <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Patrimônio</span>
            </div>

            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col items-start text-left flex-1">
                <span className="text-sm font-bold text-zinc-400 uppercase">Equipamento</span>
                <strong className="text-sm font-black text-zinc-900 leading-tight">{patrimonio.nome}</strong>
                
                <span className="text-sm font-bold text-zinc-400 uppercase mt-2">Localização</span>
                <strong className="text-xs font-semibold text-zinc-700">{patrimonio.localizacao || "N/A"}</strong>
              </div>

              <div className="bg-white p-1 rounded-lg border shadow-sm">
                <QRCode value={qrCodeUrl} size={64} level="H" />
              </div>
            </div>

            <div className="w-full flex justify-center mt-2">
              <Barcode 
                value={patrimonio.codigoTag} 
                width={1.5} 
                height={40} 
                fontSize={12} 
                background="#ffffff" 
                lineColor="#000000" 
                displayValue={true} 
              />
            </div>
            
            <p className="text-xs font-medium text-zinc-400">Escaneie o QR Code para abrir Ordem de Serviço</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onClose} 
            className={cn(
              "flex-1 py-3 rounded-2xl text-[11px] font-semibold uppercase tracking-widest border transition-colors",
              theme === 'dark' ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-500 hover:bg-zinc-100"
            )}
          >
            Fechar
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 btn-gradient py-3 rounded-2xl text-[11px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <Download size={16} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
