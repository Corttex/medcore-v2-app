"use client";

import React, { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Plus, 
  Trash2, 
  FileCheck, 
  Pill, 
  Search, 
  Sparkles,
  Lock,
  ChevronDown,
  Printer,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DrugInteractionAlert {
  drugs: [string, string];
  severity: "grave" | "moderada" | "leve";
  mechanism: string;
  recommendation: string;
}

export interface AllergyAlert {
  drug: string;
  allergen: string;
  risk: string;
}

// Base farmacêutica simulada padrão BRASÍNDICE / ANVISA
const KNOWN_DRUG_DATABASE = [
  { name: "Amoxicilina + Clavulanato", class: "Penicilina / Betalactâmico", allergenGroup: "penicilina" },
  { name: "Dipirona Monoidratada", class: "Analgésico / Pirazolona", allergenGroup: "dipirona" },
  { name: "Ibuprofeno", class: "AINE", allergenGroup: "aine" },
  { name: "Cetoprofeno", class: "AINE", allergenGroup: "aine" },
  { name: "Varfarina Sódica", class: "Anticoagulante Cumarínico", allergenGroup: "cumarinico" },
  { name: "Ciprofloxacino", class: "Fluoroquinolona", allergenGroup: "quinolona" },
  { name: "Fluconazol", class: "Antifúngico Triazólico", allergenGroup: "triazol" },
  { name: "Omeprazol", class: "Inibidor de Bomba de Prótons", allergenGroup: "ibp" },
  { name: "Metformina", class: "Biguanida", allergenGroup: "biguanida" },
  { name: "Sinvastatina", class: "Estadinas", allergenGroup: "estatina" },
  { name: "Clopidogrel", class: "Antiagregante Plaquetário", allergenGroup: "tienopiridina" },
  { name: "Espironolactona", class: "Diurético Poupador de K", allergenGroup: "diuretico" },
  { name: "Enalapril", class: "IECA", allergenGroup: "ieca" },
  { name: "Paracetamol", class: "Analgésico / Paraminofenol", allergenGroup: "paracetamol" },
];

// Matriz de Interações Farmacológicas Conhecidas
const KNOWN_INTERACTIONS: DrugInteractionAlert[] = [
  {
    drugs: ["Varfarina Sódica", "Ibuprofeno"],
    severity: "grave",
    mechanism: "AINEs inibem a agregação plaquetária e causam irritação gástrica, potencializando drasticamente o risco de hemorragia grave associado à Varfarina.",
    recommendation: "Substituir AINE por Paracetamol ou analgésico puro sob monitoramento rigoroso de RNI.",
  },
  {
    drugs: ["Varfarina Sódica", "Cetoprofeno"],
    severity: "grave",
    mechanism: "Aumento severo do risco de sangramento gastrointestinal e inibição da coagulação.",
    recommendation: "Contraindicado uso concomitante. Ajustar analgesia.",
  },
  {
    drugs: ["Ciprofloxacino", "Ibuprofeno"],
    severity: "moderada",
    mechanism: "A associação entre quinolonas e AINEs pode diminuir o limiar convulsivo do SNC e gerar excitação neuromuscular.",
    recommendation: "Monitorar sinais de toxicidade neurológica ou selecionar alternativa analgésica.",
  },
  {
    drugs: ["Fluconazol", "Sinvastatina"],
    severity: "grave",
    mechanism: "Inibição potente do CYP3A4 pelo Fluconazol, elevando os níveis séricos de Sinvastatina com alto risco de rabdomiólise e miopatia aguda.",
    recommendation: "Suspender temporariamente a Sinvastatina durante o tratamento antifúngico.",
  },
  {
    drugs: ["Omeprazol", "Clopidogrel"],
    severity: "moderada",
    mechanism: "Omeprazol inibe a enzima CYP2C19 necessária para ativar o Clopidogrel, reduzindo a eficácia antiplaquetária.",
    recommendation: "Considerar Pantoprazol como alternativa gástrica que possui menor inibição de CYP2C19.",
  },
  {
    drugs: ["Enalapril", "Espironolactona"],
    severity: "moderada",
    mechanism: "Risco acentuado de hipercalemia severa decorrente da inibição do sistema renina-angiotensina-aldosterona.",
    recommendation: "Monitorar eletrólitos séricos e potássio sérico frequentemente.",
  },
];

interface PrescriptionEngineProps {
  patientName?: string;
  patientAllergies?: string[];
  patientCurrentMedications?: string[];
}

export function PrescriptionEngine({
  patientName = "João da Silva",
  patientAllergies = ["Penicilina", "AINE (Anti-inflamatórios Não Esteroidais)"],
  patientCurrentMedications = ["Varfarina Sódica", "Omeprazol"],
}: PrescriptionEngineProps) {
  const [prescribedItems, setPrescribedItems] = useState<PrescriptionItem[]>([
    {
      id: "1",
      name: "Amoxicilina + Clavulanato",
      dosage: "875mg + 125mg",
      frequency: "De 12 em 12 horas",
      duration: "7 dias",
      instructions: "Ingerir após as refeições para evitar desconforto gástrico.",
    },
    {
      id: "2",
      name: "Ibuprofeno",
      dosage: "600mg",
      frequency: "De 8 em 8 horas se dor ou febre",
      duration: "3 dias",
      instructions: "Tomar com água abundante.",
    },
  ]);

  // Novo item sendo digitado
  const [selectedDrug, setSelectedDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("De 8 em 8 horas");
  const [duration, setDuration] = useState("5 dias");
  const [instructions, setInstructions] = useState("");

  // Justificativas do médico para casos de override
  const [justification, setJustification] = useState("");
  const [overrideAccepted, setOverrideAccepted] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // Detecção de Alergias
  const allergyAlerts = useMemo(() => {
    const alerts: AllergyAlert[] = [];
    const patientAllergiesLower = patientAllergies.map((a) => a.toLowerCase());

    prescribedItems.forEach((item) => {
      const drugLower = item.name.toLowerCase();
      
      // Match penicilina
      if (
        (drugLower.includes("amoxicilina") || drugLower.includes("ampicilina") || drugLower.includes("penicilina")) &&
        patientAllergiesLower.some((a) => a.includes("penicilina"))
      ) {
        alerts.push({
          drug: item.name,
          allergen: "Penicilina",
          risk: "Risco crítico de anafilaxia, broncoespasmo ou choque anafilático imediato.",
        });
      }

      // Match AINE
      if (
        (drugLower.includes("ibuprofeno") || drugLower.includes("cetoprofeno") || drugLower.includes("diclofenaco") || drugLower.includes("nimesulida")) &&
        patientAllergiesLower.some((a) => a.includes("aine") || a.includes("anti-inflamatório"))
      ) {
        alerts.push({
          drug: item.name,
          allergen: "AINEs",
          risk: "Hipersensibilidade grave, edema de glote ou exacerbação de broncoespasmo.",
        });
      }

      // Match Dipirona
      if (
        drugLower.includes("dipirona") &&
        patientAllergiesLower.some((a) => a.includes("dipirona"))
      ) {
        alerts.push({
          drug: item.name,
          allergen: "Dipirona",
          risk: "Reação cutânea grave, broncoespasmo ou hipotensão súbita.",
        });
      }
    });

    return alerts;
  }, [prescribedItems, patientAllergies]);

  // Detecção de Interações Medicamentosas (Prescrição x Prescrição E Prescrição x Uso Contínuo)
  const interactionAlerts = useMemo(() => {
    const allActiveDrugs = [
      ...prescribedItems.map((p) => p.name),
      ...patientCurrentMedications,
    ];

    const detected: DrugInteractionAlert[] = [];

    KNOWN_INTERACTIONS.forEach((interaction) => {
      const [d1, d2] = interaction.drugs;
      const hasD1 = allActiveDrugs.some((d) => d.toLowerCase().includes(d1.toLowerCase()));
      const hasD2 = allActiveDrugs.some((d) => d.toLowerCase().includes(d2.toLowerCase()));

      if (hasD1 && hasD2) {
        detected.push(interaction);
      }
    });

    return detected;
  }, [prescribedItems, patientCurrentMedications]);

  const hasCriticalLock = allergyAlerts.length > 0 || interactionAlerts.some((i) => i.severity === "grave");

  const handleAddItem = () => {
    if (!selectedDrug) return;
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      name: selectedDrug,
      dosage: dosage || "Conforme bula",
      frequency,
      duration,
      instructions,
    };
    setPrescribedItems([...prescribedItems, newItem]);
    setSelectedDrug("");
    setDosage("");
    setInstructions("");
  };

  const handleRemoveItem = (id: string) => {
    setPrescribedItems(prescribedItems.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Banner de Segurança Medicamentosa */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan shrink-0">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-white">Prescrição Inteligente com Checagem de Interações</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                Brasíndice / ANVISA Ativo
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Paciente: <strong className="text-zinc-200">{patientName}</strong> • Medicamentos em Uso:{" "}
              <span className="text-amber-400 font-semibold">{patientCurrentMedications.join(", ")}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSignModalOpen(true)}
            disabled={hasCriticalLock && !overrideAccepted}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all",
              hasCriticalLock && !overrideAccepted
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 shadow-rd-cyan/20 hover:scale-[1.02]"
            )}
          >
            <FileCheck className="h-4 w-4" />
            {hasCriticalLock && !overrideAccepted ? "Bloqueado por Segurança" : "Assinar Prescrição (ICP-Brasil)"}
          </button>
        </div>
      </div>

      {/* BLOCO DE ALERTAS CRÍTICOS: ALERGIAS */}
      {allergyAlerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-950/40 border-2 border-red-500/60 shadow-xl space-y-3 animate-in shake">
          <div className="flex items-center gap-3 text-red-400 font-bold text-sm">
            <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
            <span>TRAVA DE SEGURANÇA: ALERGIA CONHECIDA DO PACIENTE DETECTADA</span>
          </div>

          <div className="space-y-2">
            {allergyAlerts.map((alert, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-white text-sm block">{alert.drug}</strong>
                  <span>Paciente possui hipersensibilidade documentada a: <strong>{alert.allergen}</strong>. {alert.risk}</span>
                </div>
                <button
                  onClick={() => {
                    const item = prescribedItems.find((p) => p.name === alert.drug);
                    if (item) handleRemoveItem(item.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider self-start sm:self-center shrink-0 transition-colors"
                >
                  Remover Medicamento Imediatamente
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOCO DE ALERTAS: INTERAÇÕES MEDICAMENTOSAS */}
      {interactionAlerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 shadow-xl space-y-3">
          <div className="flex items-center gap-3 text-amber-400 font-bold text-sm">
            <AlertTriangle className="h-6 w-6 text-amber-400 animate-bounce" />
            <span>ALERTA FARMACOLÓGICO: INTERAÇÃO MEDICAMENTOSA DETECTADA ({interactionAlerts.length})</span>
          </div>

          <div className="space-y-2">
            {interactionAlerts.map((inter, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3.5 rounded-xl border text-xs space-y-1.5",
                  inter.severity === "grave"
                    ? "bg-red-950/30 border-red-800/80 text-red-200"
                    : "bg-amber-950/30 border-amber-800/80 text-amber-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {inter.drugs[0]} ⚡ {inter.drugs[1]}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      inter.severity === "grave" ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    )}
                  >
                    Gravidade: {inter.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-zinc-300 leading-relaxed font-sans">{inter.mechanism}</p>
                <p className="text-emerald-400 font-semibold text-[11px] pt-1">
                  💡 Conduta Recomendada: {inter.recommendation}
                </p>
              </div>
            ))}
          </div>

          {/* Justificativa para Override caso o médico decida manter */}
          {hasCriticalLock && (
            <div className="mt-4 pt-4 border-t border-amber-900/60 space-y-2 bg-zinc-950/60 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold">
                <Lock className="h-4 w-4 text-amber-400" />
                <span>Desbloqueio de Segurança sob Responsabilidade Médica (CFM / Prontuário)</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Para prosseguir com a emissão contendo alertas críticos, registre a justificativa clínica. Este registro ficará indelevelmente gravado no log de auditoria.
              </p>
              <textarea
                rows={2}
                placeholder="Ex: Paciente internado com monitoramento contínuo de coagulograma. Risco/benefício favorável ponderado com a equipe..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rd-cyan"
              />
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="overrideCheck"
                  checked={overrideAccepted}
                  disabled={justification.length < 10}
                  onChange={(e) => setOverrideAccepted(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-rd-cyan cursor-pointer"
                />
                <label htmlFor="overrideCheck" className="text-xs text-zinc-300 cursor-pointer select-none">
                  Confirmo a necessidade clínica da prescrição e assumo a responsabilidade técnica descrita acima.
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulário de Adição de Medicamento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adicionar Medicamento */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Adicionar à Prescrição</h4>
              <p className="text-xs text-zinc-400">Base com posologia e alertas automáticos</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Medicamento / Substância Ativa
              </label>
              <select
                value={selectedDrug}
                onChange={(e) => setSelectedDrug(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rd-cyan cursor-pointer font-medium"
              >
                <option value="">Selecione um fármaco...</option>
                {KNOWN_DRUG_DATABASE.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Dosagem / Concentração
              </label>
              <input
                type="text"
                placeholder="Ex: 500mg, 1 comprimido, 20 gotas"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Posologia / Intervalo
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
                >
                  <option value="De 6 em 6 horas">De 6 em 6h</option>
                  <option value="De 8 em 8 horas">De 8 em 8h</option>
                  <option value="De 12 em 12 horas">De 12 em 12h</option>
                  <option value="1x ao dia pela manhã">1x/dia pela manhã</option>
                  <option value="1x ao dia à noite">1x/dia à noite</option>
                  <option value="Se dor ou febre">Se dor ou febre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Duração
                </label>
                <input
                  type="text"
                  placeholder="Ex: 5 dias, Uso contínuo"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Instruções ao Paciente
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Tomar com leite ou após refeição..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rd-cyan resize-none"
              />
            </div>

            <button
              onClick={handleAddItem}
              disabled={!selectedDrug}
              className="w-full py-2.5 rounded-xl bg-rd-cyan/20 border border-rd-cyan/40 text-rd-cyan hover:bg-rd-cyan hover:text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              + Inserir na Receita
            </button>
          </div>
        </div>

        {/* Lista de Medicamentos Prescritos */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="font-bold text-sm text-white">Receituário em Andamento ({prescribedItems.length} itens)</h4>
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              {allergyAlerts.length === 0 && interactionAlerts.length === 0 ? "✅ Prescrição Segura" : "⚠️ Requer Atenção"}
            </span>
          </div>

          {prescribedItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Nenhum medicamento adicionado ainda. Selecione um item ao lado.
            </div>
          ) : (
            <div className="space-y-3">
              {prescribedItems.map((item, index) => {
                const hasItemAllergy = allergyAlerts.some((a) => a.drug === item.name);
                const hasItemInteraction = interactionAlerts.some((i) => i.drugs.includes(item.name as any));

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-xl border flex items-start justify-between gap-4 transition-all",
                      hasItemAllergy
                        ? "bg-red-950/20 border-red-500/50"
                        : hasItemInteraction
                        ? "bg-amber-950/20 border-amber-500/50"
                        : "bg-zinc-950/50 border-zinc-800"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-md bg-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h5 className="font-bold text-sm text-white">{item.name}</h5>
                        {hasItemAllergy && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500 text-white font-black text-[9px] uppercase tracking-wider">
                            Alergia
                          </span>
                        )}
                        {hasItemInteraction && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                            Interação
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">
                        <strong>Dosagem:</strong> {item.dosage} • <strong>Posologia:</strong> {item.frequency} • <strong>Duração:</strong> {item.duration}
                      </p>
                      {item.instructions && (
                        <p className="text-[11px] text-zinc-400 italic">“{item.instructions}”</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800/80 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Assinatura Digital ICP-Brasil / Memed */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-rd-cyan" />
                <h4 className="font-heading font-bold text-base text-white">Assinatura Digital ICP-Brasil</h4>
              </div>
              <button onClick={() => setIsSignModalOpen(false)} className="text-zinc-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-rd-cyan/10 border border-rd-cyan/30 flex items-center justify-center text-rd-cyan">
                <QrCode className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Receita Digital Válida em Todo o Brasil</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Integrada ao ecossistema Memed / Farmácias parceiras com QR Code de autenticidade e carimbo de tempo.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 space-y-1 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
              <p>• Certificado Digital A1/A3 detectado.</p>
              <p>• CRM-SP 184.920 • Dr. Alexandre Medeiros.</p>
              <p>• Notificação com link por SMS e WhatsApp configurada para o paciente.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  alert("Receita assinada digitalmente com sucesso! Enviada por WhatsApp para o paciente.");
                  setIsSignModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 shadow-lg shadow-rd-cyan/20"
              >
                Confirmar e Emitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
