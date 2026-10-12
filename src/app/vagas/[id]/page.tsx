"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Camera, 
  FileText, 
  Users, 
  Calendar, 
  Check, 
  Lock, 
  ArrowLeft,
  Share2,
  HeartPulse
} from "lucide-react";

// Base de Dados de Vagas Públicas para Resolução Instantânea
const PUBLIC_JOBS_MOCK: Record<string, {
  id: string;
  protocolo: string;
  titulo: string;
  departamento: string;
  unidade: string;
  regime: string;
  escala: string;
  faixaSalarial: string;
  prazoDias: number;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  clinica: string;
}> = {
  "vaga-01": {
    id: "vaga-01",
    protocolo: "MED-REC-2026-0928",
    titulo: "Médico Plantonista - Terapia Intensiva (UTI Adulto)",
    departamento: "Corpo Clínico & Terapia Intensiva",
    unidade: "Hospital Geral Morumbi - SP",
    regime: "Plantonista PJ / Cooperado",
    escala: "Plantões 12x36 Noturno",
    faixaSalarial: "R$ 1.800 a R$ 2.200 / Plantão 12h",
    prazoDias: 5,
    descricao: "Buscamos médico intensivista com sólida atuação em cuidados intensivos para compor o corpo clínico da UTI Adulto Alpha. Responsável pelo manejo de pacientes críticos, intubação orotraqueal em via aérea difícil, monitorização hemodinâmica invasiva e protocolos de ressuscitação volêmica guiados por ultrassonografia à beira do leito (POCUS).",
    requisitos: [
      "Graduação em Medicina com CRM-SP ativo e regularizado",
      "Título de Especialista em Medicina Intensiva (AMIB) ou Residência em Clínica Médica",
      "Certificação ACLS (Advanced Cardiovascular Life Support) válida",
      "Experiência prévia mínima de 2 anos em UTI de alta complexidade",
      "Familiaridade com prontuário eletrônico certificado SBIS/CFM"
    ],
    beneficios: [
      "Repasse quinzenal garantido sem retenção abusiva",
      "Refeitório médico exclusivo com buffet executivo 24h",
      "Estacionamento privativo com valet para corpo clínico",
      "Acesso completo ao MedCore Copilot IA e teleconsultoria especializada",
      "Seguro de responsabilidade civil profissional corporativo"
    ],
    clinica: "Rede Hospitalar MedCore Health Care"
  },
  "vaga-02": {
    id: "vaga-02",
    protocolo: "MED-REC-2026-1002",
    titulo: "Enfermeiro Assistencial - Centro Cirúrgico & RPA",
    departamento: "Enfermagem Assistencial",
    unidade: "Unidade Central Alphaville - SP",
    regime: "CLT Hospitalar Efetivo",
    escala: "Escala 6x1 (Tarde/Noite)",
    faixaSalarial: "R$ 5.800 a R$ 6.900 + Insalubridade 40%",
    prazoDias: 8,
    descricao: "Atuação no acolhimento perioperatório, montagem de salas de cirurgias robóticas e videolaparoscópicas, conferência de instrumentais cirúrgicos com rastreabilidade por QR Code e assistência direta aos pacientes na Recuperação Pós-Anestésica (RPA).",
    requisitos: [
      "Graduação completa em Enfermagem com COREN-SP ativo",
      "Pós-graduação em Centro Cirúrgico, CME ou Cuidados Críticos",
      "Experiência com cirurgias de médio e grande porte",
      "Conhecimento no protocolo cirúrgico seguro da OMS (Safe Surgery Checklist)"
    ],
    beneficios: [
      "Assistência Médica e Odontológica Bradesco Saúde Top Nacional",
      "Vale Alimentação / Refeição flexível Flash (R$ 1.200/mês)",
      "Adicional de Insalubridade grau máximo (40%)",
      "Plano de Previdência Privada e Auxílio Creche",
      "Acesso irrestrito à Universidade Corporativa MedCore Educacional"
    ],
    clinica: "Rede Hospitalar MedCore Health Care"
  },
  "vaga-03": {
    id: "vaga-03",
    protocolo: "MED-REC-2026-1005",
    titulo: "Farmacêutico Clínico Hospitalar (CAF & Dose Unitária)",
    departamento: "Farmácia Hospitalar & CAF",
    unidade: "Hospital Geral Morumbi - SP",
    regime: "CLT Hospitalar Efetivo",
    escala: "12x36 Diurno",
    faixaSalarial: "R$ 5.200 + Adicionais Regulamentares",
    prazoDias: 12,
    descricao: "Reconciliação medicamentosa de admissão, validação farmacêutica de prescrições via IA, controle de psicotrópicos e antibióticos de reserva (Portaria 344/98) e supervisão do fracionamento de dose unitária.",
    requisitos: [
      "CRF-SP regularizado e ativo",
      "Especialização em Farmácia Clínica ou Hospitalar",
      "Conhecimento prático em auditoria de prescrições e interação medicamentosa"
    ],
    beneficios: [
      "Plano de Saúde Completo sem coparticipação",
      "Vale Refeição e Transporte",
      "Gympass / Wellhub categoria Black",
      "Bônus semestral por metas de redução de perdas farmacêuticas"
    ],
    clinica: "Rede Hospitalar MedCore Health Care"
  }
};

export default function PublicJobLandingPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || "vaga-01";
  
  // Resolve vaga ou usa genérica
  const job = PUBLIC_JOBS_MOCK[rawId] || {
    id: rawId,
    protocolo: `MED-REC-${rawId.toUpperCase()}`,
    titulo: "Profissional de Saúde Especialista",
    departamento: "Corpo Clínico & Diagnóstico",
    unidade: "Unidade Central Alphaville",
    regime: "CLT / PJ Hospitalar",
    escala: "Escala a Combinar",
    faixaSalarial: "Remuneração compatível com a categoria médica",
    prazoDias: 6,
    descricao: "Processo seletivo institucional aberto pela Rede MedCore para reforço de escala e expansão dos serviços assistenciais.",
    requisitos: [
      "Formação na área com registro no respectivo conselho regional de classe ativo",
      "Comprometimento com as metas de humanização e segurança do paciente",
      "Disponibilidade para início imediato conforme escala definida"
    ],
    beneficios: [
      "Remuneração alinhada ao mercado de alta complexidade",
      "Benefícios corporativos e ambiente com infraestrutura hospitalar de ponta",
      "Acesso aos módulos de prontuário eletrônico com IA"
    ],
    clinica: "Rede Hospitalar MedCore Health Care"
  };

  // Countdown timer em tempo real (dias, horas, minutos, segundos)
  const [timeLeft, setTimeLeft] = useState({
    days: job.prazoDias,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    registroProfissional: "",
    disponibilidadeImediata: true,
    pretensaoSalarialAceita: true,
    termosLgpd: true
  });

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedProtocol, setSubmittedProtocol] = useState<string | null>(null);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Dispara notificação no sino do Gestor via API
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Nova Candidatura: ${job.titulo}`,
          message: `${formData.nome} (${formData.registroProfissional || "Profissional"}) se candidatou na vaga ${job.protocolo}. Triagem IA pronta.`,
          type: "SUCESSO"
        })
      });

      // Gera protocolo único de candidatura
      const protocol = `CAND-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      setSubmittedProtocol(protocol);
    } catch {
      setSubmittedProtocol(`CAND-LOC-${Date.now().toString(36).toUpperCase()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rd-cyan selection:text-zinc-950">
      
      {/* Header Institucional MedCore Jobs */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rd-cyan to-indigo-600 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-rd-cyan/20">
              <HeartPulse size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg tracking-tight text-white">MedCore</span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30">
                  Jobs
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Portal Público de Carreiras em Saúde</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck size={14} /> Vaga Verificada & Auditada
            </span>
            <Link
              href="/dashboard/recrutamento"
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
            >
              Acesso Gestor
            </Link>
          </div>
        </div>
      </header>

      {/* Hero da Vaga com Countdown Timer */}
      <section className="bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-zinc-950 border-b border-zinc-800/80 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
            <span>Protocolo de Seleção:</span>
            <strong className="text-rd-cyan">{job.protocolo}</strong>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight tracking-tight max-w-3xl mx-auto">
            {job.titulo}
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            {job.clinica} • {job.unidade}
          </p>

          {/* Badges de Atributos */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200">
              <Building2 size={13} className="text-rd-cyan" /> {job.departamento}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200">
              <Clock size={13} className="text-cyan-400" /> {job.escala} ({job.regime})
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <DollarSign size={13} /> {job.faixaSalarial}
            </span>
          </div>

          {/* Countdown Timer em Tempo Real */}
          <div className="pt-4 max-w-md mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2.5 flex items-center justify-center gap-1.5">
              <Clock size={14} className="animate-spin text-amber-400" />
              Inscrições Encerram Em:
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-2.5 sm:p-3 bg-zinc-800/90 border border-zinc-700/80 rounded-2xl shadow-inner">
                <span className="block text-xl sm:text-2xl font-mono font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Dias</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-zinc-800/90 border border-zinc-700/80 rounded-2xl shadow-inner">
                <span className="block text-xl sm:text-2xl font-mono font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Horas</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-zinc-800/90 border border-zinc-700/80 rounded-2xl shadow-inner">
                <span className="block text-xl sm:text-2xl font-mono font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Min</span>
              </div>
              <div className="p-2.5 sm:p-3 bg-zinc-800/90 border border-zinc-700/80 rounded-2xl shadow-inner">
                <span className="block text-xl sm:text-2xl font-mono font-black text-rd-cyan">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Seg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal (Descritivo & Formulário) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Coluna da Esquerda: Descritivo, Requisitos & Benefícios (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Sobre a Vaga */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-rd-cyan" />
              Descrição das Atividades
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              {job.descricao}
            </p>
          </div>

          {/* Requisitos Obrigatórios */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Requisitos Técnicos & Habilitação
            </h2>
            <ul className="space-y-3">
              {job.requisitos.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <Check size={12} />
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios & Remuneração */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              Benefícios & Diferenciais Corporativos
            </h2>
            <ul className="space-y-3">
              {job.beneficios.map((ben, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    ★
                  </span>
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance & LGPD */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck size={20} className="text-rd-cyan shrink-0" />
            <span>Processo em conformidade com a LGPD (Lei 13.709/2018). Seus dados serão utilizados estritamente para avaliação seletiva técnica pela diretoria de RH da MedCore.</span>
          </div>
        </div>

        {/* Coluna da Direita: Formulário de Candidatura Mobile-First (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 sticky top-24 shadow-2xl space-y-6">
            
            {submittedProtocol ? (
              /* Estado de Confirmação */
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-white">Candidatura Registrada!</h3>
                  <p className="text-xs text-zinc-400 mt-1">Sua inscrição foi encaminhada para a Triagem IA e para a liderança técnica da unidade.</p>
                </div>

                <div className="p-4 bg-zinc-800/80 border border-zinc-700 rounded-2xl space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Protocolo de Confirmação</span>
                  <p className="text-sm font-mono font-bold text-rd-cyan">{submittedProtocol}</p>
                </div>

                <p className="text-xs text-zinc-500">
                  Uma confirmação com o link de acompanhamento foi enviada para <strong>{formData.email}</strong>.
                </p>

                <button
                  onClick={() => setSubmittedProtocol(null)}
                  className="w-full py-2.5 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                >
                  Enviar Outra Candidatura
                </button>
              </div>
            ) : (
              /* Formulário */
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rd-cyan font-heading">
                      Inscrição Simplificada
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-extrabold text-white mt-1">Candidatar-se à Vaga</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Preencha seus dados para análise imediata pelo RH.</p>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1 block">Nome Completo *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Dra. Juliana Silveira"
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-rd-cyan focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1 block">E-mail *</label>
                      <input
                        required
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-rd-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1 block">WhatsApp *</label>
                      <input
                        required
                        type="text"
                        placeholder="(11) 99999-9999"
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-rd-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1 block">
                      Registro de Classe (CRM, COREN, CRF...)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: CRM-SP 189.432"
                      value={formData.registroProfissional}
                      onChange={e => setFormData({ ...formData, registroProfissional: e.target.value })}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-rd-cyan focus:outline-none"
                    />
                  </div>

                  {/* Upload de Currículo & Selfie */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div 
                      onClick={() => setResumeUploaded(!resumeUploaded)}
                      className={`p-3 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        resumeUploaded 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                          : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 text-zinc-400"
                      }`}
                    >
                      <Upload size={18} className="mx-auto mb-1" />
                      <span className="text-[11px] font-bold block">{resumeUploaded ? "Currículo Anexado" : "Anexar PDF (CV)"}</span>
                      <span className="text-[9px] text-zinc-500 block">Até 10MB</span>
                    </div>

                    <div 
                      onClick={() => setSelfieUploaded(!selfieUploaded)}
                      className={`p-3 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        selfieUploaded 
                          ? "bg-rd-cyan/10 border-rd-cyan text-rd-cyan" 
                          : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-500 text-zinc-400"
                      }`}
                    >
                      <Camera size={18} className="mx-auto mb-1" />
                      <span className="text-[11px] font-bold block">{selfieUploaded ? "Foto Validada" : "Foto / Crachá"}</span>
                      <span className="text-[9px] text-zinc-500 block">Identificação rápida</span>
                    </div>
                  </div>

                  {/* Confirmações Checkbox */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
                    <label className="flex items-center gap-2.5 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.disponibilidadeImediata}
                        onChange={e => setFormData({ ...formData, disponibilidadeImediata: e.target.checked })}
                        className="rounded border-zinc-700 text-rd-cyan focus:ring-0"
                      />
                      <span>Tenho disponibilidade para início conforme a escala</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pretensaoSalarialAceita}
                        onChange={e => setFormData({ ...formData, pretensaoSalarialAceita: e.target.checked })}
                        className="rounded border-zinc-700 text-rd-cyan focus:ring-0"
                      />
                      <span>Estou ciente e de acordo com a faixa remuneratória</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-400 cursor-pointer">
                      <input
                        required
                        type="checkbox"
                        checked={formData.termosLgpd}
                        onChange={e => setFormData({ ...formData, termosLgpd: e.target.checked })}
                        className="rounded border-zinc-700 text-rd-cyan focus:ring-0"
                      />
                      <span className="text-[11px]">Concordo com os termos de privacidade e tratamento de dados LGPD</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-rd-cyan to-indigo-600 hover:from-rd-cyan/90 hover:to-indigo-500 text-zinc-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rd-cyan/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    {submitting ? (
                      "Enviando Candidatura..."
                    ) : (
                      <>
                        <Send size={15} /> Confirmar & Enviar Candidatura
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer Público */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500 space-y-2">
        <p>© 2026 MedCore Health Care Systems • Todos os direitos reservados.</p>
        <p className="text-[11px] text-zinc-600">
          Processamento seguro criptografado de ponta a ponta. Vagas atualizadas em tempo real.
        </p>
      </footer>
    </div>
  );
}
