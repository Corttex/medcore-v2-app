"use client";

import React, { useEffect, useState } from "react";
import { 
  Zap, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  FileText, 
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function CavaloDeTroiaPage() {
  const { isDemo } = useAdminContext();
  const [trojans, setTrojans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrojans = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/cavalo-de-troia?demo=${isDemo}`);
      if (res.ok) {
        const json = await res.json();
        setTrojans(json.trojans || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrojans();
  }, [isDemo]);

  const handleConvert = async (trojanId: string) => {
    try {
      const res = await fetch("/api/admin/cavalo-de-troia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trojanId,
          tenantId: "tenant_converted_" + Date.now(),
          commissionCents: 15000, // R$ 150,00
        }),
      });

      if (res.ok) {
        fetchTrojans();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleContactDoctor = (trojan: any) => {
    const text = encodeURIComponent(
      `Olá ${trojan.workplaceDoctorName || "Doutor(a)"}! Aqui é o Fellipe da Diretoria Medcore. Sua secretária ${trojan.auxiliaryName} já utiliza o Medcore na ${trojan.workplaceClinicName} com alta produtividade (economizou mais de R$ ${(trojan.estimatedMoneySavedCents / 100).toFixed(0)} em faltas evitadas este mês). Gostaria de liberar 30 dias grátis para o consultório completo dos ${trojan.estimatedDoctorsCount} médicos. Como podemos falar hoje?`
    );
    window.open(`https://wa.me/55${(trojan.workplaceDoctorPhone || "").replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  const hotCount = trojans.filter((t) => t.upsellTemperature === "HOT").length;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest">
          <Zap size={14} /> Estratégia Cavalo de Troia
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
          Detector <span className="text-gradient">Cavalo de Troia</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium max-w-3xl leading-relaxed">
          Transforma as auxiliares de <strong>R$ 29,90 (Assistente)</strong> e <strong>R$ 59,90 (Profissional)</strong> nas melhores vendedoras internas de planos B2B de <strong>R$ 497 a R$ 1.497</strong>.
        </p>
      </div>

      {/* Banner de Prontidão para Abordagem */}
      {hotCount > 0 && (
        <div className="p-6 bg-gradient-to-r from-purple-500/15 via-surface-container-low to-primary/10 border border-purple-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Flame size={28} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-purple-400">Gatilho de Upsell B2B Ativado</span>
              <h4 className="text-xl font-bold text-white">
                {hotCount} Secretária(s) Prontas para Abordagem ao Médico Dono
              </h4>
              <p className="text-xs text-zinc-400">
                Elas executaram &gt; 50 ações/semana no Medcore. O médico verá na prática o impacto financeiro imediato.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Auxiliares e Clínicas Vinculadas */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <h3 className="text-xl font-black text-white font-heading">
          Auxiliares Cadastradas & Radar de Clínicas Empreendedoras
        </h3>

        {trojans.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Users size={40} className="mx-auto text-zinc-600" />
            <p className="text-sm text-zinc-400 font-medium">Nenhum lead Cavalo de Troia nesta base.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trojans.map((lead) => (
              <div 
                key={lead.id} 
                className="p-6 rounded-3xl bg-surface-container border border-outline-variant/20 hover:border-purple-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white">{lead.auxiliaryName}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                        {lead.currentPlan === "ASSISTENTE" ? "R$ 29,90/mês" : "R$ 59,90/mês"}
                      </span>
                      {lead.upsellTemperature === "HOT" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <Flame size={10} /> HOT (&gt; 50 ações/sem)
                        </span>
                      )}
                      {lead.upsellTemperature === "CONVERTED" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          CONVERTIDA EM B2B
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      WhatsApp: {lead.auxiliaryPhone} • Clínica: <strong className="text-white">{lead.workplaceClinicName}</strong> (~{lead.estimatedDoctorsCount} médicos)
                    </p>
                    <p className="text-xs text-zinc-400">
                      Médico Responsável: {lead.workplaceDoctorName || "Não informado"} ({lead.workplaceDoctorPhone || "N/A"})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleContactDoctor(lead)}
                      className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Zap size={14} /> Abordar Médico da Clínica
                    </button>

                    {lead.upsellTemperature !== "CONVERTED" ? (
                      <button
                        onClick={() => handleConvert(lead.id)}
                        className="px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 border border-emerald-500/30 rounded-xl font-bold text-xs transition-all active:scale-95"
                      >
                        Marcar Convertido + Pagar Pix R$ 150
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Comissão R$ 150 Paga
                      </span>
                    )}
                  </div>
                </div>

                {/* Métricas de Uso da Auxiliar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-outline-variant/20 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium">Tarefas / Checklists</span>
                    <p className="font-bold text-white">{lead.weeklyTasksCompleted} na semana</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Mensagens Triadas</span>
                    <p className="font-bold text-white">{lead.weeklyMessagesTriaged} na semana</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Economia Gerada para o Chefe</span>
                    <p className="font-black text-emerald-400">R$ {(lead.estimatedMoneySavedCents / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Comissão da Secretária</span>
                    <p className="font-bold text-purple-400">R$ 150,00 no Pix ao fechar</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
