"use client";

import React, { useState } from "react";
import { 
  Megaphone, Target, Sparkles, TrendingUp, Users, DollarSign, 
  Layers, Video, Image as ImageIcon, Send, Copy, Check, ExternalLink, 
  CheckCircle2, RefreshCw, BarChart3, HelpCircle, Eye, Sliders, Smartphone
} from "lucide-react";
import Link from "next/link";

interface CampanhaPatrocinada {
  id: string;
  nome: string;
  objetivo: string;
  nicho: string;
  orcamentoSugeridoDiario: string;
  publicoAlvo: {
    idade: string;
    genero: string;
    raioKm: string;
    interesses: string[];
    comportamentos: string[];
  };
  conjuntoAnuncios: {
    nome: string;
    posicionamentos: string[];
    otimizacao: string;
  };
  anuncios: {
    formato: "FEED_ESTATICO" | "REELS_VIDEO" | "STATUS_WHATSAPP";
    headline: string;
    textoPrincipal: string;
    cta: string;
    roteiroVideoSegundoASegundo?: string[];
  }[];
}

const CAMPANHAS_PREDEFINIDAS: CampanhaPatrocinada[] = [
  {
    id: "camp-1",
    nome: "Conversão Direta WhatsApp: Dra. Conte 24/7 (Alta Renda)",
    objetivo: "Mensagens no WhatsApp (Engajamento / Leads)",
    nicho: "Clínicas Médicas & Consultórios Privados",
    orcamentoSugeridoDiario: "R$ 45,00 / dia (CBO Otimizado)",
    publicoAlvo: {
      idade: "28 a 58 anos",
      genero: "Todos (Homens e Mulheres)",
      raioKm: "Raio de 5 a 12 km da clínica",
      interesses: ["Saúde e bem-estar", "Medicina preventiva", "Dermatologia", "Cirurgia plástica", "Planos de saúde premium"],
      comportamentos: ["Usuários de dispositivos móveis iOS/Android recentes", "Interesse em consultas particulares"]
    },
    conjuntoAnuncios: {
      nome: "CJ01 - Aberto Local Georreferenciado + Interesses Clínicos",
      posicionamentos: ["Feed do Instagram", "Instagram Stories & Reels", "Feed do Facebook"],
      otimizacao: "Conversas Iniciadas no WhatsApp"
    },
    anuncios: [
      {
        formato: "REELS_VIDEO",
        headline: "Agenda lotada sem recepcionista sobrecarregada",
        textoPrincipal: "Sua clínica ainda perde agendamentos quando o paciente manda mensagem à noite ou no fim de semana? Conheça o MedCore com a assistente autônoma Dra. Conte: responde na hora, agenda direto no prontuário e reduz faltas em até 40%. Toque em 'Enviar Mensagem' e veja uma demonstração ao vivo agora.",
        cta: "Enviar Mensagem no WhatsApp",
        roteiroVideoSegundoASegundo: [
          "00:00 - 00:03: [Gancho Visual] Você sabia que 42% dos pacientes desistem de agendar uma consulta médica porque a clínica demora mais de 15 minutos para responder no WhatsApp?",
          "00:03 - 00:08: [Problema] Recepcionista atende telefone, faz cadastro, cobra paciente no balcão... e as mensagens do WhatsApp vão acumulando.",
          "00:08 - 00:15: [Solução] Com o MedCore e a Dra. Conte IA, seu WhatsApp atende 24h por dia, tira dúvidas e agenda consultas automaticamente sem erros.",
          "00:15 - 00:20: [Chamada para Ação] Clique no botão abaixo e teste a IA da Dra. Conte no seu WhatsApp agora mesmo!"
        ]
      },
      {
        formato: "FEED_ESTATICO",
        headline: "Sua Clínica no Nível Máximo de Eficiência",
        textoPrincipal: "Chega de glosas no faturamento de convênios e horários vazios na agenda. O MedCore integra prontuário eletrônico rápido, inteligência artificial no WhatsApp e gestão financeira completa. Experimente na sua clínica.",
        cta: "Falar com Especialista"
      },
      {
        formato: "STATUS_WHATSAPP",
        headline: "Agendamento Inteligente em 40 Segundos",
        textoPrincipal: "Agende sua consulta ou procedimento direto por aqui com nossa assistente virtual 24h. Rápido, seguro e sem espera.",
        cta: "Chamar no WhatsApp"
      }
    ]
  },
  {
    id: "camp-2",
    nome: "Estética & Harmonização Facial (Pacotes Particulares)",
    objetivo: "Cadastros & Mensagens WhatsApp",
    nicho: "Dermatologia & Estética Avançada",
    orcamentoSugeridoDiario: "R$ 60,00 / dia",
    publicoAlvo: {
      idade: "25 a 54 anos",
      genero: "Feminino (85%) / Masculino (15%)",
      raioKm: "Raio de 7 km da clínica",
      interesses: ["Harmonização facial", "Botox", "Bioestimuladores de colágeno", "Skincare", "Estética médica"],
      comportamentos: ["Compradores envolvidos", "Interesse em tratamentos estéticos premium"]
    },
    conjuntoAnuncios: {
      nome: "CJ02 - Mulheres 25-54 Interesses Estética & Beleza",
      posicionamentos: ["Instagram Reels", "Instagram Stories", "Instagram Feed"],
      otimizacao: "Mensagens WhatsApp"
    },
    anuncios: [
      {
        formato: "REELS_VIDEO",
        headline: "Avaliação Facial Personalizada com Simulação 3D",
        textoPrincipal: "Realce sua beleza natural com protocolos exclusivos e acompanhamento médico especializado. Clique em Enviar Mensagem para agendar sua avaliação facial.",
        cta: "Agendar Avaliação no WhatsApp",
        roteiroVideoSegundoASegundo: [
          "00:00 - 00:03: [Gancho Visual] Mostre close na aplicação delicada ou foto comparativa de antes/depois no prontuário.",
          "00:03 - 00:08: [Texto na Tela] 'Menos é mais: harmonização com naturalidade e segurança médica.'",
          "00:08 - 00:15: [Depoimento do Médico] Explicando que cada rosto recebe um planejamento exclusivo por imagem digital.",
          "00:15 - 00:20: [CTA] 'Poucas vagas disponíveis para este mês. Toque no botão e fale com nossa equipe médica.'"
        ]
      },
      {
        formato: "FEED_ESTATICO",
        headline: "Protocolos Exclusivos de Rejuvenescimento",
        textoPrincipal: "Cuide da saúde da sua pele com quem entende. Atendimento com pontualidade e excelência médica. Condições especiais para novos agendamentos.",
        cta: "Enviar Mensagem"
      }
    ]
  }
];

export default function PatrocinadosPage() {
  const [campanhas, setCampanhas] = useState<CampanhaPatrocinada[]>(CAMPANHAS_PREDEFINIDAS);
  const [selectedCampId, setSelectedCampId] = useState<string>(CAMPANHAS_PREDEFINIDAS[0].id);
  const [formatoAtivo, setFormatoAtivo] = useState<"FEED_ESTATICO" | "REELS_VIDEO" | "STATUS_WHATSAPP">("REELS_VIDEO");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Meta Graph API Integration State
  const [metaPixelId, setMetaPixelId] = useState("18920491829401");
  const [metaAdAccountId, setMetaAdAccountId] = useState("act_849204910294");
  const [metaConnected, setMetaConnected] = useState(true);

  const selectedCamp = campanhas.find(c => c.id === selectedCampId) || campanhas[0];
  const selectedAnuncio = selectedCamp.anuncios.find(a => a.formato === formatoAtivo) || selectedCamp.anuncios[0];

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* Header com Badge de Tráfego Pago */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <Megaphone size={13} className="text-blue-400 animate-pulse" /> META ADS • ANÚNCIOS PATROCINADOS & TRÁFEGO PAGO
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Hub de Tráfego Pago & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Peças Prontas de Alta Conversão</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Tudo o que sua clínica precisa para rodar anúncios no Instagram, Facebook e WhatsApp: objetivo de campanha, segmentação detalhada de público, conjuntos, roteiros em vídeo e integração com a <strong>Meta Graph API</strong>.
          </p>
        </div>

        {/* Status da Integração Meta */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <BarChart3 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-zinc-900 dark:text-white">Meta Graph API Conectada</p>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Conta: {metaAdAccountId}</p>
          </div>
        </div>
      </div>

      {/* Seleção de Campanha Pronta */}
      <div className="flex flex-wrap items-center gap-3">
        {campanhas.map((camp) => (
          <button
            key={camp.id}
            type="button"
            onClick={() => setSelectedCampId(camp.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
              selectedCampId === camp.id
                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-blue-500"
            }`}
          >
            <Target size={14} />
            <span>{camp.nome}</span>
          </button>
        ))}
      </div>

      {/* Grid Principal: Estrutura da Campanha vs Prévia do Anúncio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna da Esquerda: Configuração Completa do Patrocinado (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Nível 1: Campanha */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Layers size={14} /> Nível 1: Estrutura da Campanha
              </span>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Otimizado para WhatsApp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Objetivo</span>
                <p className="font-bold text-zinc-900 dark:text-white">{selectedCamp.objetivo}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Orçamento Diário Sugerido</span>
                <p className="font-bold text-emerald-500">{selectedCamp.orcamentoSugeridoDiario}</p>
              </div>
            </div>
          </div>

          {/* Nível 2: Conjunto de Anúncios & Segmentação de Público */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Users size={14} /> Nível 2: Conjunto de Anúncios & Segmentação de Público
              </span>
              <button
                type="button"
                onClick={() => copyText(JSON.stringify(selectedCamp.publicoAlvo, null, 2), "publico")}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold"
              >
                {copiedKey === "publico" ? <Check size={12} /> : <Copy size={12} />}
                {copiedKey === "publico" ? "Copiado!" : "Copiar Parâmetros"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Faixa Etária</span>
                <p className="font-bold text-zinc-900 dark:text-white">{selectedCamp.publicoAlvo.idade}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Gênero</span>
                <p className="font-bold text-zinc-900 dark:text-white">{selectedCamp.publicoAlvo.genero}</p>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Raio Geográfico</span>
                <p className="font-bold text-zinc-900 dark:text-white">{selectedCamp.publicoAlvo.raioKm}</p>
              </div>
            </div>

            {/* Interesses & Comportamentos */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Interesses Detalhados no Gerenciador de Anúncios da Meta:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCamp.publicoAlvo.interesses.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                    🎯 {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Posicionamentos */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Posicionamentos Recomendados:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{selectedCamp.conjuntoAnuncios.posicionamentos.join(" • ")}</span>
            </div>
          </div>

          {/* Nível 3: Peça Pronta & Anúncio (Criativo) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Nível 3: Criativo & Peça Pronta (Copy + Roteiro)
              </span>

              {/* Seletor de Formato */}
              <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormatoAtivo("REELS_VIDEO")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    formatoAtivo === "REELS_VIDEO" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Video size={12} /> Vídeo Reels (9:16)
                </button>
                <button
                  type="button"
                  onClick={() => setFormatoAtivo("FEED_ESTATICO")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    formatoAtivo === "FEED_ESTATICO" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ImageIcon size={12} /> Feed (1:1)
                </button>
              </div>
            </div>

            {/* Headline e Texto Principal */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Título / Headline do Anúncio</label>
                  <button
                    type="button"
                    onClick={() => copyText(selectedAnuncio.headline, "headline")}
                    className="text-[10px] text-blue-400 font-bold hover:underline"
                  >
                    {copiedKey === "headline" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <input 
                  readOnly 
                  value={selectedAnuncio.headline}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Texto Principal (Legenda do Anúncio)</label>
                  <button
                    type="button"
                    onClick={() => copyText(selectedAnuncio.textoPrincipal, "texto")}
                    className="text-[10px] text-blue-400 font-bold hover:underline"
                  >
                    {copiedKey === "texto" ? "Copiado!" : "Copiar Legenda"}
                  </button>
                </div>
                <textarea 
                  readOnly 
                  rows={3}
                  value={selectedAnuncio.textoPrincipal}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-3 text-xs text-zinc-900 dark:text-white leading-relaxed"
                />
              </div>

              {/* Roteiro Segundo a Segundo (se for vídeo) */}
              {selectedAnuncio.roteiroVideoSegundoASegundo && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Video size={12} /> Roteiro Segundo a Segundo para o Médico Gravar:
                  </span>
                  <div className="space-y-2">
                    {selectedAnuncio.roteiroVideoSegundoASegundo.map((seg, i) => (
                      <p key={i} className="text-xs text-zinc-300 leading-relaxed">
                        {seg}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Coluna da Direita: Mockup Visual de Prévia do Anúncio no Instagram / WhatsApp (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl space-y-4 max-w-sm mx-auto">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                    <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-[10px] font-bold">
                      MC
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold leading-none">MedCore Clínica</h5>
                    <span className="text-[9px] text-zinc-400">Patrocinado • Meta Ads</span>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Prévia</span>
              </div>

              {/* Área Visual do Anúncio */}
              <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border border-zinc-800 flex flex-col justify-between p-5 relative overflow-hidden">
                <div className="space-y-2 relative z-10">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                    IA Dra. Conte 24/7
                  </span>
                  <h4 className="text-lg font-black leading-tight text-white">
                    {selectedAnuncio.headline}
                  </h4>
                </div>

                <div className="p-3.5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 space-y-2 relative z-10">
                  <p className="text-[11px] text-zinc-200 line-clamp-3">
                    {selectedAnuncio.textoPrincipal}
                  </p>
                  <div className="w-full py-2 bg-emerald-600 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
                    <Send size={12} /> {selectedAnuncio.cta}
                  </div>
                </div>
              </div>

              {/* Botão de Disparo / Sincronização via Meta API */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => alert("🚀 Estrutura de campanha pronta! Dados preparados para subida direta via Meta Business API com o Pixel ativo.")}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
                >
                  <Sparkles size={14} /> Subir Campanha na Meta Ads
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
