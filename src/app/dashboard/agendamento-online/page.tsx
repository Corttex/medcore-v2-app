"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon, QrCode, Copy, ExternalLink, Settings, Users, CalendarCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export default function AgendamentoOnlineAdminPage() {
  const { theme } = useTheme();
  const { selectedUnitId, units } = useDashboardContext();
  const [copied, setCopied] = useState(false);
  const [portalUrl, setPortalUrl] = useState("");
  
  const [config, setConfig] = useState({
    whatsapp: true,
    strictSpecialty: false,
    antiSpam: true,
    ipMonitor: true,
  });

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownloadPDF = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(portalUrl)}`;
    const printWindow = window.open('', '', 'width=800,height=900');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Portal do Paciente</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #000; }
            h1 { font-size: 28px; margin-bottom: 5px; }
            h2 { font-size: 16px; color: #666; margin-bottom: 40px; font-weight: normal; }
            img { width: 400px; height: 400px; border: 1px solid #eee; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .link { margin-top: 30px; font-family: monospace; background: #f4f4f5; padding: 15px 20px; border-radius: 12px; font-size: 14px; color: #333; }
            .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; max-width: 400px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <h1>Portal de Agendamento Online</h1>
          <h2>Escaneie o QR Code abaixo com a câmera do seu celular</h2>
          <img src="${qrUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 500);" />
          <div class="link">${portalUrl}</div>
          <div class="footer">Este QR Code direciona para o portal seguro da unidade. Aponte a câmera para agendar.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const activeUnit = units.find(u => u.id === selectedUnitId) || units[0];

  useEffect(() => {
    // Generates the base URL (e.g. http://localhost:3000/agendar?unit=xyz)
    const baseUrl = window.location.origin;
    if (activeUnit) {
      setPortalUrl(`${baseUrl}/agendar?unit=${activeUnit.id}`);
    } else {
      setPortalUrl(`${baseUrl}/agendar`);
    }
  }, [activeUnit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      <div>
        <h1 className="text-2xl font-heading font-bold text-on-surface">Agendamento Online</h1>
        <p className="text-sm text-on-surface-variant mt-1">Configure o seu portal público para pacientes marcarem consultas 24h por dia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo - Compartilhamento e Link */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cn(
            "p-6 rounded-2xl border-2 shadow-sm transition-all relative overflow-hidden",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <LinkIcon size={120} />
            </div>
            
            <h2 className="text-lg font-heading font-bold text-on-surface mb-2 relative z-10">Link do Portal do Paciente</h2>
            <p className="text-sm text-on-surface-variant mb-6 relative z-10 max-w-xl">
              Compartilhe este link no seu Instagram, site ou WhatsApp. Os pacientes que acessarem verão apenas os médicos e horários disponíveis na unidade <strong>{activeUnit?.name || "Geral"}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
              <div className="flex-1 flex items-center bg-surface-container rounded-xl border border-outline-variant/50 px-4 py-3 overflow-hidden">
                <span className="text-sm font-mono text-on-surface truncate select-all">{portalUrl}</span>
              </div>
              <button 
                onClick={handleCopy}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-lg active:scale-[0.98] hover:scale-[1.02]",
                  copied 
                    ? "bg-emerald-600 text-white shadow-emerald-500/25" 
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-blue-500/25 hover:shadow-cyan-500/35"
                )}
              >
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {copied ? "Copiado!" : "Copiar Link"}
              </button>
              <a 
                href={portalUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-surface border border-outline-variant hover:bg-surface-container transition-all rounded-xl font-semibold text-sm text-on-surface whitespace-nowrap"
              >
                <ExternalLink size={18} />
                Acessar Portal
              </a>
            </div>
          </div>

          {/* Configurações Básicas */}
          <div className={cn(
            "p-6 rounded-2xl border-2 shadow-sm transition-all",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rd-cyan/15 flex items-center justify-center text-rd-cyan">
                <Settings size={20} />
              </div>
              <h2 className="text-lg font-heading font-bold text-on-surface">Configurações do Portal</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container/30 hover:border-rd-cyan/30 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface">Confirmação via WhatsApp</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Disparar mensagem automática quando o paciente agenda.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.whatsapp} onChange={() => toggleConfig('whatsapp')} />
                  <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container/30 hover:border-rd-cyan/30 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface">Filtro Rigoroso de Especialidade</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Obriga o paciente a escolher a especialidade antes de ver médicos.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.strictSpecialty} onChange={() => toggleConfig('strictSpecialty')} />
                  <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container/30 hover:border-rd-cyan/30 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface">Verificação de Segurança (Anti-Spam)</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Exige validação via QR Code e verificação facial (robôs).</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.antiSpam} onChange={() => toggleConfig('antiSpam')} />
                  <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-surface-container/30 hover:border-rd-cyan/30 transition-colors">
                <div>
                  <h4 className="font-semibold text-sm text-on-surface">Monitoramento de IP e Localização</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Registra IPs para fins jurídicos e bloqueia padrões suspeitos.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.ipMonitor} onChange={() => toggleConfig('ipMonitor')} />
                  <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - KPIs e QR Code */}
        <div className="space-y-6">
          
          <div className={cn(
            "p-6 rounded-2xl border-2 shadow-sm transition-all flex flex-col items-center text-center",
            theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <div className="w-40 h-40 bg-white p-2 rounded-2xl shadow-sm border border-zinc-200 mb-4 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={handleDownloadPDF} title="Clique para expandir/imprimir">
              {portalUrl ? (
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(portalUrl)}`} alt="QR Code Portal" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <QrCode size={120} className="text-zinc-900" />
              )}
            </div>
            <h3 className="font-bold text-sm text-on-surface">QR Code da Unidade</h3>
            <p className="text-xs text-on-surface-variant mt-2 mb-4">
              Imprima este QR Code e coloque no balcão da recepção.
            </p>
            <button onClick={handleDownloadPDF} className="w-full flex justify-center items-center gap-2 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors">
              <QrCode size={16} /> Baixar PDF
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-2xl border-2 shadow-sm text-center",
              theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <Users size={20} className="mx-auto text-rd-cyan mb-2" />
              <h4 className="text-2xl font-bold text-on-surface font-heading">0</h4>
              <p className="text-sm uppercase font-bold text-on-surface-variant tracking-wider">Acessos no Mês</p>
            </div>
            <div className={cn(
              "p-4 rounded-2xl border-2 shadow-sm text-center",
              theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <CalendarCheck size={20} className="mx-auto text-emerald-500 mb-2" />
              <h4 className="text-2xl font-bold text-on-surface font-heading">0</h4>
              <p className="text-sm uppercase font-bold text-on-surface-variant tracking-wider">Agendados</p>
            </div>
            <div className={cn(
              "col-span-2 p-4 rounded-2xl border-2 shadow-sm flex items-center justify-between",
              theme === 'dark' ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
            )}>
              <div>
                <p className="text-sm uppercase font-bold text-on-surface-variant tracking-wider">Conversão</p>
                <h4 className="text-xl font-bold text-on-surface font-heading">0.0%</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TrendingUp size={18} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
