"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, X, FileText, Download, ZoomIn, RotateCcw, Check, Loader2 } from "lucide-react";

interface ScannedDoc {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  uploadedAt: string;
  driveLink: string | null;
}

const CATEGORIES = ["Contrato", "Licença ANVISA", "Alvará", "Relatório", "Nota Fiscal", "Recibo", "Prontuário", "Outro"];

export default function ScannerPage() {
  const [step, setStep] = useState<"idle" | "preview" | "saved">("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Outro");
  const [docs, setDocs] = useState<ScannedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      setCameraOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
    } catch {
      alert("Câmera não disponível. Use o upload de arquivo.");
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    setStep("preview");
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target?.result as string);
      setDocName(file.name.replace(/\.[^/.]+$/, ""));
      setStep("preview");
    };
    reader.readAsDataURL(file);
  };

  const saveDoc = async () => {
    if (!capturedImage || !docName.trim()) return;
    setUploading(true);
    // Simula upload ao Google Drive (Google Drive API OAuth2 pode ser adicionado aqui futuramente)
    await new Promise(r => setTimeout(r, 1500));
    const newDoc: ScannedDoc = {
      id: Date.now().toString(),
      name: docName,
      imageUrl: capturedImage,
      category: docCategory,
      uploadedAt: new Date().toLocaleString("pt-BR"),
      driveLink: null, // será preenchido com a Google Drive API
    };
    setDocs(prev => [newDoc, ...prev]);
    setUploading(false);
    setCapturedImage(null);
    setDocName("");
    setDocCategory("Outro");
    setStep("idle");
  };

  const discard = () => {
    setCapturedImage(null);
    stopCamera();
    setStep("idle");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Scanner</span>
        <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
          Scanner de <span className="text-gradient">Documentos</span>
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">{docs.length} documento{docs.length !== 1 ? "s" : ""} anexado{docs.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Info banner sobre Google Drive */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
        <span className="text-blue-600 text-lg shrink-0">☁️</span>
        <div>
          <p className="text-sm font-black text-blue-800">Google Drive (em breve)</p>
          <p className="text-xs text-blue-700 mt-0.5">Integração com Google Drive API para upload automático com link compartilhável. Por enquanto, documentos são armazenados localmente na sessão.</p>
        </div>
      </div>

      {/* Capture area */}
      {step === "idle" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={openCamera}
            className="group flex flex-col items-center justify-center gap-4 p-10 bg-surface rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Camera size={28} className="text-white"/>
            </div>
            <div className="text-center">
              <p className="font-heading font-black text-on-surface">Abrir Câmera</p>
              <p className="text-xs text-on-surface-variant mt-1">Use a câmera do dispositivo para escanear</p>
            </div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="group flex flex-col items-center justify-center gap-4 p-10 bg-surface rounded-3xl border-2 border-dashed border-outline-variant/60 hover:border-primary/40 hover:bg-surface-container-low transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container border border-outline-variant/50 flex items-center justify-center group-hover:border-primary/40 transition-colors">
              <Upload size={28} className="text-on-surface-variant group-hover:text-primary transition-colors"/>
            </div>
            <div className="text-center">
              <p className="font-heading font-black text-on-surface">Upload de Arquivo</p>
              <p className="text-xs text-on-surface-variant mt-1">Imagem ou PDF do seu computador</p>
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload}/>
        </div>
      )}

      {/* Camera stream */}
      {cameraOpen && (
        <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-3xl" style={{ maxHeight: 400 }}/>
          <canvas ref={canvasRef} className="hidden"/>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button onClick={capture} className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg hover:scale-105 transition-transform"/>
            <button onClick={stopCamera} className="flex items-center gap-2 px-4 py-3 rounded-full bg-black/70 text-white font-bold text-sm">
              <X size={16}/> Cancelar
            </button>
          </div>
          <div className="absolute inset-0 pointer-events-none border-2 border-primary/40 rounded-3xl" style={{ margin: "10%" }}/>
        </div>
      )}

      {/* Preview + categorize */}
      {step === "preview" && capturedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <img src={capturedImage} alt="Documento capturado" className="w-full rounded-2xl border border-outline-variant/40 shadow-md object-contain max-h-80"/>
            <button onClick={discard} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error/90 text-white flex items-center justify-center hover:bg-error">
              <X size={14}/>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Nome do Documento *</label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                placeholder="Ex: Licença ANVISA 2026"
                value={docName}
                onChange={e => setDocName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Categoria</label>
              <select
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                value={docCategory}
                onChange={e => setDocCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={discard} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold flex items-center justify-center gap-2">
                <RotateCcw size={15}/> Descartar
              </button>
              <button onClick={saveDoc} disabled={!docName.trim() || uploading} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 disabled:opacity-60">
                {uploading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}
                {uploading ? "Salvando..." : "Salvar Doc."}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved docs */}
      {docs.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Documentos Salvos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {docs.map(doc => (
              <div key={doc.id} className="group bg-surface rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-40 bg-surface-container overflow-hidden relative">
                  <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-contain"/>
                  <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/10 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-on-surface truncate">{doc.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{doc.category} · {doc.uploadedAt}</p>
                  {doc.driveLink ? (
                    <a href={doc.driveLink} target="_blank" className="text-xs text-primary font-bold mt-2 flex items-center gap-1 hover:underline">
                      ☁️ Ver no Drive
                    </a>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant/60 mt-2">Drive: aguardando integração</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
