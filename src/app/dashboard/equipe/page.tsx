"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Shield, UserCheck, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function EquipePage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Erro ao adicionar usuário");
        return;
      }
      
      setShowModal(false);
      setForm({ fullName: "", email: "", password: "", role: "admin" });
      fetchTeam();
    } catch (e) {
      setError("Erro de conexão");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rd-cyan/10 border border-rd-cyan/20 text-rd-cyan text-xs font-semibold uppercase tracking-widest rounded-full">Administração</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tighter text-on-surface">
            Gestão de <span className="text-gradient-lilac">Equipe</span>
          </h1>
          <p className="text-on-surface-variant text-[11px] font-medium opacity-80">
            Você tem {team.length} de 5 usuários delegados cadastrados.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          disabled={team.length >= 5}
          className={`border-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 group shrink-0 ${team.length >= 5 ? 'border-zinc-700 bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'border-rd-cyan bg-rd-cyan/10 text-rd-cyan hover:bg-rd-cyan hover:text-zinc-950 shadow-[0_0_15px_rgba(0,169,255,0.3)]'}`}
        >
          <Plus size={18} className={team.length < 5 ? "group-hover:rotate-90 transition-transform" : ""} /> Adicionar Usuário
        </button>
      </div>

      {/* Tabela de Equipe */}
      <div className="w-full bg-surface-container-low rounded-3xl border border-outline-variant/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface/30 text-sm uppercase tracking-widest text-on-surface-variant">
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Papel</th>
                <th className="p-4 font-semibold">Data de Criação</th>
                <th className="p-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Carregando...</td></tr>
              ) : team.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Nenhum usuário delegado.</td></tr>
              ) : (
                team.map(member => (
                  <tr key={member.id} className="hover:bg-surface-container/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rd-cyan/20 flex items-center justify-center text-rd-cyan font-bold">
                          {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <p className="text-sm font-semibold text-on-surface">{member.fullName || 'Sem Nome'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-on-surface-variant">{member.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-widest">
                        <Shield size={10} /> {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-on-surface-variant">{new Date(member.createdAt).toLocaleDateString("pt-BR")}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-error/60 hover:text-error transition-colors p-2 hover:bg-error/10 rounded-lg opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/90 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-md p-8 space-y-5 animate-in fade-in zoom-in-95 backdrop-blur-2xl relative overflow-hidden">
            <h2 className="font-heading text-2xl font-semibold text-white relative z-10">Novo Delegado</h2>
            
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-semibold text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAddMember} className="space-y-4 relative z-10">
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Nome Completo</label>
                <input required className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Email</label>
                <input required type="email" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Senha Provisória</label>
                <input required type="password" minLength={6} className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Permissão</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="admin" className="bg-zinc-800 text-white">Administrador (Delegado)</option>
                  <option value="viewer" className="bg-zinc-800 text-white">Apenas Visualização</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all">Cancelar</button>
                <button type="submit" className="flex-1 btn-gradient py-3 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
