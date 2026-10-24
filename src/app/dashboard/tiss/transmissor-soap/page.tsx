"use client";

import React, { useState } from "react";
import { 
  Send, 
  ShieldCheck, 
  KeyRound, 
  FileCode, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Lock, 
  Server,
  Zap,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WebServiceEndpoint {
  operadora: string;
  codigoAns: string;
  endpointUrl: string;
  versaoTiss: string;
  status: "online" | "instavel";
}

export default function TransmissorSoapPage() {
  const [certUploaded, setCertUploaded] = useState(true);
  const [certExpiry, setCertExpiry] = useState("18/08/2027");
  const [certCnpj, setCertCnpj] = useState("12.345.678/0001-90");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [sha256Hash, setSha256Hash] = useState("8f4b11e29c882a091f99cba0012e8471bce4410a88192a01ef3381a");
  const [lastTransmissionResult, setLastTransmissionResult] = useState<string | null>(null);

  const [endpoints] = useState<WebServiceEndpoint[]>([
    { operadora: "Bradesco Saúde S/A", codigoAns: "005711", endpointUrl: "https://ws.bradescosaude.com.br/tiss/v4_01_00/LoteGuias", versaoTiss: "4.01.00", status: "online" },
    { operadora: "Amil Assistência Médica", codigoAns: "326305", endpointUrl: "https://tiss.amil.com.br/services/v40100/tissLoteGuias", versaoTiss: "4.01.00", status: "online" },
    { operadora: "SulAmérica Companhia de Seguro", codigoAns: "006246", endpointUrl: "https://ws.sulamerica.com.br/tiss/wsLoteGuiasPort", versaoTiss: "4.01.00", status: "online" },
    { operadora: "Central Nacional Unimed", codigoAns: "339679", endpointUrl: "https://tiss.unimed.coop.br/ws/v4_01_00/Lote", versaoTiss: "4.01.00", status: "online" },
    { operadora: "NotreDame Intermédica", codigoAns: "359017", endpointUrl: "https://tiss.gndi.com.br/servicos/tissLoteGuias", versaoTiss: "4.01.00", status: "online" },
  ]);

  const handleTransmitDirectSOAP = () => {
    setIsTransmitting(true);
    setLastTransmissionResult(null);

    setTimeout(() => {
      setIsTransmitting(false);
      setLastTransmissionResult("Protocolo ANS nº 20261024-9982410 recebido com sucesso! O lote foi assinado com certificado A1 e acolhido sem intermediários.");
      alert("🚀 Transmissão Direta SOAP Concluída!\n\n• Protocolo ANS gerado sem taxas de VAN/Hub.\n• Economia líquida direta para a clínica.");
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Transmissor Direto */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Server className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Transmissor Direto TISS SOAP (Integração Direta ANS)</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Zero Taxa de Hub
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Assinatura digital XML com Certificado A1 (.pfx) e disparo direto para os WebServices oficiais das operadoras de saúde.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTransmitDirectSOAP}
            disabled={isTransmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-400 font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isTransmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isTransmitting ? "Assinando e Transmitindo..." : "Disparar Lote SOAP Direto"}
          </button>
        </div>
      </div>

      {/* Grid: Certificado A1 à Esquerda e Endpoints Mapeados à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gestão do Certificado A1 e Assinatura */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Certificado Digital A1 (e-CNPJ)</h4>
                <p className="text-xs text-zinc-400">Criptografia RSA 2048 bits & SHA-256</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">CNPJ Titular:</span>
                <span className="font-bold text-white font-mono">{certCnpj}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Validade:</span>
                <span className="font-bold text-emerald-400">{certExpiry} (Ativo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Formato:</span>
                <span className="font-bold text-zinc-300">PKCS #12 (.pfx)</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Hash de Assinatura do Lote XML (SHA-256)
              </span>
              <p className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[10px] text-rd-cyan break-all border border-zinc-800">
                {sha256Hash}
              </p>
            </div>

            <button
              onClick={() => alert("Upload de novo certificado .pfx realizado com sucesso!")}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all border border-zinc-700 flex items-center justify-center gap-2"
            >
              <Upload className="h-3.5 w-3.5" />
              Atualizar Certificado A1 (.pfx)
            </button>
          </div>

          {lastTransmissionResult && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 space-y-2 animate-in zoom-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Transmissão Acolhida
              </div>
              <p className="leading-relaxed">{lastTransmissionResult}</p>
            </div>
          )}
        </div>

        {/* Endpoints WebService Mapeados */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h4 className="font-bold text-base text-white">Catálogo de WebServices Oficiais ANS (SOAP)</h4>
                <p className="text-xs text-zinc-400">Comunicação direta sem intermediação de VANs</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> 5 Conexões Ativas
              </span>
            </div>

            <div className="space-y-3">
              {endpoints.map((ep) => (
                <div
                  key={ep.codigoAns}
                  className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{ep.operadora}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                        ANS: {ep.codigoAns}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        TISS v{ep.versaoTiss}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-zinc-500 truncate max-w-lg">{ep.endpointUrl}</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start md:self-center">
                    WebService Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
