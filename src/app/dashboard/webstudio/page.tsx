"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Layout, 
  Sparkles, 
  Eye, 
  Save, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Share2, 
  Palette, 
  Settings, 
  Phone, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  HeartPulse, 
  Check, 
  AlertCircle, 
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";

interface SiteTemplate {
  id: string;
  name: string;
  sector: "Dermatologia" | "Odontologia" | "Pediatria" | "Clínica Geral" | "MedVet";
  tagline: string;
  themeColor: string;
  accentColor: string;
  bannerHeadline: string;
  bannerSubheadline: string;
  services: { title: string; desc: string }[];
}

const TEMPLATES: SiteTemplate[] = [
  {
    id: "derma-premium",
    name: "Dermatologia & Estética Avançada",
    sector: "Dermatologia",
    tagline: "Saúde da Pele, Rejuvenescimento & Laser",
    themeColor: "from-rose-500/20 via-pink-500/10 to-zinc-950",
    accentColor: "rose-500",
    bannerHeadline: "Sua Pele Saudável com Tecnologia Médica de Ponta",
    bannerSubheadline: "Protocolos dermatológicos de alta precisão, tratamentos com laser e harmonização facial com corpo clínico certificado pela SBD.",
    services: [
      { title: "Laser Fracionado & Fotona", desc: "Rejuvenescimento profundo e tratamento de cicatrizes cirúrgicas." },
      { title: "Toxina Botulínica & Bioestimuladores", desc: "Restauração do colágeno com resultados naturais e duradouros." },
      { title: "Mapeamento Corporal de Pintas", desc: "Dermatoscopia digital para prevenção do câncer de pele." }
    ]
  },
  {
    id: "odonto-prime",
    name: "Odontologia Integrada & Implantes",
    sector: "Odontologia",
    tagline: "Sorrisos Saudáveis & Alinhadores Invisíveis",
    themeColor: "from-cyan-500/20 via-blue-500/10 to-zinc-950",
    accentColor: "cyan-500",
    bannerHeadline: "Transforme Seu Sorriso com Tecnologia Digital 3D",
    bannerSubheadline: "Scanner intraoral sem moldagem, implantes guiados por tomografia e ortodontia estética com alinhadores invisíveis.",
    services: [
      { title: "Alinhadores Invisíveis", desc: "Correção ortodôntica ágil, confortável e totalmente estética." },
      { title: "Implantes & Carga Imediata", desc: "Recuperação funcional e estética do sorriso no mesmo dia." },
      { title: "Clareamento a Laser & Lentes", desc: "Facetas cerâmicas ultra finas para um sorriso harmônico." }
    ]
  },
  {
    id: "pediatria-cuidar",
    name: "Pediatria & Puericultura Humanizada",
    sector: "Pediatria",
    tagline: "Acolhimento da Primeira Infância à Adolescência",
    themeColor: "from-amber-500/20 via-yellow-500/10 to-zinc-950",
    accentColor: "amber-500",
    bannerHeadline: "Cuidado Pediátrico Integrado com Amor e Rigor Técnico",
    bannerSubheadline: "Acompanhamento do desenvolvimento neuropsicomotor, calendário vacinal completo e pronto atendimento pediátrico acolhedor.",
    services: [
      { title: "Puericultura & Crescimento", desc: "Consultas regulares para prevenção e promoção da saúde infantil." },
      { title: "Imunização & Vacinas Especiais", desc: "Aplicação humanizada sem dor com óculos de realidade virtual." },
      { title: "Alergologia & Pneumologia", desc: "Tratamento especializado de asma, bronquiolite e dermatite atópica." }
    ]
  },
  {
    id: "clinica-geral",
    name: "Centro Médico & Especialidades Integradas",
    sector: "Clínica Geral",
    tagline: "Medicina Preventiva, Check-ups & Exames no Mesmo Local",
    themeColor: "from-emerald-500/20 via-teal-500/10 to-zinc-950",
    accentColor: "emerald-500",
    bannerHeadline: "Sua Saúde em Primeiro Lugar, Sem Filas e Com Agilidade",
    bannerSubheadline: "Mais de 25 especialidades médicas, exames laboratoriais e de imagem com laudos emitidos em até 2 horas por inteligência artificial.",
    services: [
      { title: "Check-up Executivo Completo", desc: "Bateria de exames preventivos em apenas uma manhã." },
      { title: "Cardiologia & Ecocardiograma", desc: "Avaliação do risco cardiovascular e monitoramento contínuo." },
      { title: "Consultas de Telemedicina 24h", desc: "Atendimento imediato direto pelo aplicativo com prontuário unificado." }
    ]
  },
  {
    id: "medvet-vital",
    name: "Hospital Veterinário & Cuidados 24h",
    sector: "MedVet",
    tagline: "Medicina Veterinária Especializada para Cães & Gatos",
    themeColor: "from-purple-500/20 via-violet-500/10 to-zinc-950",
    accentColor: "purple-500",
    bannerHeadline: "Medicina Veterinária com Carinho e Tecnologia Hospitalar",
    bannerSubheadline: "UTI veterinária com suporte ventilatório, centro cirúrgico com anestesia inalatória e laboratório de análises clínicas próprio.",
    services: [
      { title: "Pronto-Socorro Veterinário 24h", desc: "Equipe de plantonistas pronta para intercorrências de urgência." },
      { title: "Cirurgias & Anestesia Inalatória", desc: "Monitorização multiparamétrica de alta precisão." },
      { title: "Diagnóstico por Imagem & Raio-X", desc: "Ultrassonografia doppler e exames de sangue no mesmo dia." }
    ]
  }
];

export default function WebStudioPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("derma-premium");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"TEMPLATE" | "CONTEUDO" | "DOMINIO" | "TRACKING">("CONTEUDO");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Informações Editáveis do Site da Clínica
  const [siteConfig, setSiteConfig] = useState({
    clinicName: "Clínica Integrada Alpha & Saúde",
    tagline: "Medicina de Alta Precisão & Atendimento Humanizado",
    phoneWhatsapp: "(11) 98765-4321",
    address: "Av. Copacabana, 1000 - Edifício Medical Tower - Alphaville, Barueri - SP",
    customDomain: "clinicaalpha.com.br",
    cnameHost: "www",
    cnameTarget: "sites.medcore.com.br",
    googleAnalyticsId: "G-MEDCORE2026",
    metaPixelId: "84729104829104",
    floatingWhatsapp: true,
    onlineBookingEnabled: true
  });

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleSave = () => {
    setToastMessage("Site publicado com sucesso! Alterações propagadas em tempo real na CDN.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full pb-20">
      
      {/* Toast de Sucesso */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700 p-1">
            ✕
          </button>
        </div>
      )}

      {/* Action Bar Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-4 sm:px-6 py-4 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rd-cyan to-indigo-600 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-rd-cyan/20">
            <Globe size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                MedCore WebStudio
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30">
                No-Code Builder
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Criador do Site da Clínica com Domínio Próprio, Pixel e Agendamento Integrado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternador de Preview (Desktop / Mobile) */}
          <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-lg transition-colors ${previewDevice === "desktop" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}
              title="Visualização Computador"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg transition-colors ${previewDevice === "mobile" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"}`}
              title="Visualização Celular"
            >
              <Smartphone size={16} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 transition-all shadow-md shadow-rd-cyan/20 flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Save size={15} /> Publicar Site
          </button>
        </div>
      </div>

      {/* Grid: Editor No-Code à Esquerda (5 cols) & Live Preview à Direita (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Painel de Configurações (5 colunas) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          
          {/* Menu de Abas de Configuração */}
          <div className="grid grid-cols-4 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab("CONTEUDO")}
              className={`py-2 rounded-xl transition-all ${activeTab === "CONTEUDO" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
            >
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab("TEMPLATE")}
              className={`py-2 rounded-xl transition-all ${activeTab === "TEMPLATE" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
            >
              Modelos
            </button>
            <button
              onClick={() => setActiveTab("DOMINIO")}
              className={`py-2 rounded-xl transition-all ${activeTab === "DOMINIO" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
            >
              Domínio
            </button>
            <button
              onClick={() => setActiveTab("TRACKING")}
              className={`py-2 rounded-xl transition-all ${activeTab === "TRACKING" ? "bg-white dark:bg-zinc-900 text-rd-cyan shadow-sm" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"}`}
            >
              Tags / Pixels
            </button>
          </div>

          {/* ABA 1: CONTEÚDO PRINCIPAL */}
          {activeTab === "CONTEUDO" && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Nome da Clínica no Site *
                </label>
                <input
                  type="text"
                  value={siteConfig.clinicName}
                  onChange={e => setSiteConfig({ ...siteConfig, clinicName: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Slogan Institucional *
                </label>
                <input
                  type="text"
                  value={siteConfig.tagline}
                  onChange={e => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                    WhatsApp para Agendamento
                  </label>
                  <input
                    type="text"
                    value={siteConfig.phoneWhatsapp}
                    onChange={e => setSiteConfig({ ...siteConfig, phoneWhatsapp: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                    Agendamento Online
                  </label>
                  <div className="flex items-center h-10 px-3 bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium">
                      <input
                        type="checkbox"
                        checked={siteConfig.onlineBookingEnabled}
                        onChange={e => setSiteConfig({ ...siteConfig, onlineBookingEnabled: e.target.checked })}
                        className="rounded border-zinc-500 text-rd-cyan focus:ring-0"
                      />
                      <span>Botão Ativo no Topo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Endereço Físico Completo
                </label>
                <textarea
                  rows={2}
                  value={siteConfig.address}
                  onChange={e => setSiteConfig({ ...siteConfig, address: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none resize-none"
                />
              </div>

              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Botão Flutuante do WhatsApp</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Ativa o ícone fixo no canto inferior do site.</p>
                </div>
                <input
                  type="checkbox"
                  checked={siteConfig.floatingWhatsapp}
                  onChange={e => setSiteConfig({ ...siteConfig, floatingWhatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-rd-cyan focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ABA 2: TEMPLATES POR ESPECIALIDADE MÉDICA */}
          {activeTab === "TEMPLATE" && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Selecione o modelo especializado que melhor reflete o posicionamento da sua clínica:
              </p>
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {TEMPLATES.map(tmpl => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-rd-cyan/10 border-rd-cyan shadow-sm" 
                          : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{tmpl.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold">
                          {tmpl.sector}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{tmpl.tagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: DOMÍNIO PRÓPRIO & DNS CNAME */}
          {activeTab === "DOMINIO" && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Seu Domínio Personalizado (Registro.br / GoDaddy / Cloudflare)
                </label>
                <input
                  type="text"
                  placeholder="ex: clinicaalpha.com.br"
                  value={siteConfig.customDomain}
                  onChange={e => setSiteConfig({ ...siteConfig, customDomain: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                />
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center gap-2 text-rd-cyan font-bold text-xs">
                  <ShieldCheck size={16} />
                  <span>Configuração de Apontamento DNS (CNAME)</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Acesse o painel do seu registrador de domínio e crie a seguinte entrada DNS:
                </p>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase block font-sans">Tipo</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">CNAME</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase block font-sans">Entrada / Host</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{siteConfig.cnameHost}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-400 uppercase block font-sans">Destino / Valor</span>
                    <span className="font-bold text-rd-cyan">{siteConfig.cnameTarget}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 size={14} />
                  <span>Certificado SSL (HTTPS) gerado automaticamente e gratuito pela MedCore.</span>
                </div>
              </div>
            </div>
          )}

          {/* ABA 4: TRACKING & PIXELS DE ANÚNCIOS */}
          {activeTab === "TRACKING" && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  ID do Google Analytics 4 (GA4)
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={siteConfig.googleAnalyticsId}
                  onChange={e => setSiteConfig({ ...siteConfig, googleAnalyticsId: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Rastreia visualizações de página e conversões de agendamento.</span>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Pixel da Meta (Facebook / Instagram Ads)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 84729104829104"
                  value={siteConfig.metaPixelId}
                  onChange={e => setSiteConfig({ ...siteConfig, metaPixelId: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 font-mono text-zinc-900 dark:text-zinc-100 focus:border-rd-cyan outline-none"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Dispara evento "Lead" quando o paciente clica no WhatsApp ou agenda consulta.</span>
              </div>

              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 dark:text-zinc-400">
                Os scripts de rastreamento são injetados no cabeçalho sem degradar a pontuação de velocidade (Google PageSpeed 99+).
              </div>
            </div>
          )}

        </div>

        {/* Live Preview Responsivo (7 colunas) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-2 px-2 text-xs text-zinc-500">
            <span className="font-bold flex items-center gap-1.5">
              <Eye size={14} className="text-rd-cyan" /> Visualização em Tempo Real (Live Preview)
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              https://{siteConfig.customDomain || "suaclinica.medcore.com.br"}
            </span>
          </div>

          {/* Container do Browser Mockup */}
          <div className={`transition-all duration-300 w-full ${previewDevice === "mobile" ? "max-w-sm" : "max-w-full"}`}>
            <div className="bg-zinc-950 border-4 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              
              {/* Barra do Navegador */}
              <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-xs bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-center font-mono text-[10px] text-zinc-400 truncate">
                  🔒 https://{siteConfig.customDomain || "clinica.medcore.com.br"}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">100% SSL</span>
              </div>

              {/* CONTEÚDO DO SITE RENDERIZADO */}
              <div className="bg-zinc-950 text-zinc-100 min-h-[520px] max-h-[640px] overflow-y-auto font-sans relative">
                
                {/* Header do Site */}
                <header className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rd-cyan text-zinc-950 flex items-center justify-center font-black text-xs">
                      <HeartPulse size={16} />
                    </div>
                    <span className="font-bold text-xs text-white truncate max-w-[150px] sm:max-w-none">
                      {siteConfig.clinicName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {siteConfig.onlineBookingEnabled && (
                      <button className="px-3 py-1.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-[10px] uppercase tracking-wider hover:bg-rd-cyan/90 transition-all shadow-sm">
                        Agendar Consulta
                      </button>
                    )}
                  </div>
                </header>

                {/* Hero Banner do Site */}
                <section className={`p-6 sm:p-10 bg-gradient-to-b ${activeTemplate.themeColor} border-b border-zinc-800/60 text-center space-y-3 relative`}>
                  <span className="inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    {activeTemplate.sector}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                    {activeTemplate.bannerHeadline}
                  </h1>
                  <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                    {activeTemplate.bannerSubheadline}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button className="px-4 py-2 bg-rd-cyan text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-rd-cyan/20">
                      Conhecer Tratamentos
                    </button>
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-zinc-700">
                      Falar no WhatsApp
                    </button>
                  </div>
                </section>

                {/* Grid de Serviços Médicos */}
                <section className="p-6 sm:p-8 space-y-4">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-rd-cyan uppercase font-bold tracking-wider">Especialidades</span>
                    <h2 className="text-base font-bold text-white mt-0.5">Tratamentos de Excelência</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {activeTemplate.services.map((srv, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5 text-left">
                        <div className="w-7 h-7 rounded-xl bg-rd-cyan/15 text-rd-cyan flex items-center justify-center">
                          <Check size={14} />
                        </div>
                        <h3 className="text-xs font-bold text-white">{srv.title}</h3>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{srv.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Localização & Contato */}
                <section className="p-6 bg-zinc-900/50 border-t border-zinc-800/80 text-xs text-zinc-400 space-y-2 text-center">
                  <p className="font-bold text-white">{siteConfig.clinicName}</p>
                  <p className="flex items-center justify-center gap-1.5 text-[11px]">
                    <MapPin size={12} className="text-rd-cyan shrink-0" />
                    <span>{siteConfig.address}</span>
                  </p>
                  <p className="flex items-center justify-center gap-1.5 text-[11px]">
                    <Phone size={12} className="text-rd-cyan shrink-0" />
                    <span>{siteConfig.phoneWhatsapp}</span>
                  </p>
                </section>

                {/* Botão Flutuante do WhatsApp */}
                {siteConfig.floatingWhatsapp && (
                  <div className="absolute bottom-4 right-4 z-40">
                    <div className="w-11 h-11 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 cursor-pointer animate-bounce hover:scale-110 transition-transform">
                      <MessageSquare size={20} />
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
