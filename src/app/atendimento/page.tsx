"use client";

import React, { useState, useEffect } from "react";
import { Search, Clock, FileText, Bot, FileSignature, Pill, Printer, BrainCircuit, User, Mic, MicOff, Loader2, Camera, Package, Handshake, Upload, Play, CheckCircle2 } from "lucide-react";

export default function AtendimentoPage() {
  const [activeTab, setActiveTab] = useState("prontuario"); 
  const [fila, setFila] = useState<any[]>([]);
  const [activePacienteId, setActivePacienteId] = useState<string | null>(null);
  
  // IA States
  const [isListening, setIsListening] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Load Fila
  useEffect(() => {
    fetchFila();
  }, []);

  const fetchFila = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/meetings?date=${today}`);
      if (res.ok) {
        const data = await res.json();
        setFila(data);
        if (data.length > 0 && !activePacienteId) {
          setActivePacienteId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activePaciente = fila.find(p => p.id === activePacienteId) || null;

  // Simulate AI Listening
  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate picking up some keywords
      setTimeout(() => {
        setAiSuggestions(prev => [...prev, "Paciente refere tosse seca há 2 semanas."]);
      }, 3000);
      setTimeout(() => {
        setAiSuggestions(prev => [...prev, "Nega febre. Possível quadro alérgico ou refluxo."]);
      }, 6000);
    } else {
      setIsListening(false);
    }
  };

  const handleGeneratePrescription = () => {
    setIsGenerating(true);
    setActiveTab("receita");
    setTimeout(() => {
      setPrescriptionText("1. Loratadina 10mg - Tomar 1 comprimido via oral 1 vez ao dia por 5 dias.\n\n2. Prednisona 20mg - Tomar 1 comprimido via oral pela manhã por 3 dias.\n\nRecomendações: Evitar poeira, mofo e mudanças bruscas de temperatura. Aumentar ingestão hídrica.");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Coluna Esquerda: Fila de Pacientes (Aproximadamente 25%) */}
      <aside className="w-72 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col shrink-0">
        <div className="p-4 border-b border-outline-variant/10">
          <h2 className="font-heading font-semibold text-sm text-zinc-300 uppercase tracking-widest mb-4">Agenda do Dia</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar paciente..." 
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {fila.length === 0 && <p className="text-xs text-zinc-500 text-center mt-4">Nenhuma consulta hoje.</p>}
          {fila.map((p) => (
            <button 
              key={p.id} 
              onClick={() => setActivePacienteId(p.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${activePacienteId === p.id ? 'bg-rd-cyan/10 border-rd-cyan/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' : 'bg-surface border-transparent hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm text-white truncate pr-2">{p.paciente?.nome || p.title}</span>
                <span className="text-xs text-zinc-400 font-mono mt-0.5">{p.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${activePacienteId === p.id ? 'bg-rd-cyan animate-pulse' : p.status === 'AGENDADO' ? 'bg-amber-500' : 'bg-zinc-500'}`}></div>
                <span className="text-sm uppercase font-bold text-zinc-400 tracking-wider">{p.status}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Área Central: Documentos Médicos (Aproximadamente 50%) */}
      <section className="flex-1 bg-background flex flex-col border-r border-outline-variant/20 relative">
        <div className="h-16 flex items-center gap-6 px-6 border-b border-outline-variant/10 shrink-0 bg-surface/50 backdrop-blur-md overflow-x-auto custom-scrollbar">
           <button onClick={() => setActiveTab("prontuario")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'prontuario' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <FileText size={16}/> Evolução Clínica
           </button>
           <button onClick={() => setActiveTab("receita")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'receita' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <Pill size={16}/> Prescrição / Receita
           </button>
           <button onClick={() => setActiveTab("fotos")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'fotos' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <Camera size={16}/> Galeria & Antes/Depois
           </button>
           <button onClick={() => setActiveTab("pacotes")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'pacotes' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <Package size={16}/> Pacotes e Sessões
           </button>
           <button onClick={() => setActiveTab("termos")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'termos' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <Handshake size={16}/> Termos & Assinaturas
           </button>
           <button onClick={() => setActiveTab("atestado")} className={`h-full flex items-center gap-2 px-1 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${activeTab === 'atestado' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-white'}`}>
             <FileSignature size={16}/> Atestado
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Cabecalho do Documento */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-white mb-1">
                  {activePaciente ? (activePaciente.paciente?.nome || activePaciente.title) : 'Selecione um paciente'}
                </h1>
                {activePaciente && (
                  <p className="text-sm text-zinc-400">Agendado para: {activePaciente.time} • Convênio: {activePaciente.convenio?.nome || 'Particular'}</p>
                )}
              </div>
              <button 
                disabled={activeTab === 'receita' && !prescriptionText}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title={activeTab === 'receita' && !prescriptionText ? "Preencha a receita antes de imprimir" : "Imprimir Documento"}
              >
                <Printer size={16} /> Imprimir PDF
              </button>
            </div>

            {/* Conteúdo Dinâmico baseado na Aba */}
            {activeTab === 'prontuario' && (
              <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Motivo da Consulta & Queixa Principal (QP)</label>
                <textarea 
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors min-h-[100px] resize-none mb-6"
                  placeholder="Paciente refere dor de cabeça intensa há 3 dias..."
                />
                
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Exame Físico & Hipóteses</label>
                <textarea 
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors min-h-[200px] resize-none"
                  placeholder="PA 120x80, Ritmo cardíaco regular..."
                />
              </div>
            )}

            {activeTab === 'receita' && (
              <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm z-10 rounded-2xl flex flex-col items-center justify-center gap-3">
                    <Loader2 size={32} className="text-rd-cyan animate-spin" />
                    <p className="text-sm font-semibold text-rd-cyan animate-pulse">A IA está gerando a sugestão de prescrição...</p>
                  </div>
                )}
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Medicamentos Prescritos
                  {prescriptionText && <span className="text-emerald-400 text-sm bg-emerald-400/10 px-2 py-0.5 rounded-full">Pronto para Revisão Médica</span>}
                </label>
                <textarea 
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors min-h-[300px] resize-none leading-relaxed"
                  placeholder="A prescrição aparecerá aqui. Você pode editá-la livremente antes de imprimir."
                />
              </div>
            )}

            {activeTab === 'atestado' && (
              <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Dias de Repouso</label>
                    <input type="number" className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan" placeholder="Ex: 3" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">CID (Opcional)</label>
                    <input type="text" className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rd-cyan" placeholder="Ex: J00" />
                  </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Texto Livre Adicional</label>
                    <textarea 
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-rd-cyan transition-colors min-h-[150px] resize-none"
                      placeholder="Necessita afastamento de suas atividades laborais..."
                    />
                </div>
              </div>
            )}

            {activeTab === 'fotos' && (
              <div className="space-y-6">
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Camera className="text-rd-cyan"/> Galeria Clínica</h3>
                    <p className="text-sm text-zinc-400">Registre a evolução do tratamento</p>
                  </div>
                  <button className="flex items-center gap-2 bg-rd-cyan text-zinc-950 px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
                    <Upload size={16}/> Adicionar Mídia
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mock Before */}
                  <div className="bg-surface border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-48 bg-black/40 flex items-center justify-center relative group">
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-sm font-bold uppercase tracking-widest px-2 py-1 rounded-md">ANTES (01/Ago)</div>
                      <Camera size={32} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white font-medium">Sessão 1 - Avaliação Inicial</p>
                      <p className="text-xs text-zinc-400">Manchas e cicatrizes de acne grau II.</p>
                    </div>
                  </div>
                  
                  {/* Mock After */}
                  <div className="bg-surface border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                    <div className="h-48 bg-black/40 flex items-center justify-center relative group">
                      <div className="absolute top-2 left-2 bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30 text-sm font-bold uppercase tracking-widest px-2 py-1 rounded-md">HOJE (16/Set)</div>
                      <Camera size={32} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-white font-medium">Sessão 5 - Evolução</p>
                      <p className="text-xs text-zinc-400">Melhora significativa da textura da pele.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pacotes' && (
              <div className="space-y-6">
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Package className="text-rd-cyan"/> Pacotes Ativos</h3>
                    <p className="text-sm text-zinc-400">Controle de sessões vendidas e realizadas</p>
                  </div>
                  <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                    Vender Novo Pacote
                  </button>
                </div>
                
                {/* Mock Pacote */}
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h4 className="text-md font-bold text-white">Depilação a Laser - Perna Inteira</h4>
                       <p className="text-xs text-emerald-400 mt-1 font-medium bg-emerald-400/10 inline-block px-2 py-0.5 rounded-full">ATIVO</p>
                     </div>
                     <div className="text-right">
                       <p className="text-2xl font-bold text-rd-cyan">5 <span className="text-sm text-zinc-500 font-medium">/ 10</span></p>
                       <p className="text-sm text-zinc-400 uppercase tracking-widest">Sessões Realizadas</p>
                     </div>
                  </div>
                  
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-rd-cyan h-full rounded-full w-1/2"></div>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20 py-3 rounded-xl text-sm font-bold hover:bg-rd-cyan/20 transition-colors">
                    <Play size={16} /> Registrar Presença na Sessão 6 (Hoje)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'termos' && (
              <div className="space-y-6">
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Handshake className="text-rd-cyan"/> Consentimento Informado</h3>
                    <p className="text-sm text-zinc-400">Colete assinaturas digitais antes de procedimentos</p>
                  </div>
                  <button className="flex items-center gap-2 bg-rd-cyan text-zinc-950 px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
                    Novo Termo
                  </button>
                </div>
                
                {/* Mock Termo Assinado */}
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Aplicação de Toxina Botulínica</p>
                      <p className="text-xs text-zinc-400">Assinado em 10/Set/2026 via WhatsApp (Hash: a8f9...2bc)</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest px-3 py-1 bg-black/30 rounded-lg">Ver PDF</button>
                </div>
                
                {/* Mock Termo Pendente */}
                <div className="bg-surface border border-outline-variant/20 rounded-2xl p-5 shadow-sm flex items-center justify-between border-l-2 border-l-amber-500 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Termo de Ciência - Peeling Químico</p>
                      <p className="text-xs text-amber-500/80">Pendente de assinatura do paciente</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 uppercase tracking-widest px-3 py-1 rounded-lg">Enviar Link</button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10 shrink-0 flex justify-end gap-3">
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors">Salvar Rascunho</button>
          <button className="px-6 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:scale-105 transition-all">Finalizar Atendimento</button>
        </div>
      </section>

      {/* Coluna Direita: IA de Suporte */}
      <aside className="w-80 bg-surface shrink-0 flex flex-col relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] border-l border-outline-variant/20">
        <div className="p-4 border-b border-outline-variant/10 bg-gradient-to-r from-blue-900/20 to-rd-cyan/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
              <BrainCircuit size={18} className="text-blue-400" />
            </div>
            <div>
               <h3 className="text-sm font-bold text-blue-300">MedCore Copilot</h3>
               <p className="text-sm text-blue-300/60 uppercase tracking-widest">Escuta Ativa</p>
            </div>
          </div>
          <button 
            onClick={toggleListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-error text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-surface-container-low text-zinc-400 hover:text-white'}`}
            title={isListening ? "Parar Escuta" : "Ouvir Consulta (Microfone)"}
          >
            {isListening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {isListening && (
            <div className="flex justify-center py-2">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}

          {aiSuggestions.map((text, i) => (
             <div key={i} className="bg-black/30 border border-blue-500/20 rounded-2xl p-4 animate-in slide-in-from-right-4 duration-500">
               <p className="text-xs text-blue-100/90 leading-relaxed font-medium">
                 {text}
               </p>
             </div>
          ))}

          {aiSuggestions.length > 0 && !isListening && (
            <div className="pt-4 border-t border-white/5 animate-in fade-in">
              <button 
                onClick={handleGeneratePrescription}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-rd-cyan py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-rd-cyan/20 hover:scale-[1.02] transition-transform"
              >
                <Bot size={16} /> Gerar Sugestão de Prescrição
              </button>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pergunte à Inteligência Executiva..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors">
              <Bot size={16} />
            </button>
          </div>
        </div>
      </aside>

    </div>
  );
}
