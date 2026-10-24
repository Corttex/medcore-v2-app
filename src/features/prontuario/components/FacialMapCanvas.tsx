"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Layers, 
  CheckCircle2, 
  Save, 
  PackageCheck, 
  Info,
  RotateCcw,
  ShieldCheck,
  Camera,
  Upload,
  DollarSign,
  TrendingUp,
  Receipt,
  FileCheck2,
  X
} from "lucide-react";

export interface InjectionPoint {
  id: string;
  x: number; // percentual de 0 a 100
  y: number; // percentual de 0 a 100
  label: string;
  region: string;
  product: string;
  dose: number; // unidades ou ml
  unit: "u" | "ml" | "un";
  intensity: "Leve" | "Moderado" | "Avançado";
  price: number;
}

const PRESET_REGIONS = [
  { id: "frontal", name: "Frontal / Testa", defaultDose: 10, unit: "u" },
  { id: "glabela", name: "Glabela (Bravo)", defaultDose: 15, unit: "u" },
  { id: "periorbital_d", name: "Pés de Galinha (D)", defaultDose: 10, unit: "u" },
  { id: "periorbital_e", name: "Pés de Galinha (E)", defaultDose: 10, unit: "u" },
  { id: "nasal", name: "Bunny Lines (Nariz)", defaultDose: 5, unit: "u" },
  { id: "labios_sup", name: "Lábio Superior", defaultDose: 0.8, unit: "ml" },
  { id: "labios_inf", name: "Lábio Inferior", defaultDose: 0.8, unit: "ml" },
  { id: "malar", name: "Malar / Zigomático", defaultDose: 1.0, unit: "ml" },
  { id: "mandibula", name: "Contorno Mandibular", defaultDose: 1.5, unit: "ml" },
  { id: "mento", name: "Mento (Queixo)", defaultDose: 1.0, unit: "ml" },
  { id: "masseter", name: "Masseter (Bruxismo)", defaultDose: 25, unit: "u" },
];

const PRODUCTS_CONFIG: Record<string, { name: string; unit: "u" | "ml" | "un"; color: string; pricePerUnit: number; baseDose: number }> = {
  botox: { name: "Toxina Botulínica (Botox / Dysport)", unit: "u", color: "#06b6d4", pricePerUnit: 38, baseDose: 10 },
  acido_hialuronico: { name: "Ácido Hialurônico (Preenchimento)", unit: "ml", color: "#ec4899", pricePerUnit: 1250, baseDose: 1.0 },
  bioestimulador: { name: "Bioestimulador (Sculptra / Radiesse)", unit: "ml", color: "#8b5cf6", pricePerUnit: 1600, baseDose: 1.0 },
  fios_pdo: { name: "Fios de PDO (Sustentação / Lisos)", unit: "un", color: "#f59e0b", pricePerUnit: 280, baseDose: 2 },
};

export function FacialMapCanvas() {
  const [selectedProductKey, setSelectedProductKey] = useState<string>("botox");
  const [selectedRegion, setSelectedRegion] = useState(PRESET_REGIONS[0]);
  const [markingIntensity, setMarkingIntensity] = useState<"Leve" | "Moderado" | "Avançado">("Moderado");
  const [patientPhoto, setPatientPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const selectedProduct = PRODUCTS_CONFIG[selectedProductKey];

  const [points, setPoints] = useState<InjectionPoint[]>([
    { id: "p1", x: 50, y: 31, label: "Glabela Central", region: "glabela", product: PRODUCTS_CONFIG.botox.name, dose: 15, unit: "u", intensity: "Moderado", price: 15 * 38 },
    { id: "p2", x: 44, y: 28, label: "Corrugador E", region: "glabela", product: PRODUCTS_CONFIG.botox.name, dose: 10, unit: "u", intensity: "Moderado", price: 10 * 38 },
    { id: "p3", x: 56, y: 28, label: "Corrugador D", region: "glabela", product: PRODUCTS_CONFIG.botox.name, dose: 10, unit: "u", intensity: "Moderado", price: 10 * 38 },
    { id: "p4", x: 50, y: 19, label: "Frontal Central", region: "frontal", product: PRODUCTS_CONFIG.botox.name, dose: 10, unit: "u", intensity: "Moderado", price: 10 * 38 },
  ]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Intensidade multiplica a dose base
  const intensityMultiplier = markingIntensity === "Leve" ? 0.75 : markingIntensity === "Moderado" ? 1.0 : 1.5;
  const currentDose = Number((selectedProduct.baseDose * intensityMultiplier).toFixed(1));

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const price = currentDose * selectedProduct.pricePerUnit;

    const newPoint: InjectionPoint = {
      id: "point_" + Date.now(),
      x,
      y,
      label: `${selectedRegion.name}`,
      region: selectedRegion.id,
      product: selectedProduct.name,
      dose: currentDose,
      unit: selectedProduct.unit,
      intensity: markingIntensity,
      price
    };

    setPoints([...points, newPoint]);
    setSelectedPointId(newPoint.id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIsScanning(true);
        setPatientPhoto(event.target?.result as string);
        setTimeout(() => setIsScanning(false), 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoFace = () => {
    setIsScanning(true);
    setPatientPhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80");
    setTimeout(() => setIsScanning(false), 1500);
  };

  const handleRemovePoint = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPoints(points.filter(p => p.id !== id));
    if (selectedPointId === id) setSelectedPointId(null);
  };

  // Cálculos de Totais
  const totalToxinaU = points.filter(p => p.unit === "u").reduce((acc, curr) => acc + curr.dose, 0);
  const totalPreenchedorMl = points.filter(p => p.unit === "ml").reduce((acc, curr) => acc + curr.dose, 0);
  const totalFiosUn = points.filter(p => p.unit === "un").reduce((acc, curr) => acc + curr.dose, 0);
  const totalInvestimento = points.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-2xl space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30 flex items-center gap-1">
              <Sparkles size={11} /> Mapeador Facial & Orçamentos Inteligentes
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">Dra. Conte Estética</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-1">
            Planejamento Facial & Cálculo de Botox
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Carregue a foto do paciente, marque os pontos anatômicos e gere orçamentos de conversão em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
            <Upload size={14} className="text-rd-cyan" /> Upload Foto do Paciente
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <button
            onClick={handleUseDemoFace}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800 transition-all flex items-center gap-1.5"
          >
            <Camera size={14} /> Foto Exemplo
          </button>
          <button
            onClick={() => setPoints([])}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-zinc-800 transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Limpar
          </button>
          <button
            onClick={() => setShowQuoteModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Receipt size={15} /> Gerar Orçamento (R$)
          </button>
        </div>
      </div>

      {/* Grid Principal: Seletor de Produtos + Canvas Interativo + Painel Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna 1: Ferramentas & Seleção de Substância & Intensidade (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              1. Selecionar Procedimento
            </label>
            <div className="space-y-1.5">
              {Object.entries(PRODUCTS_CONFIG).map(([key, prod]) => (
                <button
                  key={key}
                  onClick={() => setSelectedProductKey(key)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    selectedProductKey === key
                      ? "bg-zinc-800 border-rd-cyan text-white shadow-sm"
                      : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: prod.color }} 
                    />
                    <span className="truncate">{prod.name.split(" ")[0]} {prod.name.split(" ")[1]}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">R$ {prod.pricePerUnit}/{prod.unit}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              2. Região Anatômica & Intensidade
            </label>
            <select
              value={selectedRegion.id}
              onChange={(e) => {
                const reg = PRESET_REGIONS.find(r => r.id === e.target.value);
                if (reg) setSelectedRegion(reg);
              }}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rd-cyan"
            >
              {PRESET_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>{reg.name}</option>
              ))}
            </select>

            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] text-zinc-400 font-semibold block">Intensidade das Rugas / Queixa:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Leve", "Moderado", "Avançado"] as const).map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => setMarkingIntensity(intensity)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      markingIntensity === intensity
                        ? intensity === "Leve"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : intensity === "Moderado"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : "bg-zinc-950/60 text-zinc-400 border border-zinc-800 hover:text-white"
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex justify-between items-center">
              <span>Dose Calculada:</span>
              <strong className="text-rd-cyan font-mono">{currentDose} {selectedProduct.unit} (R$ {currentDose * selectedProduct.pricePerUnit})</strong>
            </div>
          </div>

          {/* Resumo de Consumo de Ampolas & Estoque */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
              <PackageCheck size={14} className="text-emerald-400" /> Consumo para o Estoque
            </div>
            <div className="text-[11px] text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Toxina Botulínica:</span>
                <span className="font-mono font-bold text-white">{totalToxinaU} U</span>
              </div>
              <div className="flex justify-between">
                <span>Preenchedores:</span>
                <span className="font-mono font-bold text-white">{totalPreenchedorMl.toFixed(1)} ml</span>
              </div>
              <div className="flex justify-between">
                <span>Fios de PDO:</span>
                <span className="font-mono font-bold text-white">{totalFiosUn} un</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Canvas Interativo da Face (com Suporte a Foto Real ou Vetorial) (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-[3/4] bg-zinc-900/60 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden cursor-crosshair select-none group shadow-2xl">
            
            {/* Foto Real do Paciente OU Desenho Anatômico Vetorial */}
            {patientPhoto ? (
              <img 
                src={patientPhoto} 
                alt="Face do Paciente" 
                className={`w-full h-full object-cover transition-all ${isScanning ? "filter blur-sm brightness-75" : ""}`}
              />
            ) : (
              <svg 
                className="absolute inset-0 w-full h-full text-zinc-700/60 pointer-events-none p-6" 
                viewBox="0 0 300 400" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path d="M 150 40 C 90 40 60 90 60 160 C 60 250 110 350 150 370 C 190 350 240 250 240 160 C 240 90 210 40 150 40 Z" strokeWidth="2" stroke="rgba(255,255,255,0.15)" />
                <path d="M 95 100 Q 150 90 205 100" strokeDasharray="3 3" opacity="0.4" />
                <path d="M 100 120 Q 150 110 200 120" strokeDasharray="3 3" opacity="0.4" />
                <path d="M 90 145 Q 115 135 140 145" strokeWidth="2.5" stroke="rgba(255,255,255,0.3)" />
                <path d="M 160 145 Q 185 135 210 145" strokeWidth="2.5" stroke="rgba(255,255,235,0.3)" />
                <path d="M 95 160 Q 115 150 135 160 Q 115 170 95 160 Z" opacity="0.5" />
                <circle cx="115" cy="160" r="3" fill="currentColor" opacity="0.6" />
                <path d="M 165 160 Q 185 150 205 160 Q 185 170 165 160 Z" opacity="0.5" />
                <circle cx="185" cy="160" r="3" fill="currentColor" opacity="0.6" />
                <path d="M 150 150 L 146 220 L 140 226 Q 150 232 160 226 L 154 220 Z" opacity="0.5" />
                <path d="M 120 270 Q 150 262 180 270 Q 150 282 120 270 Z" strokeWidth="1.5" stroke="rgba(255,255,255,0.25)" />
                <path d="M 130 320 Q 150 330 170 320" strokeDasharray="2 2" opacity="0.3" />
              </svg>
            )}

            {/* Efeito de Scanner de Biometria Facial */}
            {isScanning && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40">
                <div className="w-full h-1 bg-rd-cyan shadow-[0_0_20px_#06b6d4] animate-pulse" />
                <span className="text-xs font-mono font-bold text-rd-cyan mt-4 bg-zinc-950/80 px-3 py-1 rounded-full border border-rd-cyan/30">
                  Mapeando Vetores Faciais...
                </span>
              </div>
            )}

            {/* Guia de Clique */}
            <div 
              onClick={handleCanvasClick} 
              className="absolute inset-0 z-10"
              title="Clique para adicionar ponto de aplicação"
            />

            {/* Pontos Marcados */}
            {points.map((pt) => {
              const isSelected = selectedPointId === pt.id;
              const color = pt.unit === "u" ? "#06b6d4" : pt.unit === "ml" ? "#ec4899" : "#f59e0b";

              return (
                <div
                  key={pt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPointId(pt.id);
                  }}
                  style={{
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute z-20 cursor-pointer flex items-center justify-center transition-all ${
                    isSelected ? "scale-125 ring-4 ring-white/70" : "hover:scale-110"
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 shadow-xl border-2 border-white"
                    style={{ backgroundColor: color }}
                  >
                    {pt.dose}
                  </div>
                  {isSelected && (
                    <span className="absolute -bottom-6 whitespace-nowrap bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded text-[9px] font-mono text-white shadow-xl">
                      {pt.label} (R$ {pt.price})
                    </span>
                  )}
                </div>
              );
            })}

            <div className="absolute bottom-3 inset-x-3 text-center text-[10px] text-zinc-400 font-mono bg-zinc-950/80 backdrop-blur-md py-1 rounded-full border border-zinc-800 pointer-events-none">
              {patientPhoto ? "Foto do Paciente Ativa • Clique para marcar a agulha" : "Toque no rosto para marcar o ponto de injeção"}
            </div>
          </div>
        </div>

        {/* Coluna 3: Lista de Pontos & Totalizador Comercial em R$ (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Card de Investimento Total Instantâneo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 border border-emerald-500/30 space-y-2 shadow-lg">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider block">
              Investimento Total Calculado
            </span>
            <div className="text-2xl font-heading font-extrabold text-white">
              R$ {totalInvestimento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-zinc-400">
              Ou até 10x de R$ {(totalInvestimento / 10).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sem juros
            </p>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Plano de Aplicação ({points.length})
              </span>
              <span className="text-[10px] text-zinc-500">Valor / Ponto</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {points.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  Nenhum ponto marcado. Clique no rosto para adicionar.
                </div>
              ) : (
                points.map((pt, idx) => (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPointId(pt.id)}
                    className={`p-2.5 rounded-xl text-xs border transition-all flex items-center justify-between cursor-pointer ${
                      selectedPointId === pt.id
                        ? "bg-zinc-800 border-rd-cyan text-white"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-[9px] font-mono font-bold flex items-center justify-center text-zinc-300">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-200 leading-tight">{pt.label}</p>
                        <p className="text-[10px] text-zinc-500">{pt.dose} {pt.unit} • {pt.intensity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        R$ {pt.price}
                      </span>
                      <button
                        onClick={(e) => handleRemovePoint(pt.id, e)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Excluir ponto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL DE PROPOSTAS COMERCIAIS & ORÇAMENTO (Benchmark: estetica-app) */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Receipt size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-white">Proposta Comercial de Injetáveis</h3>
                  <p className="text-xs text-zinc-400">Planos gerados automaticamente com base no mapa facial</p>
                </div>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="p-2 text-zinc-400 hover:text-white rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  nome: "1. Essencial (Queixas Principais)",
                  desc: "Correção focada apenas nas linhas hipercinéticas mais evidentes",
                  valor: totalInvestimento * 0.7,
                  tag: "Básico",
                  tagColor: "bg-zinc-800 text-zinc-300"
                },
                {
                  nome: "2. Harmonia Facial (Padrão Ouro)",
                  desc: "Mapeamento completo realizado hoje com bloqueio muscular equilibrado",
                  valor: totalInvestimento,
                  tag: "Mais Vendido",
                  tagColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                },
                {
                  nome: "3. Rejuvenescimento Pleno 360°",
                  desc: "Mapeamento facial completo + 1 sessão de bioestimulador de colágeno",
                  valor: totalInvestimento + 1600,
                  tag: "Completo",
                  tagColor: "bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30"
                }
              ].map((plano, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/40 transition-all flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{plano.nome}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${plano.tagColor}`}>
                        {plano.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{plano.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-mono font-extrabold text-emerald-400 block">
                      R$ {plano.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-zinc-500">em até 10x sem juros</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  alert("Orçamento enviado para o WhatsApp do paciente com sucesso!");
                  setShowQuoteModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Enviar via WhatsApp
              </button>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="px-4 py-3 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

