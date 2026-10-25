"use client";

import React, { useEffect, useState } from "react";
import { 
  Mic, 
  Cpu, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  BarChart3
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export default function TelemetriaIaPage() {
  const { isDemo } = useAdminContext();
  const [telemetry, setTelemetry] = useState<any[]>([]);

  useEffect(() => {
    // Dados de telemetria reais / demo
    const mockData = [
      {
        id: "ai_1",
        clinicName: "CardioVida Prime Brasília",
        doctorName: "Dr. Marcelo Arantes",
        plan: "Medical AI (R$ 697,00)",
        audioMinutes: 70,
        soapNotesCount: 22,
        inputTokens: 145000,
        outputTokens: 48000,
        apiCostBrl: 38.40,
        revenueBrl: 697.00,
        marginPercent: 94.5,
      },
      {
        id: "ai_2",
        clinicName: "Clínica Pediátrica Crescer",
        doctorName: "Dr. Lucas Martins",
        plan: "Business (R$ 997,00)",
        audioMinutes: 110,
        soapNotesCount: 35,
        inputTokens: 220000,
        outputTokens: 75000,
        apiCostBrl: 58.20,
        revenueBrl: 997.00,
        marginPercent: 94.1,
      },
    ];
    setTelemetry(mockData);
  }, [isDemo]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          <Cpu size={14} /> Margem Líquida & Tokenomics
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
          Telemetria Dra. Conte & <span className="text-gradient">Medical Scribe</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium max-w-3xl leading-relaxed">
          Monitoramento em tempo real do custo de APIs (Whisper + LLM SOAP) vs. receita de cada médico, garantindo <strong>margem bruta acima de 90%</strong>.
        </p>
      </div>

      {/* Cards de Resumo de Margem */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface-container-low border border-emerald-500/30 rounded-3xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Margem Bruta Média</span>
          <div className="text-3xl font-black text-emerald-400 font-heading">94.3%</div>
          <p className="text-xs text-zinc-400">Excelente saúde unit economics</p>
        </div>

        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Custo Médio por Médico</span>
          <div className="text-3xl font-black text-white font-heading">R$ 48,30/mês</div>
          <p className="text-xs text-zinc-400">Para ticket de R$ 697 a R$ 997</p>
        </div>

        <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">Minutos de Áudio Transcritos</span>
          <div className="text-3xl font-black text-primary font-heading">180 min</div>
          <p className="text-xs text-zinc-400">Consultas SOAP em tempo real</p>
        </div>
      </div>

      {/* Tabela de Médicos e Consumo */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
        <h3 className="text-xl font-black text-white font-heading">
          Consumo Individual por Médico / Clínica
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-zinc-400 font-black uppercase tracking-wider">
                <th className="py-3 px-4">Médico / Clínica</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4">Minutos de Áudio</th>
                <th className="py-3 px-4">Consultas SOAP</th>
                <th className="py-3 px-4">Custo API</th>
                <th className="py-3 px-4">Receita</th>
                <th className="py-3 px-4 text-right">Margem %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-medium">
              {telemetry.map((t) => (
                <tr key={t.id} className="hover:bg-surface-container-highest/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-white block">{t.doctorName}</span>
                    <span className="text-[11px] text-zinc-500">{t.clinicName}</span>
                  </td>
                  <td className="py-4 px-4 text-zinc-300">{t.plan}</td>
                  <td className="py-4 px-4 text-zinc-300">{t.audioMinutes} min</td>
                  <td className="py-4 px-4 text-zinc-300">{t.soapNotesCount} consultas</td>
                  <td className="py-4 px-4 font-bold text-rose-400">R$ {t.apiCostBrl.toFixed(2)}</td>
                  <td className="py-4 px-4 font-bold text-emerald-400">R$ {t.revenueBrl.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-black text-emerald-400 text-sm">
                    {t.marginPercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
