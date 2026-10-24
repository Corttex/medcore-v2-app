"use client";

import React, { useState } from "react";
import { 
  ClipboardCheck, 
  User, 
  Stethoscope, 
  Droplets, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AestheticAnamneseProps {
  patientName?: string;
  patientCpf?: string;
}

const RED_FLAGS = [
  { id: "gestante", label: "Gestante / Lactante", severity: "high" },
  { id: "autoimune", label: "Doença Autoimune Ativa", severity: "high" },
  { id: "infeccao", label: "Infecção / Herpes Ativa", severity: "high" },
  { id: "anticoagulante", label: "Uso de Anticoagulantes / AAS", severity: "medium" },
  { id: "queloide", label: "Histórico de Cicatriz Queloide", severity: "medium" },
  { id: "alergia_lidocaina", label: "Alergia a Anestésico / Lidocaína", severity: "high" },
  { id: "pmma", label: "Preenchimento Prévio com PMMA / Silício", severity: "high" },
  { id: "diabetes", label: "Diabetes Descompensada", severity: "medium" },
];

export function AestheticAnamneseForm({
  patientName = "João da Silva",
  patientCpf = "123.456.789-00",
}: AestheticAnamneseProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(["queloide"]);

  const [formData, setFormData] = useState({
    profissao: "Executivo / Home Office",
    exposicaoSolar: "Moderada (fins de semana)",
    procedimentosPrevios: "Toxina Botulínica em terço superior há 8 meses. Nunca realizou preenchimento labial.",
    alergiasConhecidas: "Nenhuma relatada a medicamentos; sensibilidade leve a sulfatos.",
    medicamentosUsoContinuo: "Vitamina D, Ômega 3",
    biotipoCutaneo: "Mista",
    escalaFitzpatrick: "Fototipo III (Parda / Pele clara resistente)",
    grauSensibilidade: "Reativa Leve",
    grauGlogau: "Glogau II (Rugas em movimento / 30-40 anos)",
    homecareSabonete: "Gel de Limpeza Suave com Ácido Salicílico",
    homecareHidratante: "Sérum com Ácido Hialurônico 2%",
    homecareProtetorSolar: "Protetor Solar Fluido FPS 60 com cor",
    homecareNoturno: "Retinol 0.3% em noites alternadas",
    expectativaTratamento: "Harmonização sutil, foco nas linhas de expressão da testa e arqueamento leve da cauda da sobrancelha, sem perder a naturalidade.",
  });

  const toggleFlag = (flagId: string) => {
    setSelectedFlags(prev =>
      prev.includes(flagId) ? prev.filter(f => f !== flagId) : [...prev, flagId]
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-white">Anamnese Especializada em Harmonização Facial</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                Protocolo Estético
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paciente: <span className="text-zinc-200 font-semibold">{patientName}</span> • CPF: {patientCpf}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-in zoom-in">
              <CheckCircle2 className="h-4 w-4" /> Anamnese salva com sucesso!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="h-4 w-4" />
            Salvar Avaliação
          </button>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1 & 2: Dados Clínicos e Exame Estético */}
        <div className="lg:col-span-2 space-y-6">

          {/* Marcadores de Alerta / Contraindicações (Red Flags) */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Contraindicações & Marcadores de Risco</h4>
                  <p className="text-xs text-zinc-400">Selecione para destacar alertas durante a sessão e no mapeador</p>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {selectedFlags.length} marcados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {RED_FLAGS.map((flag) => {
                const isSelected = selectedFlags.includes(flag.id);
                return (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => toggleFlag(flag.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-left transition-all text-xs font-medium",
                      isSelected
                        ? flag.severity === "high"
                          ? "bg-red-500/10 border-red-500/40 text-red-200 shadow-sm"
                          : "bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-sm"
                        : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    <span>{flag.label}</span>
                    <div
                      className={cn(
                        "h-5 w-5 rounded-md border flex items-center justify-center transition-all ml-2 shrink-0",
                        isSelected
                          ? flag.severity === "high"
                            ? "bg-red-500 border-red-500 text-white"
                            : "bg-amber-500 border-amber-500 text-zinc-950"
                          : "border-zinc-700 bg-zinc-900"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Histórico Estético & Injetáveis Prévios */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Histórico de Procedimentos Estéticos</h4>
                <p className="text-xs text-zinc-400">Intervenções anteriores, toxinas, preenchedores e fios</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Procedimentos Estéticos Prévios & Datas
                </label>
                <textarea
                  rows={3}
                  value={formData.procedimentosPrevios}
                  onChange={(e) => setFormData({ ...formData, procedimentosPrevios: e.target.value })}
                  placeholder="Ex: Toxina botulínica há 6 meses, preenchimento malar em 2024..."
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan/60 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Alergias Conhecidas / Intolerâncias
                  </label>
                  <input
                    type="text"
                    value={formData.alergiasConhecidas}
                    onChange={(e) => setFormData({ ...formData, alergiasConhecidas: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan/60 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Medicamentos de Uso Contínuo
                  </label>
                  <input
                    type="text"
                    value={formData.medicamentosUsoContinuo}
                    onChange={(e) => setFormData({ ...formData, medicamentosUsoContinuo: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan/60 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exame Físico Facial e Fototipo */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Avaliação Dermatológica & Cutânea</h4>
                <p className="text-xs text-zinc-400">Classificação de Fitzpatrick, Glogau e Biotipo Facial</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Biotipo Cutâneo
                </label>
                <select
                  value={formData.biotipoCutaneo}
                  onChange={(e) => setFormData({ ...formData, biotipoCutaneo: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rd-cyan/60 transition-all font-medium cursor-pointer"
                >
                  <option value="Mista">Mista</option>
                  <option value="Oleosa / Acneica">Oleosa / Acneica</option>
                  <option value="Seca / Alipídica">Seca / Alipídica</option>
                  <option value="Eudérmica (Normal)">Eudérmica (Normal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Escala de Fitzpatrick
                </label>
                <select
                  value={formData.escalaFitzpatrick}
                  onChange={(e) => setFormData({ ...formData, escalaFitzpatrick: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rd-cyan/60 transition-all font-medium cursor-pointer"
                >
                  <option value="Fototipo I (Branca Muito Clara)">Fototipo I (Muito Clara - Sempre queima)</option>
                  <option value="Fototipo II (Branca Clara)">Fototipo II (Clara - Queima fácil)</option>
                  <option value="Fototipo III (Parda / Pele clara resistente)">Fototipo III (Parda / Clara resistente)</option>
                  <option value="Fototipo IV (Morena Moderada)">Fototipo IV (Morena moderada)</option>
                  <option value="Fototipo V (Negra Clara / Morena Escura)">Fototipo V (Negra Clara)</option>
                  <option value="Fototipo VI (Negra Retinta)">Fototipo VI (Negra Retinta)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Fotoenvelhecimento (Glogau)
                </label>
                <select
                  value={formData.grauGlogau}
                  onChange={(e) => setFormData({ ...formData, grauGlogau: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 focus:outline-none focus:border-rd-cyan/60 transition-all font-medium cursor-pointer"
                >
                  <option value="Glogau I (Sem rugas estáticas / 20-30 anos)">Glogau I — Inicial (20-30a)</option>
                  <option value="Glogau II (Rugas em movimento / 30-40 anos)">Glogau II — Em movimento (30-40a)</option>
                  <option value="Glogau III (Rugas em repouso / 50+ anos)">Glogau III — Em repouso (50+a)</option>
                  <option value="Glogau IV (Apenas rugas / Pele severa)">Glogau IV — Severo</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Objetivo e Expectativa Principal do Paciente
              </label>
              <textarea
                rows={2}
                value={formData.expectativaTratamento}
                onChange={(e) => setFormData({ ...formData, expectativaTratamento: e.target.value })}
                className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan/60 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Coluna 3: Homecare Atual & IA Sugestão */}
        <div className="space-y-6">

          {/* Rotina Homecare */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="h-5 w-5 text-rd-cyan" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Homecare Atual</h4>
                <p className="text-xs text-zinc-400">Rotina diária de cuidados com a pele</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Higienização / Sabonete
                </label>
                <input
                  type="text"
                  value={formData.homecareSabonete}
                  onChange={(e) => setFormData({ ...formData, homecareSabonete: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan/60 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Hidratação Facial
                </label>
                <input
                  type="text"
                  value={formData.homecareHidratante}
                  onChange={(e) => setFormData({ ...formData, homecareHidratante: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan/60 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Fotoproteção (FPS)
                </label>
                <input
                  type="text"
                  value={formData.homecareProtetorSolar}
                  onChange={(e) => setFormData({ ...formData, homecareProtetorSolar: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan/60 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Tratamento Noturno / Ácidos
                </label>
                <input
                  type="text"
                  value={formData.homecareNoturno}
                  onChange={(e) => setFormData({ ...formData, homecareNoturno: e.target.value })}
                  className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-rd-cyan/60 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card de IA Insight Clínico */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rd-cyan/10 via-zinc-900 to-zinc-950 border border-rd-cyan/30 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3 text-rd-cyan">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h4 className="font-bold text-xs uppercase tracking-widest">Alerta Clínico IA MedCore</h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Com base no fototipo <strong className="text-white">III</strong> e histórico de <strong className="text-amber-300">queloide leve</strong>:
            </p>
            <ul className="text-[11px] text-zinc-400 space-y-1.5 mt-2 list-disc list-inside">
              <li>Evitar microagulhamento profundo ou lasers fracionados ablativos.</li>
              <li>Toxina botulínica e bioestimuladores injetáveis profundos estão seguros para aplicação.</li>
              <li>Recomenda-se retorno de avaliação aos 15 dias para conferência de simetria do terço superior.</li>
            </ul>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>Classificação de Risco</span>
              <span className="text-emerald-400 font-bold">Apto para Injetáveis</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
