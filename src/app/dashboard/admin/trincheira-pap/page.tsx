"use client";

import React, { useEffect, useState } from "react";
import { 
  Footprints, 
  DoorClosed, 
  ThumbsDown, 
  PlayCircle, 
  CheckCircle, 
  Plus, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  X,
  Sparkles
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function TrincheiraPapPage() {
  const { isDemo } = useAdminContext();
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [clinicName, setClinicName] = useState("");
  const [regionOrSector, setRegionOrSector] = useState("Asa Sul - Brasília");
  const [doctorOrManagerName, setDoctorOrManagerName] = useState("");
  const [secretaryName, setSecretaryName] = useState("");
  const [secretaryPhone, setSecretaryPhone] = useState("");
  const [approachedGatekeeper, setApproachedGatekeeper] = useState(true);
  const [plantedTrojanHorse, setPlantedTrojanHorse] = useState(false);
  const [did3MinLiveDemo, setDid3MinLiveDemo] = useState(false);
  const [closedContractOnSpot, setClosedContractOnSpot] = useState(false);
  const [contractTierClosed, setContractTierClosed] = useState("CLINICA");
  const [rejectionReason, setRejectionReason] = useState("");
  const [objectionDetails, setObjectionDetails] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/trincheira-pap?demo=${isDemo}`);
      if (res.ok) {
        const json = await res.json();
        setVisits(json.visits || []);
        setStats(json.stats || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isDemo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName) return;

    try {
      const res = await fetch("/api/admin/trincheira-pap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName,
          regionOrSector,
          doctorOrManagerName,
          secretaryName,
          secretaryPhone,
          approachedGatekeeper,
          plantedTrojanHorse,
          did3MinLiveDemo,
          closedContractOnSpot,
          contractTierClosed: closedContractOnSpot ? contractTierClosed : undefined,
          rejectionReason: !closedContractOnSpot ? rejectionReason : undefined,
          objectionDetails,
          isDemo,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        // Reset form
        setClinicName("");
        setDoctorOrManagerName("");
        setSecretaryName("");
        setSecretaryPhone("");
        setDid3MinLiveDemo(false);
        setClosedContractOnSpot(false);
        setPlantedTrojanHorse(false);
        setObjectionDetails("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalDoors = stats?.totalDoorsApproached || visits.length;
  const totalNos = stats?.totalNoCount || visits.filter(v => !v.closedContractOnSpot).length;
  const totalDemos = stats?.liveDemoCount || visits.filter(v => v.did3MinLiveDemo).length;
  const totalCloses = stats?.contractsClosedPAP || visits.filter(v => v.closedContractOnSpot).length;
  const valuePerDoor = stats?.valuePerDoorBrl || 430;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header com Botão Mobile-First de Registro Rápido */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Footprints size={14} /> Máquina Comercial PAP (Porta a Porta)
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
            A Matemática do <span className="text-emerald-400">NÃO</span>
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Gamificação da resiliência comercial: cada "NÃO" absorvido gera estatisticamente <strong>R$ 430,00</strong> em valor futuro contratado.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus size={18} strokeWidth={3} /> [+ Registrar Visita PAP em 10s]
        </button>
      </div>

      {/* KPI de Ouro & Os 4 Placas de Guerra */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Portas Batidas */}
        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Portas Abordadas</span>
            <DoorClosed size={20} className="text-primary" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-white font-heading">{totalDoors}</h3>
            <span className="text-xs font-bold text-zinc-500">Meta: 18/dia</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (totalDoors / 18) * 100)}%` }} />
          </div>
        </div>

        {/* KPI 2: A Barra de NÃOS (Gamificada em Verde) */}
        <div className="p-6 bg-surface-container-low border border-emerald-500/30 rounded-3xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-black uppercase tracking-wider">Cota de "NÃOS" Absorvidos</span>
            <ThumbsDown size={20} />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-emerald-400 font-heading">{totalNos}</h3>
            <span className="text-xs font-bold text-emerald-500/80">Meta: 16/dia</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (totalNos / 16) * 100)}%` }} />
          </div>
        </div>

        {/* KPI 3: Demos Ao Vivo de 3 Minutos */}
        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Demos de 3min (Scribe)</span>
            <PlayCircle size={20} className="text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-white font-heading">{totalDemos}</h3>
            <span className="text-xs font-bold text-zinc-500">Meta: 7/dia (37,5%)</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (totalDemos / 7) * 100)}%` }} />
          </div>
        </div>

        {/* KPI 4: Fechamentos Lock-in 30d */}
        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Contratos Fechados</span>
            <CheckCircle size={20} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-white font-heading">{totalCloses}</h3>
            <span className="text-xs font-bold text-zinc-500">Meta: 2,1/dia</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (totalCloses / 2.1) * 100)}%` }} />
          </div>
        </div>

      </div>

      {/* KPI de Ouro: Valor por Porta Batida */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-surface-container-low to-primary/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign size={28} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">KPI de Ouro da Sola de Sapato</span>
            <h4 className="text-xl font-bold text-white">
              Valor Estatístico Médio: <strong className="text-emerald-400">R$ {valuePerDoor.toFixed(2)} por clínica abordada</strong>
            </h4>
            <p className="text-xs text-zinc-400">
              Mesmo quando o médico não atende ou a secretária diz não, você acabou de produzir ~R$ 430 de valor para a Software House.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Visitas Recentes */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <h3 className="text-xl font-black text-white font-heading flex items-center gap-2">
          <MapPin size={20} className="text-primary" /> Histórico de Portas Batidas na Rua
        </h3>

        {visits.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Footprints size={40} className="mx-auto text-zinc-600" />
            <p className="text-sm text-zinc-400 font-medium">Nenhuma visita registrada ainda nesta base.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs text-primary font-bold hover:underline"
            >
              Registrar primeira visita agora
            </button>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {visits.map((v) => (
              <div key={v.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{v.clinicName}</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin size={12} /> {v.regionOrSector}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Responsável: {v.doctorOrManagerName || "Não identificado"} • Secretária: {v.secretaryName || "N/A"}
                  </p>
                  {v.objectionDetails && (
                    <p className="text-xs text-amber-400/90 italic">
                      Objeção: "{v.objectionDetails}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {v.closedContractOnSpot ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                      FECHOU {v.contractTierClosed || "CONTRATO"}
                    </span>
                  ) : v.did3MinLiveDemo ? (
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                      Fez Demo 3min
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium">
                      Porta / Secretária
                    </span>
                  )}
                  {v.plantedTrojanHorse && (
                    <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                      Cavalo R$ 29,90 Ativado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Mobile-First: Registrar Visita PAP em 10s */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-2">
                <Footprints size={20} className="text-emerald-400" />
                <h3 className="text-lg font-black text-white font-heading">Registrar Visita PAP (10s)</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400">Nome da Clínica *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica CardioPrime"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400">Região / Setor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Asa Sul, Taguatinga"
                    value={regionOrSector}
                    onChange={(e) => setRegionOrSector(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">Médico / Gestor</label>
                  <input
                    type="text"
                    placeholder="Nome do médico"
                    value={doctorOrManagerName}
                    onChange={(e) => setDoctorOrManagerName(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400">Nome da Secretária</label>
                  <input
                    type="text"
                    placeholder="Ex: Juliana"
                    value={secretaryName}
                    onChange={(e) => setSecretaryName(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400">WhatsApp da Secretária</label>
                  <input
                    type="text"
                    placeholder="(61) 9...."
                    value={secretaryPhone}
                    onChange={(e) => setSecretaryPhone(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Checkboxes das Etapas */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <input
                    type="checkbox"
                    checked={plantedTrojanHorse}
                    onChange={(e) => setPlantedTrojanHorse(e.target.checked)}
                    className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  Ativou secretária no plano de R$ 29,90 (Cavalo de Troia)?
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <input
                    type="checkbox"
                    checked={did3MinLiveDemo}
                    onChange={(e) => setDid3MinLiveDemo(e.target.checked)}
                    className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  Médico fez a demonstração ao vivo de 3 min no Scribe?
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <input
                    type="checkbox"
                    checked={closedContractOnSpot}
                    onChange={(e) => setClosedContractOnSpot(e.target.checked)}
                    className="rounded border-zinc-700 text-emerald-500 focus:ring-0"
                  />
                  Fechou contrato na hora com 1º Mês Grátis (Lock-in)?
                </label>
              </div>

              {closedContractOnSpot ? (
                <div>
                  <label className="text-xs font-bold text-emerald-400">Plano Fechado</label>
                  <select
                    value={contractTierClosed}
                    onChange={(e) => setContractTierClosed(e.target.value)}
                    className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none"
                  >
                    <option value="CLINICA">Plano Clínica (R$ 497/mês)</option>
                    <option value="MEDICAL_AI">Medical AI Scribe (R$ 697/mês)</option>
                    <option value="BUSINESS">Business Completo (R$ 997/mês)</option>
                    <option value="CLINICA_INTELIGENTE">Redes & Franquias (R$ 1.497/mês)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-400">Motivo da Rejeição / Objeção</label>
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl px-4 py-2 text-xs text-white border border-outline-variant/30 outline-none"
                    >
                      <option value="">Selecione uma objeção...</option>
                      <option value="GATEKEEPER_BLOCKED">Secretária barrou / Médico sem agenda</option>
                      <option value="ALREADY_HAS_LEGACY">Preso em fidelidade de software legado</option>
                      <option value="PRICE_OBJECTION">Achou caro para o momento</option>
                      <option value="NO_PERCEIVED_VALUE">Resistência à IA / Não entendeu valor</option>
                      <option value="FOLLOW_UP_SCHEDULED">Gostou, agendou retorno fixo</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Detalhes da objeção ou data de retorno..."
                      value={objectionDetails}
                      onChange={(e) => setObjectionDetails(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl px-4 py-2 text-xs text-white border border-outline-variant/30 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 font-black text-xs text-zinc-950 rounded-2xl transition-all shadow-md active:scale-95 mt-4"
              >
                SALVAR VISITA E COMPUTAR NÃOS
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
