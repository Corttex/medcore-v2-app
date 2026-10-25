"use client";

import React, { useEffect, useState } from "react";
import { 
  Timer, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Users, 
  Tv, 
  Box, 
  Mic, 
  Send, 
  ShieldAlert, 
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function LockInOnboardingPage() {
  const { isDemo } = useAdminContext();
  const [lockIns, setLockIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLockIns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/lockin-onboarding?demo=${isDemo}`);
      if (res.ok) {
        const json = await res.json();
        setLockIns(json.lockIns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockIns();
  }, [isDemo]);

  const handleToggleMarco = async (tenantId: string, field: string, currentValue: boolean | number) => {
    try {
      const updates: any = {};
      if (typeof currentValue === "boolean") {
        updates[field] = !currentValue;
      } else {
        updates[field] = currentValue > 0 ? 0 : 50; // Alterna contadores de marco
      }

      const res = await fetch("/api/admin/lockin-onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, ...updates }),
      });

      if (res.ok) {
        fetchLockIns();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVipIntervention = (tenant: any) => {
    const text = encodeURIComponent(
      `Olá ${tenant.doctorName || "Doutor(a)"}! Aqui é o Fellipe da Diretoria de Implantação Medcore. Notei que seu painel está no Dia ${tenant.daysSinceStart} e gostaria de agendar um setup assistido VIP de 15 minutos hoje para ligar sua IA e WhatsApp. Qual o melhor horário?`
    );
    window.open(`https://wa.me/55${(tenant.doctorPhone || "").replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  const highRiskTenants = lockIns.filter((l) => l.daysSinceStart >= 4 && l.lockInScore < 40);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          <Timer size={14} /> Switching Cost & Enraizamento
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
          Radar de Lock-in dos <span className="text-gradient">Primeiros 7 Dias</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium max-w-3xl leading-relaxed">
          Garante que 96%+ das clínicas que entram com <strong>1º Mês Grátis</strong> (contratos de 6 a 12 meses) criem raízes operacionais profundas e jamais cancelem no Dia 30.
        </p>
      </div>

      {/* Alerta de Resgate Crítico no D+4 */}
      {highRiskTenants.length > 0 && (
        <div className="p-6 bg-rose-500/10 border-2 border-rose-500/50 rounded-3xl space-y-4 animate-pulse">
          <div className="flex items-center gap-3 text-rose-400">
            <ShieldAlert size={24} />
            <h3 className="text-lg font-black font-heading uppercase tracking-wide">
              {highRiskTenants.length} Clínica(s) em Risco Crítico de Evasão (D+4 com Score &lt; 40%)
            </h3>
          </div>
          <p className="text-xs text-zinc-300 font-medium">
            Estas clínicas assinaram há mais de 4 dias mas não atingiram os marcos de enraizamento. Dispare a intervenção assistida via WhatsApp imediatamente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highRiskTenants.map((t) => (
              <div key={t.id} className="p-4 bg-surface-container rounded-2xl border border-rose-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white">{t.tenantName}</h4>
                  <p className="text-xs text-rose-300 font-medium">Dia {t.daysSinceStart} de 30 • Score {t.lockInScore}%</p>
                  <p className="text-[11px] text-zinc-400">{t.doctorName} ({t.doctorPhone})</p>
                </div>
                <button
                  onClick={() => handleVipIntervention(t)}
                  className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs rounded-xl shadow-lg transition-all shrink-0 active:scale-95"
                >
                  Disparar Intervenção VIP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela Interativa dos 5 Marcos de Enraizamento */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white font-heading">
            Clínicas em Onboarding (Primeiros 30 Dias)
          </h3>
          <span className="text-xs font-bold text-zinc-400">
            {lockIns.length} Clínica(s) sob monitoramento ativo
          </span>
        </div>

        {lockIns.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Timer size={40} className="mx-auto text-zinc-600" />
            <p className="text-sm text-zinc-400 font-medium">Nenhuma clínica em trial nesta base.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lockIns.map((item) => (
              <div 
                key={item.id} 
                className={`p-6 rounded-3xl border transition-all ${
                  item.lockInScore >= 75
                    ? "bg-surface-container-low border-emerald-500/30"
                    : item.lockInScore >= 40
                    ? "bg-surface-container-low border-amber-500/30"
                    : "bg-surface-container-low border-rose-500/40"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-black text-white">{item.tenantName}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-zinc-800 text-zinc-300">
                        Dia {item.daysSinceStart} de 30
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Médico: {item.doctorName || "N/A"} • WhatsApp: {item.doctorPhone || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-400 uppercase">Lock-in Score</span>
                      <div className="text-2xl font-black text-white font-heading">{item.lockInScore}%</div>
                    </div>
                    <button
                      onClick={() => handleVipIntervention(item)}
                      className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} /> Chamar no WhatsApp
                    </button>
                  </div>
                </div>

                {/* Os 5 Marcos Clicáveis */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-outline-variant/20">
                  
                  {/* Marco 1: WhatsApp (+20%) */}
                  <button
                    onClick={() => handleToggleMarco(item.tenantId, "whatsappConnected", item.whatsappConnected)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      item.whatsappConnected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-container-highest/40 border-outline-variant/20 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <MessageSquare size={14} />
                      <span className="text-[10px] font-black">+20%</span>
                    </div>
                    <span className="text-xs font-bold block">1. WhatsApp Pareado</span>
                    <span className="text-[10px] opacity-75">Dra. Conte triando</span>
                  </button>

                  {/* Marco 2: Pacientes (+20%) */}
                  <button
                    onClick={() => handleToggleMarco(item.tenantId, "patientsImportedCount", item.patientsImportedCount)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      item.patientsImportedCount >= 50
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-container-highest/40 border-outline-variant/20 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Users size={14} />
                      <span className="text-[10px] font-black">+20%</span>
                    </div>
                    <span className="text-xs font-bold block">2. &ge; 50 Pacientes</span>
                    <span className="text-[10px] opacity-75">Base importada</span>
                  </button>

                  {/* Marco 3: Kanban & TV (+15%) */}
                  <button
                    onClick={() => handleToggleMarco(item.tenantId, "kanbanAndTvConfigured", item.kanbanAndTvConfigured)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      item.kanbanAndTvConfigured
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-container-highest/40 border-outline-variant/20 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Tv size={14} />
                      <span className="text-[10px] font-black">+15%</span>
                    </div>
                    <span className="text-xs font-bold block">3. Kanban & Painel TV</span>
                    <span className="text-[10px] opacity-75">Recepção ativa</span>
                  </button>

                  {/* Marco 4: Estoque & Patrimônio (+15%) */}
                  <button
                    onClick={() => handleToggleMarco(item.tenantId, "inventoryAndAssetsCount", item.inventoryAndAssetsCount)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      item.inventoryAndAssetsCount >= 10
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-container-highest/40 border-outline-variant/20 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Box size={14} />
                      <span className="text-[10px] font-black">+15%</span>
                    </div>
                    <span className="text-xs font-bold block">4. &ge; 10 Insumos</span>
                    <span className="text-[10px] opacity-75">Estoque cadastrado</span>
                  </button>

                  {/* Marco 5: Medical Scribe (+30%) */}
                  <button
                    onClick={() => handleToggleMarco(item.tenantId, "aiScribeConsultationsUsed", item.aiScribeConsultationsUsed)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      item.aiScribeConsultationsUsed >= 15
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-surface-container-highest/40 border-outline-variant/20 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Mic size={14} />
                      <span className="text-[10px] font-black">+30%</span>
                    </div>
                    <span className="text-xs font-bold block">5. &ge; 15 Consultas SOAP</span>
                    <span className="text-[10px] opacity-75">Vício no Medical Scribe</span>
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
