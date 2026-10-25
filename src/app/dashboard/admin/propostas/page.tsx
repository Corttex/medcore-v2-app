"use client";

import React, { useState } from "react";
import { 
  Link as LinkIcon, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  Building2,
  Calendar,
  Gift
} from "lucide-react";

export default function PropostasPage() {
  const [tier, setTier] = useState<string>("CLINICA");
  const [billingCycle, setBillingCycle] = useState<string>("SEMIANNUAL");
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [hasFirstMonthFree, setHasFirstMonthFree] = useState(true);
  const [waiveSetupFee, setWaiveSetupFee] = useState(true);
  const [salesRepName, setSalesRepName] = useState("Fellipe / Medcore Executivo");

  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const plansConfig: Record<string, { name: string; monthlyPrice: number; setup: number }> = {
    CLINICA: { name: "Plano Clínica (Até 5 Usuários)", monthlyPrice: 497, setup: 1500 },
    MEDICAL_AI: { name: "Medical AI (Dra. Conte Scribe)", monthlyPrice: 697, setup: 1500 },
    BUSINESS: { name: "Business (Ilimitado + TISS + RH)", monthlyPrice: 997, setup: 2500 },
    CLINICA_INTELIGENTE: { name: "Clínica Inteligente (Redes & Franquias)", monthlyPrice: 1497, setup: 5000 },
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/propostas/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          billingCycle,
          clinicName: clinicName || "Clínica Parceira",
          doctorName,
          doctorPhone,
          doctorEmail,
          hasFirstMonthFree,
          waiveSetupFee,
          salesRepName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setGeneratedProposal(json.proposal);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fullCheckoutLink = generatedProposal 
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/saas?prop=${generatedProposal.proposalId}`
    : "";

  const handleCopy = () => {
    if (!fullCheckoutLink) return;
    navigator.clipboard.writeText(fullCheckoutLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          <LinkIcon size={14} /> Fechamento em Campo (PAP / Zoom)
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-white">
          Gerador de <span className="text-gradient">Propostas Relâmpago</span>
        </h1>
        <p className="text-sm text-zinc-400 font-medium max-w-3xl leading-relaxed">
          Gere na hora o link de adesão digital e QR Code para o médico assinar durante a visita de 3 minutos, com <strong>1º Mês Grátis + Isenção de Setup de R$ 1.500</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário de Configuração */}
        <div className="lg:col-span-7 p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-black text-white font-heading flex items-center gap-2">
            <CreditCard size={20} className="text-primary" /> Parâmetros da Oferta Comercial
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Escolha do Pacote */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-2">Pacote B2B Escolhido</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(plansConfig).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTier(key)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      tier === key
                        ? "bg-primary/10 border-primary text-white shadow-md shadow-primary/20"
                        : "bg-surface-container border-outline-variant/20 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{item.name}</div>
                    <div className="text-sm font-black text-primary font-heading">
                      R$ {item.monthlyPrice.toLocaleString("pt-BR")}/mês
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ciclo e Fidelidade */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-2">Ciclo de Contrato & Fidelidade</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle("SEMIANNUAL")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    billingCycle === "SEMIANNUAL"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-surface-container border-outline-variant/20 text-zinc-400"
                  }`}
                >
                  <span className="text-xs block">Contrato Semestral (6 meses)</span>
                  <span className="text-[10px] text-zinc-500">Elegível 1º Mês Grátis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle("ANNUAL")}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    billingCycle === "ANNUAL"
                      ? "bg-purple-500/10 border-purple-500 text-purple-400 font-bold"
                      : "bg-surface-container border-outline-variant/20 text-zinc-400"
                  }`}
                >
                  <span className="text-xs block">Contrato Anual (12 meses)</span>
                  <span className="text-[10px] text-zinc-500">Máximo Lock-in</span>
                </button>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400">Nome da Clínica</label>
                <input
                  type="text"
                  placeholder="Ex: Clínica CardioPrime"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400">Nome do Médico / Gestor</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Marcelo Arantes"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-400">WhatsApp para Envio</label>
                <input
                  type="text"
                  placeholder="(61) 9...."
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400">Consultor Comercial</label>
                <input
                  type="text"
                  value={salesRepName}
                  onChange={(e) => setSalesRepName(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl px-4 py-2.5 text-xs text-white border border-outline-variant/30 outline-none"
                />
              </div>
            </div>

            {/* Trava das Ofertas Irrecusáveis */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <input
                  type="checkbox"
                  checked={hasFirstMonthFree}
                  onChange={(e) => setHasFirstMonthFree(e.target.checked)}
                  className="rounded border-zinc-700 text-emerald-500"
                />
                1º Mês Grátis de Implantação (1ª Cobrança agendada para D+30)
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-primary">
                <input
                  type="checkbox"
                  checked={waiveSetupFee}
                  onChange={(e) => setWaiveSetupFee(e.target.checked)}
                  className="rounded border-zinc-700 text-primary"
                />
                Isenção Total da Taxa de Implantação Setup (De R$ 1.500 por R$ 0)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> GERAR LINK E QR CODE IMEDIATO
            </button>
          </form>
        </div>

        {/* Preview do Link & QR Code */}
        <div className="lg:col-span-5 p-8 bg-surface-container-low border border-outline-variant/30 rounded-[2.5rem] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white font-heading flex items-center gap-2">
              <QrCode size={20} className="text-emerald-400" /> Link de Checkout Pronto
            </h3>

            {generatedProposal ? (
              <div className="space-y-5 animate-in fade-in">
                {/* Card de Resumo da Proposta */}
                <div className="p-5 rounded-2xl bg-surface-container border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Contrato Semestral</span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      1º Mês R$ 0,00
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">{generatedProposal.clinicName}</h4>
                  <p className="text-xs text-zinc-400">
                    Plano: <strong className="text-white">{generatedProposal.plan.name}</strong>
                  </p>
                  <div className="text-xs text-zinc-400 border-t border-outline-variant/20 pt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Mensalidade Recorrente:</span>
                      <strong className="text-white">R$ {generatedProposal.monthlyPriceBrl.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Setup:</span>
                      <strong className="text-emerald-400 line-through text-zinc-500 mr-1">R$ 1.500</strong>
                      <strong className="text-emerald-400">R$ 0,00 (Isento)</strong>
                    </div>
                    <div className="flex justify-between font-bold text-white pt-1">
                      <span>Valor Total Contratado:</span>
                      <span className="text-primary">R$ {generatedProposal.totalContractBrl.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Caixa do Link Curto */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400">Link Direto para o Médico</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={fullCheckoutLink}
                      className="w-full bg-surface-container-highest rounded-xl px-3 py-2 text-xs text-zinc-300 border border-outline-variant/30 outline-none select-all"
                    />
                    <button
                      onClick={handleCopy}
                      className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all active:scale-95 shrink-0"
                      title="Copiar Link"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-[11px] text-emerald-400 font-bold">Link copiado para a área de transferência!</p>
                  )}
                </div>

                {/* QR Code Simulado em SVG */}
                <div className="p-6 bg-white rounded-2xl flex flex-col items-center justify-center space-y-2">
                  <div className="w-36 h-36 bg-zinc-950 p-2 rounded-xl flex items-center justify-center">
                    <QrCode size={120} className="text-white" />
                  </div>
                  <span className="text-[11px] text-zinc-800 font-black uppercase tracking-wider">
                    Aponte a câmera do celular
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <QrCode size={48} className="mx-auto text-zinc-600" />
                <p className="text-sm text-zinc-400 font-medium">
                  Configure os parâmetros ao lado e clique em "Gerar Link" para gerar o QR Code de adesão em campo.
                </p>
              </div>
            )}
          </div>

          <div className="text-xs text-zinc-500 font-medium border-t border-outline-variant/20 pt-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Contrato digital padrão Medcore com assinatura eletrônica e tokenização no gateway.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
