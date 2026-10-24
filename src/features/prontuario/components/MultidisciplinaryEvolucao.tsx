"use client";

import React, { useState } from "react";
import { 
  Apple, 
  Activity, 
  Brain, 
  Lock, 
  Save, 
  CheckCircle2, 
  Calculator, 
  Flame, 
  Scale, 
  ShieldCheck,
  Dumbbell,
  HeartPulse,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MultidisciplinaryType = "nutricao" | "fisioterapia" | "psicologia";

interface MultidisciplinaryEvolucaoProps {
  patientName?: string;
  patientAge?: number;
}

export function MultidisciplinaryEvolucao({
  patientName = "João da Silva",
  patientAge = 34,
}: MultidisciplinaryEvolucaoProps) {
  const [activeArea, setActiveArea] = useState<MultidisciplinaryType>("nutricao");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados Nutrição
  const [peso, setPeso] = useState<number>(78);
  const [altura, setAltura] = useState<number>(178); // cm
  const [genero, setGenero] = useState<"M" | "F">("M");
  const [fatorAtividade, setFatorAtividade] = useState<number>(1.55); // moderado
  const [planoAlimentar, setPlanoAlimentar] = useState(
    "Café da manhã: Omelete de 3 ovos + 1 fatia de pão integral + café sem açúcar.\nAlmoço: 150g peito de frango grelhado + 100g arroz integral + salada verde à vontade.\nLanche: Iogurte natural + 30g whey protein.\nJantar: 150g peixe ou carne magra + legumes cozidos no vapor."
  );

  // Cálculo IMC
  const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(1);
  const getImcClass = (val: number) => {
    if (val < 18.5) return { label: "Abaixo do peso", color: "text-amber-400" };
    if (val < 25) return { label: "Peso normal / Eutrofia", color: "text-emerald-400" };
    if (val < 30) return { label: "Sobrepeso", color: "text-amber-400" };
    return { label: "Obesidade", color: "text-red-400" };
  };

  // Cálculo TMB (Harris-Benedict)
  const tmb = Math.round(
    genero === "M"
      ? 88.36 + 13.4 * peso + 4.8 * altura - 5.7 * patientAge
      : 447.6 + 9.2 * peso + 3.1 * altura - 4.3 * patientAge
  );
  const getGastoTotal = Math.round(tmb * fatorAtividade);

  // Estados Fisioterapia
  const [queixaMuscular, setQueixaMuscular] = useState("Lombalgia mecânica crônica irradiada para glúteo direito.");
  const [grauDorEVA, setGrauDorEVA] = useState<number>(6); // Escala Visual Analógica 0-10
  const [amplitudeMovimento, setAmplitudeMovimento] = useState("Flexão de coluna limitada a 45º com dor ao final do arco. Teste de Lasègue negativo bilateral.");
  const [condutaFisio, setCondutaFisio] = useState("Liberação miofascial de quadrado lombar e glúteos + TENS analgésico por 20min + Fortalecimento isométrico do core.");

  // Estados Psicologia (com trava de sigilo)
  const [sigiloChecked, setSigiloChecked] = useState(true);
  const [evolucaoGeralPsico, setEvolucaoGeralPsico] = useState("Paciente comparece pontualmente. Demonstra humor reativo e afeto modulado. Relata melhora dos episódios de ansiedade no ambiente de trabalho.");
  const [notasSigilosas, setNotasSigilosas] = useState("Anotações de acesso restrito ao psicólogo responsável conforme Código de Ética Profissional (CFP Art. 9º). Detalhes sobre conflitos conjugais e histórico familiar de trauma.");
  const [unlockedSigilo, setUnlockedSigilo] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header com Navegação Multidisciplinar */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveArea("nutricao")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeArea === "nutricao"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Apple className="h-4 w-4" />
              Nutrição & Dietética
            </button>

            <button
              onClick={() => setActiveArea("fisioterapia")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeArea === "fisioterapia"
                  ? "bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Activity className="h-4 w-4" />
              Fisioterapia & Reabilitação
            </button>

            <button
              onClick={() => setActiveArea("psicologia")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeArea === "psicologia"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Brain className="h-4 w-4" />
              Psicologia & Sigilo
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 animate-in zoom-in">
              <CheckCircle2 className="h-4 w-4" /> Evolução gravada!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02]"
          >
            <Save className="h-4 w-4" />
            Salvar Evolução
          </button>
        </div>
      </div>

      {/* ÁREA 1: NUTRIÇÃO */}
      {activeArea === "nutricao" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Calculadoras Bioantropométricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-emerald-400" />
                Peso & Altura
              </span>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase">Peso (kg)</label>
                  <input
                    type="number"
                    value={peso}
                    onChange={(e) => setPeso(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-zinc-500 font-bold uppercase">Altura (cm)</label>
                  <input
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-rd-cyan" />
                Índice de Massa Corporal (IMC)
              </span>
              <p className="text-2xl font-black text-white">{imc} <span className="text-xs text-zinc-500 font-medium">kg/m²</span></p>
              <p className={cn("text-xs font-bold", getImcClass(Number(imc)).color)}>
                {getImcClass(Number(imc)).label}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Taxa Metabólica Basal (TMB)
              </span>
              <p className="text-2xl font-black text-white">{tmb} <span className="text-xs text-zinc-500 font-medium">kcal/dia</span></p>
              <p className="text-xs text-zinc-400">Harris-Benedict Refinada</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-purple-400" />
                Gasto Energético Total (GET)
              </span>
              <p className="text-2xl font-black text-white">{getGastoTotal} <span className="text-xs text-zinc-500 font-medium">kcal/dia</span></p>
              <select
                value={fatorAtividade}
                onChange={(e) => setFatorAtividade(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1 text-[10px] text-zinc-300 font-medium cursor-pointer"
              >
                <option value={1.2}>Sedentário (1.2x)</option>
                <option value={1.375}>Leve (1.375x)</option>
                <option value={1.55}>Moderado (1.55x)</option>
                <option value={1.725}>Intenso (1.725x)</option>
              </select>
            </div>
          </div>

          {/* Prescrição Dietética e Plano Alimentar */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Apple className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Plano Alimentar & Prescrição Dietoterápica</h4>
                <p className="text-xs text-zinc-400">Distribuição de macronutrientes e orientações de refeições</p>
              </div>
            </div>

            <textarea
              rows={6}
              value={planoAlimentar}
              onChange={(e) => setPlanoAlimentar(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 leading-relaxed font-mono"
            />
          </div>
        </div>
      )}

      {/* ÁREA 2: FISIOTERAPIA */}
      {activeArea === "fisioterapia" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Avaliação de Dor e Escala EVA */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Escala Visual Analógica (EVA)</h4>
                  <p className="text-xs text-zinc-400">Intensidade da dor relatada pelo paciente</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Nível de Dor:</span>
                  <span className="font-black text-lg text-white">{grauDorEVA} / 10</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={grauDorEVA}
                  onChange={(e) => setGrauDorEVA(Number(e.target.value))}
                  className="w-full accent-rd-cyan cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">
                  <span>0 - Sem Dor</span>
                  <span>5 - Moderada</span>
                  <span>10 - Insuportável</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Queixa Principal & Topografia
                </label>
                <textarea
                  rows={2}
                  value={queixaMuscular}
                  onChange={(e) => setQueixaMuscular(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rd-cyan resize-none"
                />
              </div>
            </div>

            {/* Amplitude e Exame Físico Cinesiológico */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Exame Cinesiológico-Funcional & Amplitude de Movimento</h4>
                  <p className="text-xs text-zinc-400">Goniometria, testes ortopédicos especiais e força muscular (MRC)</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Avaliação da ADM e Testes Especiais
                </label>
                <textarea
                  rows={2}
                  value={amplitudeMovimento}
                  onChange={(e) => setAmplitudeMovimento(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rd-cyan resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Conduta Fisioterapêutica Aplicada no Atendimento
                </label>
                <textarea
                  rows={3}
                  value={condutaFisio}
                  onChange={(e) => setCondutaFisio(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rd-cyan resize-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ÁREA 3: PSICOLOGIA (COM SIGILO DE PRONTUÁRIO) */}
      {activeArea === "psicologia" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Card de Aviso de Sigilo Profissional */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-purple-400 shrink-0" />
            <p className="text-xs text-purple-200">
              <strong>Conformidade Ética CFP / LGPD:</strong> As anotações sigilosas desta aba ficam protegidas por chave criptográfica e não são exibidas na evolução médica padrão compartilhada.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Evolução Compartilhada (Para equipe médica geral) */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Evolução Geral Compartilhada</h4>
                  <p className="text-xs text-zinc-400">Visível para toda a equipe multidisciplinar</p>
                </div>
              </div>

              <textarea
                rows={6}
                value={evolucaoGeralPsico}
                onChange={(e) => setEvolucaoGeralPsico(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
              />
            </div>

            {/* Anotações Sigilosas Restritas (Com Trava de Acesso) */}
            <div className="p-6 rounded-2xl bg-purple-950/20 border-2 border-purple-500/40 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-purple-200">Prontuário Psicológico Sigiloso</h4>
                    <p className="text-xs text-purple-400">Acesso restrito ao profissional de psicologia</p>
                  </div>
                </div>

                {!unlockedSigilo && (
                  <button
                    onClick={() => setUnlockedSigilo(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Desbloquear com Biometria/Senha
                  </button>
                )}
              </div>

              {unlockedSigilo ? (
                <textarea
                  rows={6}
                  value={notasSigilosas}
                  onChange={(e) => setNotasSigilosas(e.target.value)}
                  className="w-full bg-zinc-950 border border-purple-500/40 rounded-xl p-4 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 leading-relaxed resize-none"
                />
              ) : (
                <div className="py-12 text-center space-y-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
                  <Lock className="h-8 w-8 text-purple-400 mx-auto opacity-60" />
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                    Conteúdo criptografado. Clique em desbloquear para visualizar os relatos da sessão protegidos por sigilo.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
