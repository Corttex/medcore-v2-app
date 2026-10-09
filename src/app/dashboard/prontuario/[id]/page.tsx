"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Video, Mic, StopCircle, FileText, ClipboardList, PenTool, CheckCircle, Wand2, History, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "historico", label: "Histórico", icon: History },
  { id: "anamnese", label: "Anamnese", icon: ClipboardList },
  { id: "prescricao", label: "Prescrição", icon: PenTool },
  { id: "arquivos", label: "Arquivos / Exames", icon: FileText },
];

export default function ProntuarioPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("anamnese");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [isTelemedicine, setIsTelemedicine] = useState(true); // Toggle just for UI display

  // Mock Form State
  const [form, setForm] = useState({
    motivoConsulta: "",
    historiaDoencaAtual: "",
    exameFisico: "",
    conduta: "",
  });

  // MediaRecorder State
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setIsProcessingAI(true);
        await uploadAudioAndProcess(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks([]);
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Por favor, permita o acesso ao microfone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const uploadAudioAndProcess = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "consulta.webm");

      const res = await fetch(`/api/prontuario/${params.id || 'demo'}/ai-scribe`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Erro ao processar áudio.");
      }

      const aiData = json.data;
      setForm({
        motivoConsulta: aiData.motivoConsulta || "",
        historiaDoencaAtual: aiData.historiaDoencaAtual || "",
        exameFisico: aiData.exameFisico || "",
        conduta: aiData.conduta || "",
      });
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao processar áudio pela IA.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleAIScribeToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden gap-4 p-4 animate-in fade-in duration-500">
      
      {/* Lado Esquerdo - Telemedicina & AI Scribe */}
      <div className={cn("flex flex-col gap-4 transition-all duration-300", isTelemedicine ? "w-1/3" : "w-[300px]")}>
        
        {/* Toggle Telemedicina (Só para demonstração) */}
        <div className="flex justify-between items-center px-2">
           <h2 className="text-lg font-heading font-bold text-on-surface">Consulta</h2>
           <button 
             onClick={() => setIsTelemedicine(!isTelemedicine)}
             className="text-xs font-bold text-rd-cyan px-3 py-1 bg-rd-cyan/10 rounded-full hover:bg-rd-cyan/20 transition-colors"
           >
             {isTelemedicine ? "Esconder Câmera" : "Ativar Telemedicina"}
           </button>
        </div>

        {/* Câmera de Telemedicina */}
        {isTelemedicine && (
          <div className="relative aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-outline-variant shadow-lg group">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
              <Video size={48} />
              <span className="absolute bottom-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Conectando...</span>
            </div>
            {/* Simulando pip do Médico */}
            <div className="absolute bottom-4 right-4 w-24 aspect-video bg-zinc-900 border-2 border-zinc-800 rounded-lg shadow-xl overflow-hidden">
               <div className="w-full h-full bg-zinc-800 animate-pulse" />
            </div>
          </div>
        )}

        {/* Painel do AI Scribe */}
        <div className="flex-1 bg-surface border border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          {/* Waveform effect when recording */}
          {isRecording && (
            <div className="absolute inset-0 bg-rd-cyan/5 pointer-events-none flex items-center justify-center opacity-50">
               <div className="w-48 h-48 bg-rd-cyan/20 rounded-full blur-3xl animate-pulse" />
            </div>
          )}

          <div className="mb-6 relative z-10">
             <div className={cn(
               "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer",
               isRecording ? "bg-red-500 text-white animate-pulse" : "bg-rd-cyan text-zinc-950 hover:scale-105",
               isProcessingAI ? "opacity-50 pointer-events-none" : ""
             )}
             onClick={handleAIScribeToggle}>
               {isProcessingAI ? (
                 <div className="w-8 h-8 border-4 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
               ) : isRecording ? (
                 <StopCircle size={32} />
               ) : (
                 <Mic size={32} />
               )}
             </div>
          </div>

          <h3 className="text-xl font-heading font-bold text-on-surface mb-2 relative z-10">
            {isRecording ? "Ouvindo a Consulta..." : isProcessingAI ? "IA Trabalhando..." : "MEDCore AI Scribe"}
          </h3>
          <p className="text-sm text-on-surface-variant relative z-10 max-w-xs">
            {isRecording 
              ? "Conduza a consulta normalmente. A inteligência artificial irá resumir e preencher o prontuário para você." 
              : "Clique no microfone para transcrever a consulta e gerar um resumo clínico estruturado."}
          </p>

          {!isRecording && !isProcessingAI && form.motivoConsulta && (
             <div className="mt-8 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in zoom-in">
               <CheckCircle size={16} /> Prontuário preenchido com sucesso
             </div>
          )}
        </div>
      </div>

      {/* Lado Direito - Prontuário Médico */}
      <div className="flex-1 flex flex-col bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        {/* Paciente Header */}
        <div className="p-4 md:p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface font-bold text-lg">
              JS
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-on-surface">João da Silva</h2>
              <p className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">Homem • 34 Anos • Convênio Unimed</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-outline-variant text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container transition-colors">
              Emitir Atestado
            </button>
            <button className="px-4 py-2 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2">
              <CheckCircle size={16} />
              Finalizar Consulta
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 px-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2",
                activeTab === tab.id 
                  ? "border-rd-cyan text-rd-cyan" 
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-container/5">
          {activeTab === "anamnese" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                 <Wand2 size={16} className="text-rd-cyan" />
                 <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gerado por IA ou Digitação Manual</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Motivo da Consulta (Queixa Principal)</label>
                <textarea 
                  className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface min-h-[100px] outline-none focus:border-rd-cyan transition-colors resize-y"
                  value={form.motivoConsulta}
                  onChange={(e) => setForm({...form, motivoConsulta: e.target.value})}
                  placeholder="Ex: Paciente relata dor de cabeça..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">História da Doença Atual (HDA)</label>
                <textarea 
                  className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface min-h-[120px] outline-none focus:border-rd-cyan transition-colors resize-y"
                  value={form.historiaDoencaAtual}
                  onChange={(e) => setForm({...form, historiaDoencaAtual: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Exame Físico</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface min-h-[120px] outline-none focus:border-rd-cyan transition-colors resize-y"
                    value={form.exameFisico}
                    onChange={(e) => setForm({...form, exameFisico: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Conduta / Plano Terapêutico</label>
                  <textarea 
                    className="w-full bg-surface border border-outline-variant rounded-xl p-4 text-on-surface min-h-[120px] outline-none focus:border-rd-cyan transition-colors resize-y"
                    value={form.conduta}
                    onChange={(e) => setForm({...form, conduta: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button className="px-6 py-3 bg-rd-cyan text-zinc-950 font-bold rounded-xl shadow-lg hover:bg-rd-cyan/90 transition-colors">
                  Salvar Rascunho
                </button>
              </div>
            </div>
          )}

          {activeTab === "prescricao" && (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-4 animate-in fade-in">
               <PenTool size={48} className="opacity-20" />
               <p className="font-bold">Módulo de Prescrição Digital (Memed)</p>
               <p className="text-sm max-w-sm text-center">Nesta aba o médico irá gerar receitas digitais integradas com farmácias usando o nosso gerador nativo.</p>
               <button className="mt-4 px-6 py-2 border border-outline-variant rounded-full text-sm font-bold text-on-surface hover:bg-surface-container">
                 + Nova Prescrição
               </button>
            </div>
          )}

          {activeTab === "historico" && (
            <div className="space-y-4 animate-in fade-in">
               <div className="p-4 border border-outline-variant rounded-xl bg-surface">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-on-surface">Consulta Dermatológica</h4>
                   <span className="text-xs font-bold text-on-surface-variant">15/08/2026</span>
                 </div>
                 <p className="text-sm text-on-surface-variant line-clamp-2">Paciente retornou para avaliação do melasma. Apresentou leve melhora. Orientado a continuar com ácido tranexâmico e protetor solar rigoroso.</p>
               </div>
               
               <div className="p-4 border border-outline-variant rounded-xl bg-surface opacity-60">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-on-surface">Consulta Inicial</h4>
                   <span className="text-xs font-bold text-on-surface-variant">10/01/2026</span>
                 </div>
                 <p className="text-sm text-on-surface-variant line-clamp-2">Queixa de manchas no rosto. Diagnosticado com melasma misto.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
