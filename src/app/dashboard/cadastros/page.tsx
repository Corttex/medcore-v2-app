"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Building2, Stethoscope, CheckCircle2, X, Shield, Mail, Key, BriefcaseMedical } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

export default function CadastrosBasePage() {
  const { selectedUnitId } = useDashboardContext();
  const [activeTab, setActiveTab] = useState("medicos"); // medicos, consultorios, convenios

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Dados
  const [medicos, setMedicos] = useState<any[]>([]);
  const [consultorios, setConsultorios] = useState<any[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);

  // Modais
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Forms
  const [medicoForm, setMedicoForm] = useState({ fullName: "", email: "", password: "", especialidade: "", crm: "", crmUf: "", pin: "" });
  const [consultorioForm, setConsultorioForm] = useState({ nome: "" });
  const [convenioForm, setConvenioForm] = useState({ nome: "", description: "", requiresToken: false });

  useEffect(() => {
    fetchData();
  }, [selectedUnitId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, cRes, convRes] = await Promise.all([
        fetch("/api/medicos"),
        fetch(`/api/consultorios${selectedUnitId ? `?unitId=${selectedUnitId}` : ''}`),
        fetch("/api/convenios")
      ]);
      
      if (mRes.ok) setMedicos(await mRes.json());
      if (cRes.ok) setConsultorios(await cRes.json());
      if (convRes.ok) setConvenios((await convRes.json()).convenios || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveMedico = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess(""); setSaving(true);
    try {
      const res = await fetch("/api/medicos", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicoForm)
      });
      const data = await res.json();
      if (!res.ok) setFormError(data.error || "Erro ao salvar médico.");
      else {
        setFormSuccess("Médico cadastrado com sucesso!");
        setTimeout(() => { setShowModal(false); fetchData(); setMedicoForm({ fullName: "", email: "", password: "", especialidade: "", crm: "", crmUf: "", pin: "" }); }, 1500);
      }
    } catch (e) { setFormError("Erro de conexão."); }
    setSaving(false);
  };

  const handleSaveConsultorio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId) return setFormError("Selecione um hospital/clínica no menu lateral primeiro.");
    setFormError(""); setFormSuccess(""); setSaving(true);
    try {
      const res = await fetch("/api/consultorios", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...consultorioForm, unitId: selectedUnitId })
      });
      const data = await res.json();
      if (!res.ok) setFormError(data.error || "Erro ao salvar sala.");
      else {
        setFormSuccess("Sala cadastrada com sucesso!");
        setTimeout(() => { setShowModal(false); fetchData(); setConsultorioForm({ nome: "" }); }, 1500);
      }
    } catch (e) { setFormError("Erro de conexão."); }
    setSaving(false);
  };

  const handleSaveConvenio = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess(""); setSaving(true);
    try {
      const res = await fetch("/api/convenios", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convenioForm)
      });
      if (!res.ok) setFormError("Erro ao salvar convênio.");
      else {
        setFormSuccess("Convênio cadastrado com sucesso!");
        setTimeout(() => { setShowModal(false); fetchData(); setConvenioForm({ nome: "", description: "", requiresToken: false }); }, 1500);
      }
    } catch (e) { setFormError("Erro de conexão."); }
    setSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-rd-cyan/10 border border-rd-cyan/20 text-rd-cyan text-sm font-semibold uppercase tracking-widest rounded-full">
              Configurações
            </span>
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface">
            Cadastros <span className="text-gradient-brand">Base</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Centralize as configurações de infraestrutura clínica.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder={`Buscar em ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-rd-cyan focus:outline-none w-64"
            />
          </div>
          <button
            onClick={() => { setFormSuccess(""); setFormError(""); setShowModal(true); }}
            className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold shadow-glow"
          >
            <Plus size={18} /> Cadastrar {activeTab === 'medicos' ? 'Médico' : activeTab === 'consultorios' ? 'Sala' : 'Convênio'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-outline-variant/20">
         <button onClick={() => setActiveTab('medicos')} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'medicos' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
            Médicos / Corpo Clínico
         </button>
         <button onClick={() => setActiveTab('consultorios')} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'consultorios' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
            Consultórios / Salas
         </button>
         <button onClick={() => setActiveTab('convenios')} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'convenios' ? 'border-rd-cyan text-rd-cyan' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>
            Convênios & Planos
         </button>
      </div>

      {/* Conteúdos */}
      <div className="bg-surface border border-outline-variant/30 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          
          {/* TAB MEDICOS */}
          {activeTab === 'medicos' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Profissional</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Contato / Acesso</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Especialidade</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {medicos.filter(m => m.fullName?.toLowerCase().includes(search.toLowerCase()) || m.crm?.includes(search)).map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rd-cyan/10 flex items-center justify-center text-rd-cyan font-bold border border-rd-cyan/20">
                            {m.fullName ? m.fullName.charAt(0).toUpperCase() : <Stethoscope size={18} />}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{m.fullName || 'Sem nome'}</p>
                            <p className="text-sm text-zinc-400 uppercase tracking-widest flex items-center gap-1 mt-0.5"><Shield size={10}/> Role: {m.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><p className="text-sm text-zinc-300 flex items-center gap-1.5"><Mail size={14}/> {m.email}</p></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10">{m.especialidade || 'Clínico Geral'}</span></td>
                      <td className="p-4">
                        {m.crm ? <p className="text-sm font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-md inline-block">CRM-{m.crmUf} {m.crm}</p> : <span className="text-xs text-zinc-500 italic">Não informado</span>}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB CONSULTORIOS */}
          {activeTab === 'consultorios' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider w-16 text-center">ID</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Nome do Consultório / Sala</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Unidade / Clínica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {!selectedUnitId && <tr><td colSpan={3} className="p-8 text-center text-zinc-500">Selecione uma clínica no menu lateral.</td></tr>}
                {consultorios.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())).map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center"><span className="text-xs font-mono text-zinc-500">#{c.id.slice(0,4)}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rd-cyan/10 flex items-center justify-center text-rd-cyan border border-rd-cyan/20"><Building2 size={16} /></div>
                          <p className="font-semibold text-white">{c.nome}</p>
                        </div>
                      </td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1.5 w-fit"><Building2 size={12}/> Hospital Ativo</span></td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB CONVENIOS */}
          {activeTab === 'convenios' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/20">
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider w-16 text-center">ID</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Convênio / Operadora</th>
                  <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Requisitos TISS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {convenios.filter(c => c.nome.toLowerCase().includes(search.toLowerCase())).map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center"><span className="text-xs font-mono text-zinc-500">#{c.id.slice(0,4)}</span></td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20"><BriefcaseMedical size={16} /></div>
                          <div>
                            <p className="font-semibold text-white">{c.nome}</p>
                            <p className="text-xs text-zinc-400">{c.description || 'Nenhuma descrição'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {c.requiresToken ? (
                           <span className="px-2.5 py-1 rounded-lg text-sm font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">Exige Token de Paciente</span>
                        ) : (
                           <span className="px-2.5 py-1 rounded-lg text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">Sem Validação TISS Extra</span>
                        )}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Universal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-white">
                Cadastrar {activeTab === 'medicos' ? 'Médico' : activeTab === 'consultorios' ? 'Sala' : 'Convênio'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
            </div>
            
            {/* FORM MEDICO */}
            {activeTab === 'medicos' && (
               <form onSubmit={handleSaveMedico} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">Nome Completo *</label>
                      <input required type="text" value={medicoForm.fullName} onChange={e => setMedicoForm({...medicoForm, fullName: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block flex items-center gap-1"><Mail size={12}/> Email (Login) *</label>
                      <input required type="email" value={medicoForm.email} onChange={e => setMedicoForm({...medicoForm, email: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block flex items-center gap-1"><Key size={12}/> Senha de Acesso *</label>
                      <input required type="text" placeholder="Senha provisória" value={medicoForm.password} onChange={e => setMedicoForm({...medicoForm, password: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none font-mono tracking-widest" />
                    </div>
                    <div className="col-span-2"><div className="h-px w-full bg-white/5 my-2"></div></div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">CRM (Apenas números)</label>
                      <input type="text" value={medicoForm.crm} onChange={e => setMedicoForm({...medicoForm, crm: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">UF do CRM</label>
                      <select value={medicoForm.crmUf} onChange={e => setMedicoForm({...medicoForm, crmUf: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none">
                        <option value="">Selecione...</option>
                        {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'DF', 'GO', 'PE', 'CE', 'AM'].map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">Especialidade</label>
                      <input type="text" placeholder="Ex: Cardiologia" value={medicoForm.especialidade} onChange={e => setMedicoForm({...medicoForm, especialidade: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">PIN do Painel Médico</label>
                      <input type="text" placeholder="Ex: 1234" maxLength={4} value={medicoForm.pin} onChange={e => setMedicoForm({...medicoForm, pin: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none font-mono tracking-widest text-center" />
                    </div>
                  </div>
                  {formError && <p className="text-error text-xs font-semibold pt-2">{formError}</p>}
                  {formSuccess && <p className="text-emerald-400 text-xs font-semibold pt-2 flex items-center gap-1"><CheckCircle2 size={14}/> {formSuccess}</p>}
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rd-cyan text-zinc-950 shadow-glow disabled:opacity-50">Salv{saving ? "ando..." : "ar Médico"}</button>
                  </div>
               </form>
            )}

            {/* FORM CONSULTORIO */}
            {activeTab === 'consultorios' && (
               <form onSubmit={handleSaveConsultorio} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">Nome da Sala / Consultório *</label>
                    <input required type="text" placeholder="Ex: Sala 01 - Oftalmologia" value={consultorioForm.nome} onChange={e => setConsultorioForm({...consultorioForm, nome: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                  </div>
                  {formError && <p className="text-error text-xs font-semibold pt-2">{formError}</p>}
                  {formSuccess && <p className="text-emerald-400 text-xs font-semibold pt-2 flex items-center gap-1"><CheckCircle2 size={14}/> {formSuccess}</p>}
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10">Cancelar</button>
                    <button type="submit" disabled={saving || !selectedUnitId} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rd-cyan text-zinc-950 shadow-glow disabled:opacity-50">Salv{saving ? "ando..." : "ar Sala"}</button>
                  </div>
               </form>
            )}

            {/* FORM CONVENIO */}
            {activeTab === 'convenios' && (
               <form onSubmit={handleSaveConvenio} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">Nome do Convênio *</label>
                    <input required type="text" placeholder="Ex: Unimed" value={convenioForm.nome} onChange={e => setConvenioForm({...convenioForm, nome: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-1.5 block">Descrição (Opcional)</label>
                    <input type="text" placeholder="Ex: Plano Ouro VIP" value={convenioForm.description} onChange={e => setConvenioForm({...convenioForm, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:outline-none" />
                  </div>
                  <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    <input type="checkbox" checked={convenioForm.requiresToken} onChange={e => setConvenioForm({...convenioForm, requiresToken: e.target.checked})} className="w-5 h-5 accent-rd-cyan" />
                    <div>
                      <p className="text-sm font-semibold text-white">Exigir Token TISS de Paciente</p>
                      <p className="text-xs text-zinc-400">Marca obrigatório o token no momento do agendamento para evitar glosas.</p>
                    </div>
                  </label>

                  {formError && <p className="text-error text-xs font-semibold pt-2">{formError}</p>}
                  {formSuccess && <p className="text-emerald-400 text-xs font-semibold pt-2 flex items-center gap-1"><CheckCircle2 size={14}/> {formSuccess}</p>}
                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10">Cancelar</button>
                    <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rd-cyan text-zinc-950 shadow-glow disabled:opacity-50">Salv{saving ? "ando..." : "ar Convênio"}</button>
                  </div>
               </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
