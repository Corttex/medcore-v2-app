"use client";

import React, { useState } from "react";
import { 
  Camera, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  UploadCloud, 
  Sliders, 
  ArrowLeftRight, 
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface ClinicalPhoto {
  id: string;
  url: string;
  label: string;
  data: string;
  tipo: "antes" | "depois" | "evolucao";
  observacao?: string;
}

const MOCK_PHOTOS: ClinicalPhoto[] = [
  {
    id: "photo_1",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    label: "Pré-Procedimento (Glabela & Frontal)",
    data: "10/08/2026",
    tipo: "antes",
    observacao: "Linhas hipercinéticas moderadas em repouso."
  },
  {
    id: "photo_2",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    label: "Pós-Procedimento (14 dias)",
    data: "24/08/2026",
    tipo: "depois",
    observacao: "Bloqueio muscular satisfatório com aspecto natural."
  }
];

export function PhotoUploadCompareModal({ patientId = "demo" }: { patientId?: string }) {
  const [photos, setPhotos] = useState<ClinicalPhoto[]>(MOCK_PHOTOS);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showQrCodeModal, setShowQrCodeModal] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Simular recebimento em tempo real do celular
  const handleSimulateMobileUpload = () => {
    setUploadSuccess(true);
    const newPhoto: ClinicalPhoto = {
      id: "photo_" + Date.now(),
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      label: "Foto Capturada via Smartphone",
      data: "Hoje, 24/10/2026",
      tipo: "evolucao",
      observacao: "Sincronizado automaticamente via QR Code instantâneo."
    };
    setPhotos([newPhoto, ...photos]);
    setTimeout(() => {
      setShowQrCodeModal(false);
      setUploadSuccess(false);
    }, 2000);
  };

  const fotoAntes = photos.find(p => p.tipo === "antes") || photos[0];
  const fotoDepois = photos.find(p => p.tipo === "depois") || photos[1] || photos[0];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30 flex items-center gap-1">
              <Camera size={11} /> Registro Fotográfico Forense
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">Benchmark: Clínica Experts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1">
            Galeria Clínica & Comparador Antes / Depois
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Capture fotos diretamente do smartphone apontando a câmera para o QR Code sem precisar conectar cabos ou transferir arquivos.
          </p>
        </div>

        <button
          onClick={() => setShowQrCodeModal(true)}
          className="px-4 py-2.5 rounded-2xl text-xs font-heading font-extrabold uppercase tracking-wider bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 transition-all shadow-md shadow-rd-cyan/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <QrCode size={16} /> Fotografar pelo Celular (QR Code)
        </button>
      </div>

      {/* Grid Principal: Comparador Deslizante Antes/Depois (6 cols) + Galeria Cronológica (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lado Esquerdo: Comparador Deslizante Interativo */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Sliders size={14} className="text-rd-cyan" /> Comparador Deslizante Interativo
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Arraste o slider para comparar</span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-xl select-none">
            {/* Imagem "Depois" (Fundo) */}
            <img 
              src={fotoDepois.url} 
              alt="Depois" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
              DEPOIS ({fotoDepois.data})
            </div>

            {/* Imagem "Antes" (Com Clip Path baseado no Slider) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={fotoAntes.url} 
                alt="Antes" 
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
                ANTES ({fotoAntes.data})
              </div>
            </div>

            {/* Barra Divisora com Ícone */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl border-2 border-zinc-900 -translate-x-1/2">
                <ArrowLeftRight size={14} />
              </div>
            </div>

            {/* Input Slider Invisível por cima para arrasto suave */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-zinc-400 truncate">
              <strong>Procedimento:</strong> {fotoDepois.label}
            </span>
            <span className="text-zinc-500 text-[11px] shrink-0 font-mono">
              Evolução documentada com assinatura digital
            </span>
          </div>
        </div>

        {/* Lado Direito: Histórico Cronológico de Fotos do Paciente */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Histórico de Sessões Fotográficas</span>
            <span className="text-[10px] font-mono text-zinc-500">{photos.length} registros</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="p-3 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl flex gap-3 items-center transition-all group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 relative">
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className={`absolute bottom-0 inset-x-0 text-center text-[8px] font-mono font-bold uppercase py-0.5 ${
                    photo.tipo === "antes" ? "bg-amber-500/90 text-zinc-950" : photo.tipo === "depois" ? "bg-emerald-500/90 text-zinc-950" : "bg-rd-cyan/90 text-zinc-950"
                  }`}>
                    {photo.tipo}
                  </span>
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white truncate">{photo.label}</p>
                    <span className="text-[10px] font-mono text-zinc-500">{photo.data}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5 line-clamp-1">{photo.observacao}</p>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1 font-mono">
                    <ShieldCheck size={11} className="text-emerald-400" /> Criptografado AES-256
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal QR Code para Captura Direta no Smartphone */}
      {showQrCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border-2 border-rd-cyan/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-rd-cyan/20 border border-rd-cyan/40 text-rd-cyan flex items-center justify-center mx-auto">
              <Smartphone size={24} />
            </div>

            <div>
              <h3 className="text-lg font-heading font-extrabold text-white">
                Fotografar com o Celular
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Aponte a câmera do seu smartphone para o QR Code abaixo. A foto cairá instantaneamente neste prontuário sem salvar no rolo do seu celular.
              </p>
            </div>

            {/* Simulação de QR Code estilizado */}
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-lg relative group">
              <QrCode size={160} className="text-zinc-950" />
              <div className="absolute inset-0 bg-rd-cyan/10 rounded-2xl pointer-events-none" />
            </div>

            <div className="text-[10px] font-mono text-zinc-400">
              Sessão Temporária: <strong className="text-rd-cyan">MED-SYNC-{patientId.slice(0, 6)}</strong>
            </div>

            {uploadSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-in zoom-in">
                <CheckCircle2 size={16} /> Foto recebida com sucesso!
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSimulateMobileUpload}
                  className="w-full py-2.5 rounded-xl bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-rd-cyan/20 cursor-pointer"
                >
                  Simular Disparo do Celular
                </button>
                <button
                  onClick={() => setShowQrCodeModal(false)}
                  className="w-full py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
