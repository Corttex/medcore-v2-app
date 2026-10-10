"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, User, FileText, Phone, Mail, Calendar, Edit, Trash2, X, CheckCircle2, ShieldCheck, Stethoscope } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import Link from "next/link";

export default function PacientesPage() {
  const { selectedUnitId } = useDashboardContext();
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    email: "",
    convenioId: ""
  });

  useEffect(() => {
    fetchData();
  }, [selectedUnitId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/pacientes", window.location.origin);
      if (selectedUnitId) url.searchParams.set("unitId", selectedUnitId);
      
      const pRes = await fetch(url.toString());
      if (pRes.ok) setPacientes(await pRes.json());
      
      const cRes = await fetch("/api/convenios");
      if (cRes.ok) setConvenios((await cRes.json()).convenios || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSaving(true);
    
    try {
      const body = { ...form, unitId: selectedUnitId };
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setFormError(data.error || "Erro ao salvar paciente.");
      } else {
        setFormSuccess("Paciente salvo com sucesso!");
        setTimeout(() => {
          setShowModal(false);
          fetchData();
          setForm({ nome: "", cpf: "", dataNascimento: "", telefone: "", email: "", convenioId: "" });
        }, 1500);
      }
    } catch (e) {
      setFormError("Erro de comunicação com o servidor.");
    }
    setSaving(false);
  };

  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(search.toLowerCase()) || 
    (p.cpf && p.cpf.includes(search))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-2xl shadow-sm">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Cadastre, edite e acompanhe os pacientes e prontuários da clínica.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 w-64 font-medium transition-all"
            />
          </div>
          <button
            onClick={() => { setFormSuccess(""); setFormError(""); setShowModal(true); }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Novo Paciente
          </button>
        </div>
      </div>

      {/* Tabela de Pacientes com Alto Contraste */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Paciente</th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Contato</th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Convênio</th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data Cadastro</th>
                <th className="p-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">Carregando pacientes...</td>
                </tr>
              ) : filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs">Nenhum paciente encontrado.</td>
                </tr>
              ) : (
                filteredPacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {p.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">{p.nome}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                            <FileText size={12}/> CPF: {p.cpf || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                          <Phone size={13} className="text-zinc-400" /> {p.telefone || '-'}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <Mail size={13} className="text-zinc-400" /> {p.email || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                        {p.convenio?.nome || 'Particular'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                        <Calendar size={13} className="text-zinc-400" /> 
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/prontuario/${p.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 text-xs font-semibold transition-colors border border-zinc-200 dark:border-zinc-700"
                        title="Abrir Prontuário"
                      >
                        <Stethoscope size={13} /> PEP
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Paciente (Compatível com Light & Dark Mode) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-zinc-900 dark:text-white">Cadastrar Paciente</h2>
                  <p className="text-xs text-zinc-500">Adicione uma ficha completa à base de dados.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="sm:col-span-2">
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Nome Completo *</label>
                   <input 
                     required 
                     type="text" 
                     value={form.nome} 
                     onChange={e => setForm({...form, nome: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                     placeholder="Ex: Maria da Silva Santos"
                   />
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">CPF</label>
                   <input 
                     type="text" 
                     value={form.cpf} 
                     onChange={e => setForm({...form, cpf: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                     placeholder="000.000.000-00"
                   />
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Data de Nascimento</label>
                   <input 
                     type="date" 
                     value={form.dataNascimento} 
                     onChange={e => setForm({...form, dataNascimento: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                   />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Telefone / WhatsApp</label>
                   <input 
                     type="tel" 
                     value={form.telefone} 
                     onChange={e => setForm({...form, telefone: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                     placeholder="(00) 90000-0000"
                   />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Email</label>
                   <input 
                     type="email" 
                     value={form.email} 
                     onChange={e => setForm({...form, email: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                     placeholder="paciente@exemplo.com"
                   />
                 </div>

                 <div className="sm:col-span-2">
                   <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Convênio Padrão</label>
                   <select 
                     value={form.convenioId} 
                     onChange={e => setForm({...form, convenioId: e.target.value})} 
                     className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   >
                     <option value="" className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">Particular (Sem Convênio)</option>
                     {convenios.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">{c.nome}</option>)}
                   </select>
                 </div>
               </div>

               {formError && <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold pt-1">{formError}</p>}
               {formSuccess && <p className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold pt-1 flex items-center gap-1"><CheckCircle2 size={14}/> {formSuccess}</p>}

               <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                 <button 
                   type="button" 
                   onClick={() => setShowModal(false)} 
                   className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   disabled={saving} 
                   className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                   {saving ? "Salvando..." : "Salvar Paciente"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
