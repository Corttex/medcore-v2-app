"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  User, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Filter,
  Stethoscope
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

export default function ProntuarioIndexPage() {
  const { selectedUnitId } = useDashboardContext();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPacientes();
  }, [selectedUnitId]);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/pacientes", window.location.origin);
      if (selectedUnitId) url.searchParams.set("unitId", selectedUnitId);
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setPacientes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const pacientesFiltrados = pacientes.filter(p => {
    const term = searchTerm.toLowerCase();
    const nome = (p.nome || "").toLowerCase();
    const cpf = (p.cpf || "").toLowerCase();
    return nome.includes(term) || cpf.includes(term);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <FileText size={13} /> PEP • Prontuário Eletrônico do Paciente
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Prontuários Clínicos & IA Scribe
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Acesse o histórico clínico completo de pacientes com suporte a telemedicina, transcrição de consulta com IA e emissão de receitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            Total: {pacientes.length} Pacientes
          </span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar paciente por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
          <Sparkles size={14} className="text-blue-500" />
          <span>Equipado com Dra. Conte IA para transcrição médica</span>
        </div>
      </div>

      {/* Lista de Prontuários */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-zinc-500">Carregando prontuários...</p>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <User size={36} className="mx-auto text-zinc-400 mb-2" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Nenhum paciente encontrado</h3>
            <p className="text-xs text-zinc-500 mt-1">Verifique o termo pesquisado ou cadastre um novo paciente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientesFiltrados.map((paciente) => (
              <div 
                key={paciente.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {paciente.nome ? paciente.nome.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {paciente.nome}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {paciente.cpf ? `CPF: ${paciente.cpf}` : "CPF não informado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 py-3 border-y border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-300">Convênio:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{paciente.convenio?.nome || "Particular"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-300">Telefone:</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{paciente.telefone || "Não informado"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 dark:text-zinc-300">Status PEP:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        <Activity size={12} /> Ativo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <Link
                    href={`/dashboard/prontuario/${paciente.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope size={15} /> Abrir Prontuário Clínico <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
