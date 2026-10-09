"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Phone, Mail, MessageCircle, FileText, User, MapPin, Calendar, 
  CreditCard, CheckCircle2, AlertCircle, Plus, Settings, ExternalLink, 
  RefreshCw, Filter, ShieldCheck, Zap, ArrowUpRight, Send, X, Radio,
  Sparkles, Tag, Flame, Clock, Stethoscope, Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Convenio {
  id: string;
  nome: string;
}

interface Paciente {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  cpf: string | null;
  rg: string | null;
  sexo: string | null;
  endereco: string | null;
  dataNascimento: string | null;
  leadSource: string | null;
  providerId: string | null;
  convenioId: string | null;
  numeroCarteirinha: string | null;
  validadeCarteirinha: string | null;
  convenio?: Convenio;
  createdAt: string;
}

export default function InboxPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "whatsapp" | "incomplete">("all");

  const [formData, setFormData] = useState<Partial<Paciente>>({});
  const [successMsg, setSuccessMsg] = useState("");

  // Modais
  const [showConnectorsModal, setShowConnectorsModal] = useState(false);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  // Formulário Novo Lead Completo
  const [newLead, setNewLead] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    leadSource: "whatsapp",
    convenioId: "",
    procedimentoInteresse: "",
    prioridade: "ALTA",
    observacoes: ""
  });
  const [creatingLead, setCreatingLead] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resPac, resConv] = await Promise.all([
          fetch("/api/pacientes"),
          fetch("/api/convenios")
        ]);
        if (resPac.ok) {
          const pacs = await resPac.json();
          setPacientes(Array.isArray(pacs) ? pacs : []);
          if (Array.isArray(pacs) && pacs.length > 0 && !selectedId) {
            setSelectedId(pacs[0].id);
          }
        }
        if (resConv.ok) {
          const data = await resConv.json();
          setConvenios(data.convenios || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const selectedPaciente = pacientes.find(p => p.id === selectedId);

  useEffect(() => {
    if (selectedPaciente) {
      setFormData({ ...selectedPaciente });
      setSuccessMsg("");
    }
  }, [selectedPaciente]);

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/pacientes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updated = await res.json();
        setPacientes(prev => prev.map(p => p.id === updated.id ? updated : p));
        setSuccessMsg("Ficha atualizada com sucesso!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
    setSaving(false);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.nome.trim()) return;
    setCreatingLead(true);
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: newLead.nome,
          telefone: newLead.telefone,
          email: newLead.email,
          cpf: newLead.cpf || null,
          dataNascimento: newLead.dataNascimento || null,
          leadSource: newLead.leadSource,
          convenioId: newLead.convenioId || null,
        })
      });
      if (res.ok) {
        const created = await res.json();
        setPacientes(prev => [created, ...prev]);
        setSelectedId(created.id);
        setShowNewLeadModal(false);
        setNewLead({ 
          nome: "", 
          telefone: "", 
          email: "", 
          cpf: "",
          dataNascimento: "",
          sexo: "",
          leadSource: "whatsapp", 
          convenioId: "",
          procedimentoInteresse: "",
          prioridade: "ALTA",
          observacoes: ""
        });
      }
    } catch (error) {
      console.error("Erro ao criar lead:", error);
    }
    setCreatingLead(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filtragem da lista
  const filteredPacientes = pacientes.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase()) || 
                          (p.telefone && p.telefone.includes(search)) ||
                          (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
    
    if (filterSource === "whatsapp") return matchesSearch && p.leadSource === "whatsapp";
    if (filterSource === "incomplete") return matchesSearch && (!p.convenioId || !p.cpf);
    return matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Top Header Toolbar com Botão de Configuração de Conectores */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
             <MessageCircle size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-zinc-900 dark:text-white">Central de Mensagens & Qualificação de Leads</span>
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
              <Radio size={9} className="animate-pulse text-emerald-500" /> Online
            </span>
          </div>
        </div>

        {/* Botões de Ação do Topo (Sem bugs de cor preta no hover) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowConnectorsModal(true)}
            className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 hover:border-blue-500 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Settings size={15} />
            <span>Configurar Conectores</span>
          </button>

          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        
        {/* Sidebar de Leads/Chats (Sem fundo cinza escuro no hover!) */}
        <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm shrink-0">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, telefone ou e-mail..." 
                className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all font-medium placeholder:text-zinc-400"
              />
            </div>

            {/* Abas de Filtro Rápido */}
            <div className="flex gap-1.5 pt-0.5">
              <button
                onClick={() => setFilterSource("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  filterSource === "all" 
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                    : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                )}
              >
                Todos ({pacientes.length})
              </button>
              <button
                onClick={() => setFilterSource("whatsapp")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1",
                  filterSource === "whatsapp" 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                    : "bg-zinc-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border-zinc-200 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                )}
              >
                <MessageCircle size={12} /> WhatsApp
              </button>
              <button
                onClick={() => setFilterSource("incomplete")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1",
                  filterSource === "incomplete" 
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm" 
                    : "bg-zinc-50 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 border-zinc-200 dark:border-zinc-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                )}
              >
                Incompletos
              </button>
            </div>
          </div>

          {/* Lista de Leads com Hover de Alto Contraste */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-blue-scrollbar">
            {loading ? (
              <p className="text-center text-zinc-500 py-10 text-xs">Carregando contatos...</p>
            ) : filteredPacientes.length === 0 ? (
              <div className="text-center text-zinc-500 py-10 space-y-2">
                <AlertCircle size={28} className="mx-auto text-zinc-400" />
                <p className="text-xs">Nenhum contato encontrado.</p>
              </div>
            ) : (
              filteredPacientes.map(paciente => {
                const isSelected = selectedId === paciente.id;
                return (
                  <button 
                    key={paciente.id}
                    onClick={() => setSelectedId(paciente.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl transition-all border group cursor-pointer",
                      isSelected 
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-sm" 
                        : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80 hover:bg-blue-50/70 hover:border-blue-300 dark:hover:bg-zinc-800/70 dark:hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={cn(
                        "font-bold text-sm truncate leading-tight", 
                        isSelected ? "text-blue-700 dark:text-blue-300" : "text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      )}>
                        {paciente.nome}
                      </h3>
                      {paciente.leadSource === 'whatsapp' ? (
                        <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 shrink-0">
                          <MessageCircle size={10} /> WhatsApp
                        </span>
                      ) : (
                        <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800 shrink-0">
                          Direct
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {paciente.telefone || paciente.email || 'Sem contato registrado'}
                    </p>
                    {paciente.convenio?.nome ? (
                       <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1.5 font-medium flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                         Convênio: {paciente.convenio.nome}
                       </p>
                    ) : (
                       <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-semibold flex items-center gap-1">
                         <AlertCircle size={11}/> Ficha Incompleta
                       </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main Area - Perfil do Paciente & Ficha Clínica */}
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm relative">
          {!selectedPaciente ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-4 p-8 text-center">
               <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <MessageCircle size={32} />
               </div>
               <div className="space-y-1">
                 <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Nenhum Lead Selecionado</h2>
                 <p className="text-xs text-zinc-500 max-w-sm">Selecione um contato na lista ao lado ou cadastre um novo lead com dados completos.</p>
               </div>
               <button
                 onClick={() => setShowNewLeadModal(true)}
                 className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                 <Plus size={15} /> Cadastrar Novo Lead
               </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-blue-scrollbar">
              
              {/* Header do Lead com Ações Rápidas */}
              <div className="p-5 lg:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
                 <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                       {selectedPaciente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{selectedPaciente.nome}</h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                         <Phone size={13} className="text-blue-500" /> {selectedPaciente.telefone || "Sem telefone"}
                         {selectedPaciente.leadSource === 'whatsapp' && (
                           <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• Origem: WhatsApp Z-API</span>
                         )}
                      </p>
                    </div>
                 </div>
                 
                 {/* Barra de Ações Rápidas */}
                 <div className="flex items-center gap-2 shrink-0">
                   {selectedPaciente.telefone && (
                     <a
                       href={`https://wa.me/55${selectedPaciente.telefone.replace(/\D/g, "")}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                     >
                       <MessageCircle size={14} /> WhatsApp Direct
                     </a>
                   )}
                   {selectedPaciente.email && (
                     <a
                       href={`mailto:${selectedPaciente.email}`}
                       className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                     >
                       <Mail size={14} /> E-mail
                     </a>
                   )}
                   <Link
                     href="/dashboard/agenda"
                     className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                   >
                     <Calendar size={14} /> Agendar Consulta
                   </Link>
                 </div>
              </div>

              {/* Formulário de Ficha Clínica & CRM */}
              <div className="p-6 lg:p-8 max-w-4xl space-y-6">
                 
                 <section className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                   <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                     <User size={18} />
                     <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Dados Pessoais do Lead</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Nome Completo</label>
                        <input name="nome" value={formData.nome || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Data de Nascimento</label>
                        <input name="dataNascimento" type="date" value={formData.dataNascimento || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">CPF</label>
                        <input name="cpf" value={formData.cpf || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">RG</label>
                        <input name="rg" value={formData.rg || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">E-mail</label>
                        <input name="email" type="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Sexo</label>
                        <select name="sexo" value={formData.sexo || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
                          <option value="">Selecione...</option>
                          <option value="F">Feminino</option>
                          <option value="M">Masculino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block flex items-center gap-1"><MapPin size={13}/> Endereço Completo</label>
                        <input name="endereco" value={formData.endereco || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                      </div>
                   </div>
                 </section>

                 <section className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60">
                   <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                     <CreditCard size={18} />
                     <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Convênio & Faturamento TISS</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Convênio Vinculado</label>
                        <select name="convenioId" value={formData.convenioId || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all">
                          <option value="">Particular (Sem Convênio)</option>
                          {convenios.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Número da Carteirinha</label>
                        <input name="numeroCarteirinha" value={formData.numeroCarteirinha || ""} onChange={handleChange} placeholder="Ex: 0000.0000.0000.00" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 block">Validade</label>
                        <input name="validadeCarteirinha" type="month" value={formData.validadeCarteirinha || ""} onChange={handleChange} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" />
                      </div>
                   </div>
                 </section>

                 {/* Ações de Salvar Ficha */}
                 <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {successMsg && (
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={16} /> {successMsg}
                      </span>
                    )}
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {saving ? "Salvando..." : "Salvar Ficha do Paciente"}
                    </button>
                 </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Configurar Conectores Omnichannel (Cores corrigidas para Light e Dark) */}
      {showConnectorsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 lg:p-7 max-w-xl w-full space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowConnectorsModal(false)}
              className="absolute right-5 top-5 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center font-bold">
                <Settings size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Conectores Omnichannel Inbox</h3>
                <p className="text-xs text-zinc-500">Canais sincronizados para captação automática de leads</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">WhatsApp (Z-API)</p>
                    <p className="text-[11px] text-zinc-500">Instância ativa e sincronizada com CRM</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">ATIVO</span>
              </div>

              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">E-mail Corporativo (Resend)</p>
                    <p className="text-[11px] text-zinc-500">Recebimento e envio de notificações</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-200 dark:border-blue-800">ATIVO</span>
              </div>

              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">Captura Web Form & Webhook</p>
                    <p className="text-[11px] text-zinc-500">Leads capturados via portal do paciente e site</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">ATIVO</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowConnectorsModal(false)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all border border-zinc-200 dark:border-zinc-700"
              >
                Fechar
              </button>
              <Link
                href="/dashboard/configuracoes"
                onClick={() => setShowConnectorsModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Configurações do Sistema</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Criar Novo Lead Completo (Com todas as informações e sem erros de cor) */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleCreateLead} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 lg:p-7 max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-blue-scrollbar">
            
            {/* Botão de Fechar sem caixa preta */}
            <button 
              type="button"
              onClick={() => setShowNewLeadModal(false)}
              className="absolute right-5 top-5 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-bold">
                <Plus size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Cadastrar Novo Lead no CRM</h3>
                <p className="text-xs text-zinc-500">Adicione uma ficha completa de prospecção médica e qualificação.</p>
              </div>
            </div>

            {/* SEÇÃO 1: Dados Pessoais e Contato */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <User size={14} /> Informações de Contato
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Nome Completo *</label>
                <input 
                  required
                  value={newLead.nome}
                  onChange={(e) => setNewLead(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Telefone / WhatsApp *</label>
                  <input 
                    required
                    value={newLead.telefone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="Ex: (11) 99887-6655"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">E-mail</label>
                  <input 
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="exemplo@email.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">CPF</label>
                  <input 
                    value={newLead.cpf}
                    onChange={(e) => setNewLead(prev => ({ ...prev, cpf: e.target.value }))}
                    placeholder="000.000.000-00"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Data de Nascimento</label>
                  <input 
                    type="date"
                    value={newLead.dataNascimento}
                    onChange={(e) => setNewLead(prev => ({ ...prev, dataNascimento: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: Dados Comerciais & Interesse Clínico */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                <Tag size={14} /> Dados Comerciais & Interesse
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Origem do Lead</label>
                  <select 
                    value={newLead.leadSource}
                    onChange={(e) => setNewLead(prev => ({ ...prev, leadSource: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="whatsapp">WhatsApp (Z-API)</option>
                    <option value="instagram">Instagram / Direct</option>
                    <option value="google">Google Ads / Pesquisa</option>
                    <option value="indicacao">Indicação de Paciente</option>
                    <option value="balcao">Presencial / Balcão</option>
                    <option value="web">Portal do Paciente / Web</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Prioridade / Temperatura</label>
                  <select 
                    value={newLead.prioridade}
                    onChange={(e) => setNewLead(prev => ({ ...prev, prioridade: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ALTA">🔥 Quente (Alta Prioridade - Quer agendar)</option>
                    <option value="MEDIA">⚡ Morno (Média Prioridade - Tirando dúvidas)</option>
                    <option value="BAIXA">❄️ Frio (Baixa Prioridade - Apenas cotação)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Procedimento de Interesse</label>
                  <input 
                    value={newLead.procedimentoInteresse}
                    onChange={(e) => setNewLead(prev => ({ ...prev, procedimentoInteresse: e.target.value }))}
                    placeholder="Ex: Harmonização, Botox, Consulta Geral"
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Convênio / Tipo</label>
                  <select 
                    value={newLead.convenioId}
                    onChange={(e) => setNewLead(prev => ({ ...prev, convenioId: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Particular</option>
                    {convenios.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1 block">Observações Iniciais / Queixa</label>
                <textarea 
                  rows={2}
                  value={newLead.observacoes}
                  onChange={(e) => setNewLead(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Informações adicionais relatadas no primeiro contato..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Ações do Footer (Sem botão de cancelar preto!) */}
            <div className="pt-3 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowNewLeadModal(false)}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all border border-zinc-200 dark:border-zinc-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creatingLead}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {creatingLead ? "Cadastrando..." : "Cadastrar Lead"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
