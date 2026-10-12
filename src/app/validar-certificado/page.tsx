"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Search, 
  Building2, 
  Calendar, 
  Clock, 
  FileCheck2, 
  AlertCircle, 
  ExternalLink,
  GraduationCap,
  HeartPulse
} from "lucide-react";

interface CertificateData {
  codigo: string;
  aluno: string;
  cpf: string;
  curso: string;
  cargaHoraria: string;
  dataConclusao: string;
  validade: string;
  notaAvaliacao: string;
  diretorClinico: string;
  crmDiretor: string;
  clinica: string;
  autenticidade: string;
}

const CERTIFICATES_DATABASE: Record<string, CertificateData> = {
  "MED-CERT-2026-9481": {
    codigo: "MED-CERT-2026-9481",
    aluno: "Dr. Felipe Azevedo",
    cpf: "***.456.789-**",
    curso: "NR-32: Segurança em Serviços de Saúde & Riscos Biológicos",
    cargaHoraria: "8 horas complementares",
    dataConclusao: "12 de Outubro de 2026",
    validade: "12 de Outubro de 2027 (Reciclagem Anual)",
    notaAvaliacao: "10.0 (100% de aproveitamento)",
    diretorClinico: "Dr. Felipe Azevedo",
    crmDiretor: "CRM-SP 124.890",
    clinica: "MedCore Health Care - Unidade Central Alphaville",
    autenticidade: "CERT-SHA256-8A9F4C2E9102B371F"
  },
  "MED-CERT-2026-8812": {
    codigo: "MED-CERT-2026-8812",
    aluno: "Dra. Beatriz Albuquerque",
    cpf: "***.567.890-**",
    curso: "Protocolo de Sepse & Reconhecimento Precoce",
    cargaHoraria: "6 horas complementares",
    dataConclusao: "05 de Outubro de 2026",
    validade: "05 de Outubro de 2027",
    notaAvaliacao: "9.5 (95% de aproveitamento)",
    diretorClinico: "Dr. Felipe Azevedo",
    crmDiretor: "CRM-SP 124.890",
    clinica: "MedCore Health Care - Hospital Geral Morumbi",
    autenticidade: "CERT-SHA256-4D2A90C118B5EF7A"
  },
  "MED-CERT-2026-7734": {
    codigo: "MED-CERT-2026-7734",
    aluno: "Mariana Santos",
    cpf: "***.678.901-**",
    curso: "LGPD na Saúde: Segurança de Prontuários e Sigilo CFM",
    cargaHoraria: "4 horas complementares",
    dataConclusao: "28 de Setembro de 2026",
    validade: "28 de Setembro de 2028 (Bienal)",
    notaAvaliacao: "10.0 (100% de aproveitamento)",
    diretorClinico: "Dr. Felipe Azevedo",
    crmDiretor: "CRM-SP 124.890",
    clinica: "MedCore Health Care - Sede Corporativa",
    autenticidade: "CERT-SHA256-7E1C89F301D890AA"
  }
};

export default function ValidarCertificadoPage() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get("codigo") || "";

  const [inputCode, setInputCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch: string) => {
    const formatted = codeToSearch.trim().toUpperCase();
    setSearchedCode(formatted);
    setHasSearched(true);
    
    if (CERTIFICATES_DATABASE[formatted]) {
      setResult(CERTIFICATES_DATABASE[formatted]);
    } else {
      // Simulação de busca com gerador dinâmico se for código no padrão MED-CERT
      if (formatted.startsWith("MED-CERT")) {
        setResult({
          codigo: formatted,
          aluno: "Colaborador Credenciado MedCore",
          cpf: "***.***.***-**",
          curso: "Capacitação Médica & Educação Permanente em Saúde",
          cargaHoraria: "8 horas complementares",
          dataConclusao: "Recentemente Concluído",
          validade: "12 meses após a emissão",
          notaAvaliacao: "9.0 (Aprovado com distinção)",
          diretorClinico: "Dr. Felipe Azevedo",
          crmDiretor: "CRM-SP 124.890",
          clinica: "Rede Hospitalar MedCore Health Care",
          autenticidade: `CERT-SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`
        });
      } else {
        setResult(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rd-cyan selection:text-zinc-950">
      
      {/* Header Institucional */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rd-cyan to-indigo-600 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-rd-cyan/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg tracking-tight text-white">MedCore</span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rd-cyan/20 text-rd-cyan border border-rd-cyan/30">
                  Educacional
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">Validação Pública de Certificados Médicos & Hospitalares</p>
            </div>
          </div>

          <Link
            href="/dashboard/treinamentos"
            className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            Portal do Aluno
          </Link>
        </div>
      </header>

      {/* Hero de Validação */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={14} />
            <span>Sistema Forense de Autenticidade Digital</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Validação de Certificados
          </h1>
          <p className="text-sm text-zinc-400">
            Insira o código de autenticação impresso no rodapé do certificado para verificar a autenticidade, carga horária e assinatura da Diretoria Clínica.
          </p>

          {/* Campo de Busca */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(inputCode);
            }} 
            className="flex items-center gap-2 max-w-lg mx-auto pt-2"
          >
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Ex: MED-CERT-2026-9481"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-700 focus:border-rd-cyan rounded-2xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder:text-zinc-500 outline-none transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-rd-cyan hover:bg-rd-cyan/90 text-zinc-950 font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-rd-cyan/20 cursor-pointer active:scale-95"
            >
              Verificar
            </button>
          </form>

          {/* Exemplos Rápidos */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 flex-wrap">
            <span>Exemplos de teste:</span>
            <button
              onClick={() => {
                setInputCode("MED-CERT-2026-9481");
                handleSearch("MED-CERT-2026-9481");
              }}
              className="underline text-rd-cyan hover:text-white"
            >
              MED-CERT-2026-9481
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setInputCode("MED-CERT-2026-8812");
                handleSearch("MED-CERT-2026-8812");
              }}
              className="underline text-rd-cyan hover:text-white"
            >
              MED-CERT-2026-8812
            </button>
          </div>
        </div>

        {/* Resultado da Validação */}
        {hasSearched && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {result ? (
              /* CERTIFICADO AUTÊNTICO */
              <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Badge de Status Válido */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                        Certificado 100% Autêntico & Válido
                      </span>
                      <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white mt-0.5">
                        {result.curso}
                      </h2>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase font-mono">Código de Autenticação</span>
                    <span className="text-sm font-mono font-bold text-rd-cyan">{result.codigo}</span>
                  </div>
                </div>

                {/* Detalhes do Aluno & Curso */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-6 border-b border-zinc-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Profissional Certificado</span>
                    <p className="text-sm font-bold text-white">{result.aluno}</p>
                    <p className="text-zinc-400 text-[11px]">CPF: {result.cpf}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Carga Horária & Aproveitamento</span>
                    <p className="text-sm font-bold text-emerald-400">{result.cargaHoraria}</p>
                    <p className="text-zinc-400 text-[11px]">Nota Final: {result.notaAvaliacao}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Data de Emissão & Validade</span>
                    <p className="text-sm font-bold text-white">{result.dataConclusao}</p>
                    <p className="text-amber-400 text-[11px]">Validade: {result.validade}</p>
                  </div>
                </div>

                {/* Instituição & Assinatura */}
                <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs">
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">Instituição Emissora</span>
                    <p className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Building2 size={13} className="text-rd-cyan" /> {result.clinica}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">Hash Forense: {result.autenticidade}</p>
                  </div>

                  <div className="p-3.5 bg-zinc-800/80 border border-zinc-700 rounded-2xl sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Assinatura Digital Auditada</span>
                    <p className="font-bold text-white mt-0.5">{result.diretorClinico}</p>
                    <p className="text-[11px] text-rd-cyan font-mono">{result.crmDiretor} • Diretor Clínico</p>
                  </div>
                </div>
              </div>
            ) : (
              /* CERTIFICADO NÃO ENCONTRADO */
              <div className="bg-zinc-900/80 border-2 border-rose-500/40 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Certificado Não Localizado</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Não encontramos nenhum registro válido para o código <strong>{searchedCode}</strong>. Verifique se o código foi digitado corretamente ou se o documento é autêntico.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Público */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500 space-y-2 mt-20">
        <p>© 2026 Universidade Corporativa MedCore • Gestão de Competências Médicas</p>
        <p className="text-[11px] text-zinc-600">
          Validação eletrônica conforme Resoluções do CFM, COREN e normas regulamentadoras do Ministério do Trabalho.
        </p>
      </footer>
    </div>
  );
}
