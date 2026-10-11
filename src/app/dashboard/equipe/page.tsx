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
      {/* Action Bar Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rd-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Gestão de Equipe & Usuários</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
            {team.length} de 5 Usuários Delegados
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Controle de Acesso RBAC Ativo
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)} 
          disabled={team.length >= 5}
          className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${team.length >= 5 ? 'border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 shadow-md shadow-rd-cyan/20'}`}
        >
          <Plus size={16} /> Adicionar Usuário
        </button>
      </div>

      {/* Tabela de Equipe Liquid Glass */}
      <div className="w-full bg-white dark:bg-zinc-900/85 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700/80 overflow-hidden shadow-md backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Nome</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Papel</th>
                <th className="p-4 font-bold">Data de Criação</th>
                <th className="p-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Carregando usuários da equipe...</td></tr>
              ) : team.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Nenhum usuário delegado cadastrado.</td></tr>
              ) : (
                team.map(member => (
                  <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rd-cyan/15 flex items-center justify-center text-rd-cyan font-bold text-xs border border-rd-cyan/20">
                          {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{member.fullName || 'Sem Nome'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{member.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-wider">
                        <Shield size={10} /> {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(member.createdAt).toLocaleDateString("pt-BR")}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-rose-500 hover:text-rose-600 transition-colors p-2 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100">
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
