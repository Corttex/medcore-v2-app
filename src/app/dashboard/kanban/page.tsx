"use client";

import React, { useState, useRef } from "react";
import { Plus, GripVertical, Trash2, Tag, Calendar, User, Flag } from "lucide-react";

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

const initialCards: KanbanCard[] = [
  { id: "1", title: "Revisar protocolo de admissão", description: "Atualizar o fluxo de triagem para a nova norma da ANVISA.", assignee: "Dr. Thorne", dueDate: "2026-04-15", priority: "high", column: "todo", tags: ["ANVISA", "Protocolo"] },
  { id: "2", title: "Escala de plantão — Maio", description: "Definir distribuição de médicos e enfermeiros.", assignee: "RH", dueDate: "2026-04-20", priority: "medium", column: "doing", tags: ["RH", "Escala"] },
  { id: "3", title: "Relatório mensal de eficiência", description: "Compilar dados de produtividade cirúrgica.", assignee: "Dra. Helena", dueDate: "2026-04-18", priority: "critical", column: "doing", tags: ["Relatório"] },
  { id: "4", title: "Renovar contrato de manutenção", description: "Contrato de manutenção preventiva dos equipamentos.", assignee: "Adm", dueDate: "2026-04-30", priority: "low", column: "done", tags: ["Contratos"] },
];

export default function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [showForm, setShowForm] = useState(false);
  const [dragCard, setDragCard] = useState<KanbanCard | null>(null);
  const [form, setForm] = useState({ title: "", description: "", assignee: "", dueDate: "", priority: "medium" as Priority, column: "todo" as Column, tags: "" });

  const handleAddCard = () => {
    if (!form.title.trim()) return;
    const newCard: KanbanCard = {
      ...form,
      id: Date.now().toString(),
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    setCards([...cards, newCard]);
    setShowForm(false);
    setForm({ title: "", description: "", assignee: "", dueDate: "", priority: "medium", column: "todo", tags: "" });
  };

  const moveCard = (cardId: string, newColumn: Column) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, column: newColumn } : c));
  };

  const deleteCard = (cardId: string) => setCards(cards.filter(c => c.id !== cardId));

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    if (dragCard) moveCard(dragCard.id, column);
    setDragCard(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Organização</span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface">
            Kanban de <span className="text-gradient">Notas</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{cards.filter(c => c.column !== "archived").length} itens ativos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black">
          <Plus size={18} /> Novo Card
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-lg p-8 space-y-4 animate-in fade-in zoom-in-95">
            <h2 className="font-heading text-2xl font-black text-on-surface">Novo Card</h2>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="Título *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none h-24" placeholder="Descrição..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Responsável</label>
                <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Prazo</label>
                <input type="date" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Prioridade</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })}>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Coluna</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.column} onChange={e => setForm({ ...form, column: e.target.value as Column })}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Tags (separadas por vírgula)</label>
              <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="ANVISA, Relatório..." value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold">Cancelar</button>
              <button onClick={handleAddCard} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">Criar Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board — horizontal scroll no mobile */}
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1">
        {COLUMNS.map(col => {
          const colCards = cards.filter(c => c.column === col.id);
          return (
            <div
              key={col.id}
              className="flex-shrink-0 w-72 bg-surface-container-low rounded-3xl border border-outline-variant/40 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, col.id)}
            >
              <div className={`p-4 border-b border-outline-variant/30 border-t-4 ${col.color} rounded-t-3xl rounded-tr-3xl`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-black text-sm text-on-surface">{col.label}</h3>
                  <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-black text-on-surface-variant">{colCards.length}</span>
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
                      className="group bg-surface rounded-2xl border border-outline-variant/40 p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-bold text-on-surface leading-snug flex-1">{card.title}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={14} className="text-on-surface-variant mt-0.5" />
                          <button onClick={() => deleteCard(card.id)} className="text-error hover:text-error/80"><Trash2 size={13} /></button>
                        </div>
                      </div>
                      {card.description && <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{card.description}</p>}
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {card.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                              <Tag size={8} />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${prio.bg} ${prio.color}`}>
                          <Flag size={8} />{prio.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {card.dueDate && (
                            <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                              <Calendar size={9} />{new Date(card.dueDate).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                          {card.assignee && (
                            <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                              <User size={9} />{card.assignee.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Mover rápido por coluna */}
                      <div className="mt-3 flex gap-1">
                        {COLUMNS.filter(c => c.id !== col.id).map(c => (
                          <button key={c.id} onClick={() => moveCard(card.id, c.id)} className="flex-1 text-[9px] py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-bold transition-colors truncate px-1">
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
    </div>
  );
}
