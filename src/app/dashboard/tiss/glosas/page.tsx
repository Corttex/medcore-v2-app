"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  ArrowUpRight,
  ChevronRight,
  Search,
  Database,
  Lock,
  Zap,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlosaItem {
  id: string;
  guiaNumero: string;
  pacienteNome: string;
  convenio: string;
  procedimento: string;
  valorGlosa: number;
  codigoGlosa: string;
  motivoGlosa: string;
  prontuarioSnippet: string;
  status: "glosada" | "recurso_gerado" | "enviada_ao_convenio" | "revertida";
  justificativaIA?: string;
}

export default function GlosasAuditoriaPage() {
  const [selectedGlosa, setSelectedGlosa] = useState<GlosaItem | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [cronRunning, setCronRunning] = useState(false);

  const [glosas, setGlosas] = useState<GlosaItem[]>([
    {
      id: "GL-1049",
      guiaNumero: "TISS-3490182",
      pacienteNome: "Carlos Eduardo Mendes",
      convenio: "Bradesco Saúde Top Nacional",
      procedimento: "40101010 - Consulta Médica em Pronto Atendimento",
      valorGlosa: 185.0,
      codigoGlosa: "1801",
      motivoGlosa: "Ausência de justificativa clínica para atendimento em caráter de urgência/emergência.",
      prontuarioSnippet: "Paciente deu entrada às 02h40 com quadro de dor precordial ventilatório-dependente, sudorese fria e pico hipertensivo (PA 170x100 mmHg). Realizado ECG e troponina imediata.",
      status: "glosada",
    },
    {
      id: "GL-1050",
      guiaNumero: "TISS-3490185",
      pacienteNome: "Beatriz Nogueira",
      convenio: "Amil One S6500",
      procedimento: "40808033 - Ressonância Magnética de Crânio",
      valorGlosa: 1150.0,
      codigoGlosa: "1409",
      motivoGlosa: "Não preenchimento dos critérios da Diretriz de Utilização (DUT) para indicação de contraste paramagnético.",
      prontuarioSnippet: "Investigação de lesão expansiva intracraniana com queixa de cefaleia refratária progressiva há 3 semanas acompanhada de escotomas visuais. Uso de contraste estritamente indicado para delimitação vascular da lesão.",
      status: "recurso_gerado",
      justificativaIA: "Prezados auditores da Amil One: Conforme documentado no Prontuário Eletrônico Certificado (CFM 1.821/07), a paciente apresentou quadro neurológico focal progressivo e cefaleia atípica com sinais de alarme ('red flags'). O uso do contraste paramagnético é imperativo segundo a DUT ANS nº 52 e literatura médica vigente para caracterização morfológica e diagnóstico diferencial de lesão neoplásica primária. Requer-se o cancelamento integral da glosa e liberação do pagamento."
    },
    {
      id: "GL-1051",
      guiaNumero: "TISS-3490199",
      pacienteNome: "Fernanda Albuquerque",
      convenio: "SulAmérica Especial 100",
      procedimento: "30101786 - Sutura de Múltiplos Ferimentos Extensos",
      valorGlosa: 580.0,
      codigoGlosa: "2005",
      motivoGlosa: "Cobrança duplicada ou código incompatível com tempo cirúrgico.",
      prontuarioSnippet: "Realizada síntese de 3 ferimentos incisos distintos em antebraço e dorso da mão direita resultantes de acidente doméstico com vidro, cada ferimento medindo mais de 4cm e exigindo planos subdérmicos.",
      status: "glosada",
    },
  ]);

  const handleGenerateRecurso = async (item: GlosaItem) => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch("/api/tiss/recurso-glosa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          glosaId: item.id,
          guiaNumero: item.guiaNumero,
          convenio: item.convenio,
          prontuarioSnippet: item.prontuarioSnippet,
          motivoGlosa: item.motivoGlosa,
          codigoGlosa: item.codigoGlosa
        })
      });
      const data = await res.json();
      const generated = data.recursoTexto || "Recurso formulado com sucesso.";

      setGlosas((prev) =>
        prev.map((g) => (g.id === item.id ? { ...g, status: "recurso_gerado", justificativaIA: generated } : g))
      );
      setSelectedGlosa({ ...item, status: "recurso_gerado", justificativaIA: generated });
    } catch (err) {
      console.error("Erro no Agente de Glosas:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSimularRpaCron = () => {
    setCronRunning(true);
    setTimeout(() => {
      setCronRunning(false);
      alert("🤖 RPA Dra. Conte finalizou a varredura noturna nos portais TISS!\n\n• 42 carteirinhas checadas para a agenda de amanhã.\n• 3 carteirinhas bloqueadas sinalizadas na recepção.\n• 2 senhas de autorização de SADT capturadas automaticamente.");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header com Dra. Conte Auditora */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-rd-cyan/10 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rd-cyan/20 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan shadow-lg shadow-rd-cyan/10">
            <Bot className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Skill Dra. Conte: Auditoria de Glosas & RPA TISS</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> IA Generativa & Automação
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Varredura de portais de operadoras, contestação automática com base no prontuário SOAP e reversão de glosas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimularRpaCron}
            disabled={cronRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {cronRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            {cronRunning ? "Executando RPA..." : "Disparar RPA Noturno"}
          </button>
        </div>
      </div>

      {/* Grid de Métricas de Glosas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Glosado (Mês)</span>
          <p className="text-3xl font-black text-red-400">R$ 1.915,00</p>
          <p className="text-xs text-zinc-500">3 guias contestáveis</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Taxa de Reversão IA</span>
          <p className="text-3xl font-black text-emerald-400">89.4%</p>
          <p className="text-xs text-zinc-500">Com embasamento CFM/SOAP</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Elegibilidade Prévia (RPA)</span>
          <p className="text-3xl font-black text-rd-cyan">100%</p>
          <p className="text-xs text-zinc-500">Varredura automática ativa</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tempo Médio de Resposta</span>
          <p className="text-3xl font-black text-white">4.2 min</p>
          <p className="text-xs text-zinc-500">Redução de 3 dias humanos</p>
        </div>
      </div>

      {/* Lista de Glosas e Painel de Redação de Recurso */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna da Esquerda: Fila de Glosas Recebidas */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Glosas Recebidas para Auditoria ({glosas.length})
          </span>

          {glosas.map((item) => {
            const isSelected = selectedGlosa?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedGlosa(item)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group text-left space-y-2",
                  isSelected
                    ? "bg-zinc-900 border-rd-cyan/50 shadow-lg shadow-rd-cyan/5"
                    : "bg-zinc-950/50 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rd-cyan">
                    {item.id} • {item.convenio.split(" ")[0]}
                  </span>
                  <span className="font-mono text-xs font-bold text-red-400">
                    {item.valorGlosa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-white truncate">{item.pacienteNome}</h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{item.procedimento}</p>

                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-amber-400 font-bold">Cód. Glosa {item.codigoGlosa}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded font-black uppercase tracking-wider",
                      item.status === "recurso_gerado"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    )}
                  >
                    {item.status === "recurso_gerado" ? "Recurso Pronto" : "Pendente"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coluna da Direita: Detalhe & Geração de Recurso com IA */}
        <div className="lg:col-span-2">
          {selectedGlosa ? (
            <div className="p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rd-cyan">{selectedGlosa.id}</span>
                    <span className="text-xs text-zinc-400">Guia: <strong>{selectedGlosa.guiaNumero}</strong></span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mt-0.5">
                    {selectedGlosa.pacienteNome} — {selectedGlosa.convenio}
                  </h3>
                </div>

                <span className="text-2xl font-black text-red-400">
                  {selectedGlosa.valorGlosa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>

              {/* Comparativo: Motivo da Operadora x Prontuário Médico MedCore */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Motivo da Glosa da Operadora (Cód {selectedGlosa.codigoGlosa})
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {selectedGlosa.motivoGlosa}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rd-cyan/10 border border-rd-cyan/30 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rd-cyan flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Evidência no Prontuário SOAP MedCore
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    “{selectedGlosa.prontuarioSnippet}”
                  </p>
                </div>
              </div>

              {/* Justificativa Gerada pela IA */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rd-cyan font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4" />
                    <span>Recurso Técnico Redigido pela Dra. Conte (IA Jurídico-Médica)</span>
                  </div>

                  {!selectedGlosa.justificativaIA && (
                    <button
                      onClick={() => handleGenerateRecurso(selectedGlosa)}
                      disabled={isGeneratingAI}
                      className="px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 transition-all flex items-center gap-2"
                    >
                      {isGeneratingAI ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                      {isGeneratingAI ? "Cruzando Dados..." : "Redigir com IA"}
                    </button>
                  )}
                </div>

                {selectedGlosa.justificativaIA ? (
                  <textarea
                    rows={6}
                    value={selectedGlosa.justificativaIA}
                    onChange={(e) =>
                      setSelectedGlosa({ ...selectedGlosa, justificativaIA: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-200 leading-relaxed font-sans focus:outline-none focus:border-rd-cyan"
                  />
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                    <Bot className="h-8 w-8 text-rd-cyan mx-auto opacity-50" />
                    <p className="text-xs text-zinc-400">
                      Clique em "Redigir com IA" para cruzar automaticamente a justificativa do prontuário com os preceitos da ANS e gerar o texto do recurso.
                    </p>
                  </div>
                )}
              </div>

              {selectedGlosa.justificativaIA && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      alert("Recurso protocolado via webservice TISS direto no portal da operadora!");
                      setSelectedGlosa(null);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                    Protocolar Recurso no Portal do Convênio
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <Bot className="h-10 w-10 text-zinc-600 mx-auto" />
              <h4 className="font-bold text-sm text-zinc-300">Selecione uma glosa ao lado</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                A Dra. Conte fará a leitura automática do prontuário médico e montará o recurso técnico fundamentado para estorno da operadora.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
