"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Terminal, 
  Globe, 
  Lock, 
  Play,
  Zap,
  Check,
  Search,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthRequest {
  id: string;
  pacienteNome: string;
  convenio: "Bradesco Saúde" | "Unimed" | "Amil" | "SulAmérica";
  carteirinha: string;
  procedimento: string;
  status: "aguardando_rpa" | "executando_playwright" | "resolvendo_captcha" | "autorizado" | "negado";
  authPassword?: string;
  captchaToken?: string;
  logs: string[];
}

export default function AutorizacoesRPAPage() {
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AuthRequest | null>(null);

  const [requests, setRequests] = useState<AuthRequest[]>([
    {
      id: "REQ-401",
      pacienteNome: "Mariana Silva",
      convenio: "Bradesco Saúde",
      carteirinha: "712.984.102.341.009",
      procedimento: "40101010 - Consulta Médica Geral",
      status: "aguardando_rpa",
      logs: [
        "[08:30:00] Pedido inserido na fila BullMQ.",
        "[08:30:01] Rotação de Proxy residencial (Claro IP: 187.54.21.90) associado.",
      ],
    },
    {
      id: "REQ-402",
      pacienteNome: "Roberto Santos",
      convenio: "Bradesco Saúde",
      carteirinha: "712.551.982.112.001",
      procedimento: "40808033 - Ressonância Magnética com Contraste",
      status: "autorizado",
      authPassword: "AUT-BRAD-9821449-OK",
      captchaToken: "2CAP_0x449182bf9012a",
      logs: [
        "[08:25:10] Headless Chromium iniciado via Playwright Stealth.",
        "[08:25:12] Login efetuado com credenciais seguras da clínica.",
        "[08:25:15] Captcha hCaptcha detectado no portal Bradesco.",
        "[08:25:21] 2Captcha API resolveu token em 6.2s (Custo: R$ 0,005).",
        "[08:25:24] Guia SADT preenchida e submetida.",
        "[08:25:26] Senha de autorização capturada: AUT-BRAD-9821449-OK",
      ],
    },
    {
      id: "REQ-403",
      pacienteNome: "Ana Paula Costa",
      convenio: "Unimed",
      carteirinha: "0054.1298.4410.0091.2",
      procedimento: "40101010 - Consulta Dermatológica",
      status: "autorizado",
      authPassword: "UNI-AUT-550192",
      captchaToken: "2CAP_0x771239aa",
      logs: [
        "[08:20:00] Playwright acessou portal Unimed Central.",
        "[08:20:05] Elegibilidade confirmada com sucesso (Plano Ativo).",
        "[08:20:08] Senha gravada automaticamente na agenda do paciente.",
      ],
    },
  ]);

  const handleRunRPA = async (req: AuthRequest) => {
    setSelectedRequest(req);
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "executando_playwright" } : r))
    );

    try {
      const res = await fetch("/api/tiss/autorizacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convenio: req.convenio,
          carteirinha: req.carteirinha,
          codigoTUSS: req.procedimento.split(" - ")[0] || "40101010",
          pacienteNome: req.pacienteNome,
          procedimentoDesc: req.procedimento,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const data = json.data;
        setRequests((prev) =>
          prev.map((r) =>
            r.id === req.id
              ? {
                  ...r,
                  status: "autorizado",
                  authPassword: data.senhaAutorizacao,
                  captchaToken: "2CAP_VERIFIED_OK",
                  logs: data.logs || r.logs,
                }
              : r
          )
        );

        setSelectedRequest((prev) =>
          prev && prev.id === req.id
            ? {
                ...prev,
                status: "autorizado",
                authPassword: data.senhaAutorizacao,
                logs: data.logs || prev.logs,
              }
            : prev
        );

        alert(`🎉 RPA Concluído com Sucesso!\n\nSenha capturada no ${req.convenio}: ${data.senhaAutorizacao}\nTempo: ${data.tempoTotalSegundos}s • Proxy: ${data.proxyIpUsado}\nSalvo no prontuário e agenda.`);
      } else {
        throw new Error(json.error || "Falha na resposta do RPA");
      }
    } catch (err: any) {
      alert(`❌ Erro no RPA: ${err.message}`);
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "negado" } : r))
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Motor RPA */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <Bot className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Robô Autorizador RPA (Playwright Stealth + 2Captcha)</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                Hub Interno MedCore
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Simulação de navegador headless com bypass de captchas e proxies residenciais para captura instantânea de senhas de autorização.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
            Custo por Guia: <strong className="text-emerald-400 font-bold">~R$ 0,005</strong> <span className="text-zinc-600">(Economia de 98% vs Hubs)</span>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tempo Médio de Autorização</span>
          <p className="text-3xl font-black text-rd-cyan">6.8 seg</p>
          <p className="text-xs text-zinc-500">Playwright Headless</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bypass de Captcha (2Captcha)</span>
          <p className="text-3xl font-black text-emerald-400">99.4%</p>
          <p className="text-xs text-zinc-500">Resolução sem intervenção humana</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fila em Background (BullMQ)</span>
          <p className="text-3xl font-black text-white">0 pendentes</p>
          <p className="text-xs text-zinc-500">Redis Queue otimizada</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pool de Proxies Residenciais</span>
          <p className="text-3xl font-black text-purple-400">Ativo</p>
          <p className="text-xs text-zinc-500">Rotação de IP anti-bloqueio</p>
        </div>
      </div>

      {/* Fila de Pedidos e Terminal de Logs em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fila de Autorizações */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h4 className="font-bold text-base text-white">Fila de Guias para Autorização Instantânea</h4>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {requests.length} na fila
              </span>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-rd-cyan">{req.id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                        {req.convenio}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                          req.status === "autorizado"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : req.status === "aguardando_rpa"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20 animate-pulse"
                        )}
                      >
                        {req.status === "autorizado"
                          ? "Autorizado"
                          : req.status === "aguardando_rpa"
                          ? "Aguardando Disparo"
                          : "Robô Executando..."}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{req.pacienteNome}</h4>
                    <p className="text-xs text-zinc-400">
                      {req.procedimento} • Carteirinha: <span className="font-mono text-zinc-300">{req.carteirinha}</span>
                    </p>

                    {req.authPassword && (
                      <p className="text-xs text-emerald-400 font-bold pt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Senha Liberada: {req.authPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {req.status === "aguardando_rpa" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunRPA(req);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 transition-all shadow-md"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Disparar RPA
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal de Logs do Playwright */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs font-mono font-bold text-zinc-300">
            <Terminal className="h-4 w-4 text-rd-cyan" />
            <span>Playwright Live Execution Log</span>
          </div>

          <div className="bg-black/80 rounded-2xl p-4 font-mono text-[11px] text-zinc-300 space-y-2 h-[340px] overflow-y-auto border border-zinc-900">
            <p className="text-zinc-600">// Playwright Stealth + 2Captcha Solver Hook</p>
            {selectedRequest ? (
              selectedRequest.logs.map((log, i) => (
                <p key={i} className="text-emerald-400/90 leading-relaxed">
                  {log}
                </p>
              ))
            ) : (
              <p className="text-zinc-500 italic">
                Selecione um pedido ao lado ou clique em "Disparar RPA" para assistir ao robô navegando e quebrando captchas em tempo real.
              </p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Bypass Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Stealth Mode Ativo
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
