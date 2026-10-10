"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Calendar, User, Flag, Edit2, LayoutGrid, List } from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

type Priority = "low" | "medium" | "high" | "critical";
type Column = "todo" | "doing" | "done" | "archived";

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: Priority;
  column: Column;
  tags: string[];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  low:      { label: "Baixa",    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  medium:   { label: "Média",    color: "text-amber-600",   bg: "bg-amber-50 border-amber-200" },
  high:     { label: "Alta",     color: "text-orange-600",  bg: "bg-orange-50 border-orange-200" },
  critical: { label: "Crítica",  color: "text-error",       bg: "bg-red-50 border-red-200" },
};

const COLUMNS: { id: Column; label: string; color: string }[] = [
  { id: "todo",     label: "A Fazer",      color: "border-t-slate-400" },
  { id: "doing",    label: "Em Andamento", color: "border-t-primary" },
  { id: "done",     label: "Concluído",    color: "border-t-emerald-500" },
  { id: "archived", label: "Arquivado",    color: "border-t-slate-300" },
];

export default function KanbanPage() {
  const { selectedUnitId } = useDashboardContext();
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showForm, setShowForm] = useState(false);
  const [dragCard, setDragCard] = useState<KanbanCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", assignee: "", dueDate: "", priority: "medium" as Priority, column: "todo" as Column, tags: "" });

  useEffect(() => {
    const fetchCards = async () => {
      if (!selectedUnitId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/kanban?unitId=${selectedUnitId}`);
        if (res.ok) {
          const data = await res.json();
          setCards(data);
        }
      } catch (err) {
        console.error("Erro ao buscar cards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [selectedUnitId]);

  const handleAddCard = async () => {
    if (!form.title.trim() || !selectedUnitId) return;
    
    const tagsArray = form.tags 
        ? form.tags.split(",").map(t => sanitize(t.trim())).filter(Boolean) 
        : [];

    const newCardData = {
      title: sanitize(form.title),
      description: sanitize(form.description),
      assignee: sanitize(form.assignee),
      dueDate: form.dueDate || null,
      priority: form.priority,
      column: form.column,
      tags: tagsArray,
      unitId: selectedUnitId
    };

    try {
      const res = await fetch("/api/kanban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCardData)
      });
      if (res.ok) {
        const createdCard = await res.json();
        setCards([...cards, createdCard]);
      }
    } catch (e) {
      console.error(e);
    }

    setShowForm(false);
    setForm({ title: "", description: "", assignee: "", dueDate: "", priority: "medium", column: "todo", tags: "" });
  };

  const moveCard = async (cardId: string, newColumn: Column) => {
    // Optimistic update
    const previousCards = [...cards];
    setCards(cards.map(c => c.id === cardId ? { ...c, column: newColumn } : c));

    try {
      const res = await fetch("/api/kanban", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cardId, column: newColumn })
      });
      if (!res.ok) throw new Error("Falha ao atualizar");
    } catch (e) {
      console.error(e);
      setCards(previousCards); // Revert on error
    }
  };

  const deleteCard = async (cardId: string) => {
    // Optimistic update
    const previousCards = [...cards];
    setCards(cards.filter(c => c.id !== cardId));

    try {
      const res = await fetch(`/api/kanban?id=${cardId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao deletar");
    } catch (e) {
      console.error(e);
      setCards(previousCards); // Revert
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    if (dragCard && dragCard.column !== column) moveCard(dragCard.id, column);
    setDragCard(null);
  };

  if (!selectedUnitId) {
    return <div className="p-8 text-center text-on-surface-variant animate-in fade-in">Selecione uma clínica para visualizar o Kanban.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low border border-outline-variant/30 px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex items-center bg-surface border border-outline-variant/30 px-4 py-2 rounded-xl">
          <p className="text-on-surface-variant text-sm font-medium">
            <span className="text-rd-cyan font-bold">{cards.filter(c => c.column !== "archived").length}</span> notas e tarefas em processamento ativo
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center bg-surface-container rounded-xl p-1 border border-outline-variant/30 shrink-0 self-start sm:self-auto">
            <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-rd-cyan/20 text-rd-cyan" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"}`}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-rd-cyan/20 text-rd-cyan" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"}`}>
              <List size={18} />
            </button>
          </div>
          <button onClick={() => setShowForm(true)} className="border-2 border-rd-cyan bg-rd-cyan/10 text-rd-cyan hover:bg-rd-cyan hover:text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,169,255,0.3)] transition-all flex items-center justify-center gap-2 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Novo Card
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/80 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-lg p-8 space-y-5 animate-in fade-in zoom-in-95 backdrop-blur-2xl">
            <h2 className="font-heading text-2xl font-semibold text-white">Novo Card</h2>
            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Título *</label>
              <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Título *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Descrição</label>
              <textarea className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner resize-none h-24" placeholder="Descrição..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Responsável</label>
                <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="Nome" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Prazo</label>
                <input type="date" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Prioridade</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })}>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k} className="bg-zinc-800 text-white">{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Coluna</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.column} onChange={e => setForm({ ...form, column: e.target.value as Column })}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id} className="bg-zinc-800 text-white">{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Tags (separadas por vírgula)</label>
              <input className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" placeholder="ANVISA, Relatório..." value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all">Cancelar</button>
              <button onClick={handleAddCard} className="flex-1 btn-gradient py-3 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]">Criar Card</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant animate-pulse">Carregando Kanban...</div>
      ) : (
        <>
          {/* Board & List View */}
          {viewMode === "kanban" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full pb-4">
              {COLUMNS.map(col => {
                const colCards = cards.filter(c => c.column === col.id);
                return (
                  <div
                    key={col.id}
                    className="w-full bg-zinc-100 dark:bg-zinc-950/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col min-w-0"
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, col.id)}
                  >
                    <div className={`p-4 border-b border-zinc-200 dark:border-zinc-800 border-t-4 ${col.color} rounded-t-3xl rounded-tr-3xl`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-semibold text-[11px] text-on-surface uppercase tracking-widest ">{col.label}</h3>
                        <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-xs font-semibold text-on-surface-variant">{colCards.length}</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-3 flex-1 min-h-[200px]">
                      {colCards.map(card => {
                        const prio = PRIORITY_CONFIG[card.priority];
                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() => setDragCard(card)}
                            className="group bg-white dark:bg-zinc-900 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 p-4 shadow-md hover:shadow-lg hover:border-rd-cyan/50 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-sm font-semibold text-on-surface leading-tight flex-1">{card.title}</p>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); /* TODO Edit */ }} className="text-primary/60 hover:text-primary transition-colors"><Edit2 size={12} /></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }} className="text-error/60 hover:text-error transition-colors"><Trash2 size={12} /></button>
                              </div>
                            </div>
                            {card.description && <p className="text-xs text-on-surface-variant mb-2 line-clamp-2">{card.description}</p>}
                            {card.tags && card.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {card.tags.map(tag => (
                                   <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rd-cyan/5 text-rd-cyan text-sm font-semibold uppercase tracking-widest rounded-sm border border-rd-cyan/10">
                                     <Tag size={9} />{tag}
                                   </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-1.5 py-0.5 rounded-full border ${prio.bg} ${prio.color}`}>
                                <Flag size={9} />{prio.label}
                              </span>
                              <div className="flex items-center gap-2">
                                {card.dueDate && (
                                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                                    <Calendar size={11} />{new Date(card.dueDate).toLocaleDateString("pt-BR")}
                                  </span>
                                )}
                                {card.assignee && (
                                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                                    <User size={11} />{card.assignee.split(" ")[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Mover rápido por coluna */}
                            <div className="mt-3 flex gap-1">
                              {COLUMNS.filter(c => c.id !== col.id).map(c => (
                                <button key={c.id} onClick={() => moveCard(card.id, c.id)} className="flex-1 text-xs py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium transition-colors truncate px-1">
                                  → {c.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full pb-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-sm uppercase tracking-widest text-on-surface-variant">
                        <th className="p-4 font-semibold w-1/3">Título</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Prioridade</th>
                        <th className="p-4 font-semibold">Responsável</th>
                        <th className="p-4 font-semibold">Prazo</th>
                        <th className="p-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {cards.map(card => {
                        const prio = PRIORITY_CONFIG[card.priority];
                        return (
                          <tr key={card.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                            <td className="p-4">
                              <p className="text-sm font-semibold text-on-surface">{card.title}</p>
                              {card.description && <p className="text-xs text-on-surface-variant truncate max-w-[250px] mt-0.5">{card.description}</p>}
                              {card.tags && card.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {card.tags.map(tag => (
                                     <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-rd-cyan/5 text-rd-cyan text-xs font-semibold uppercase tracking-widest rounded-sm border border-rd-cyan/10">
                                       {tag}
                                     </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="p-4">
                              <select 
                                value={card.column}
                                onChange={(e) => moveCard(card.id, e.target.value as Column)}
                                className="bg-transparent text-xs font-semibold text-on-surface border border-outline-variant/30 rounded-lg px-2 py-1.5 focus:border-rd-cyan focus:outline-none"
                              >
                                {COLUMNS.map(c => <option key={c.id} value={c.id} className="bg-zinc-800 text-white">{c.label}</option>)}
                              </select>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full border ${prio.bg} ${prio.color}`}>
                                <Flag size={10} />{prio.label}
                              </span>
                            </td>
                            <td className="p-4">
                              {card.assignee ? (
                                <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
                                  <User size={12} />{card.assignee}
                                </span>
                              ) : <span className="text-xs text-on-surface-variant/50">-</span>}
                            </td>
                            <td className="p-4">
                              {card.dueDate ? (
                                <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
                                  <Calendar size={12} />{new Date(card.dueDate).toLocaleDateString("pt-BR")}
                                </span>
                              ) : <span className="text-xs text-on-surface-variant/50">-</span>}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { /* TODO Edit */ }} className="text-primary/60 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg">
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => deleteCard(card.id)} className="text-error/60 hover:text-error transition-colors p-2 hover:bg-error/10 rounded-lg">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {cards.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-on-surface-variant text-sm">
                            Nenhum card encontrado. <button onClick={() => setShowForm(true)} className="text-rd-cyan hover:underline">Crie um novo</button> para começar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
