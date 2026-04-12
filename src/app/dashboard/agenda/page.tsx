"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus, Pin, Repeat, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type EventType = "CRÍTICO" | "ESTRATÉGICO" | "ADMIN" | "FIXO";

interface AgendaEvent {
  id: string;
  time: string;
  duration: string;
  title: string;
  location: string;
  attendees: string[];
  status: "CONFIRMADO" | "EM ANDAMENTO" | "PENDENTE";
  type: EventType;
  isFixed: boolean;
  recurrence?: "semanal" | "mensal";
}

const TYPE_COLORS: Record<EventType, string> = {
  "CRÍTICO":    "text-error bg-error/10 border-error/30",
  "ESTRATÉGICO": "text-primary bg-primary/10 border-primary/20",
  "ADMIN":      "text-amber-600 bg-amber-50 border-amber-200",
  "FIXO":       "text-violet-600 bg-violet-50 border-violet-200",
};

const STATUS_COLORS = {
  "CONFIRMADO":   "bg-emerald-100 text-emerald-700 border-emerald-200",
  "EM ANDAMENTO": "bg-primary/10 text-primary border-primary/30",
  "PENDENTE":     "bg-amber-100 text-amber-700 border-amber-200",
};

const initialEvents: AgendaEvent[] = [
  { id: "1", time: "08:00", duration: "1h", title: "Reunião Semanal de Diretoria", location: "Sala de Conferência A", attendees: ["Dr. Thorne", "Dra. Helena", "Board"], status: "CONFIRMADO", type: "FIXO", isFixed: true, recurrence: "semanal" },
  { id: "2", time: "09:30", duration: "45min", title: "Review de Protocolo Cirúrgico", location: "Auditório Médico", attendees: ["Dr. Thorne", "Dra. Helena"], status: "CONFIRMADO", type: "CRÍTICO", isFixed: false },
  { id: "3", time: "10:30", duration: "30min", title: "Alinhamento com Jurídico", location: "Online — Teams", attendees: ["Adm", "Jurídico"], status: "EM ANDAMENTO", type: "ESTRATÉGICO", isFixed: false },
  { id: "4", time: "12:00", duration: "1h30", title: "Conselho de Administração Mensal", location: "Suíte Executiva", attendees: ["Board MedCore"], status: "CONFIRMADO", type: "FIXO", isFixed: true, recurrence: "mensal" },
  { id: "5", time: "14:30", duration: "30min", title: "Auditoria de Conformidade ANVISA", location: "Ala de Diagnósticos", attendees: ["Dra. Helena"], status: "PENDENTE", type: "ADMIN", isFixed: false },
  { id: "6", time: "16:00", duration: "1h", title: "Plantão de Reunião Executiva", location: "Sala 3B", attendees: ["Dr. Thorne"], status: "PENDENTE", type: "FIXO", isFixed: true, recurrence: "semanal" },
];

export default function AgendaPage() {
  const [view, setView] = useState<"geral" | "fixos">("geral");
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<AgendaEvent[]>(initialEvents);
  const [form, setForm] = useState({ title: "", time: "", duration: "1h", location: "", attendees: "", type: "ESTRATÉGICO" as EventType, isFixed: false, recurrence: "" as "" | "semanal" | "mensal" });

  const displayedEvents = view === "fixos" ? events.filter(e => e.isFixed) : events;

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const newEvent: AgendaEvent = {
      id: Date.now().toString(),
      time: form.time || "09:00",
      duration: form.duration,
      title: form.title,
      location: form.location,
      attendees: form.attendees.split(",").map(a => a.trim()).filter(Boolean),
      status: "PENDENTE",
      type: form.isFixed ? "FIXO" : form.type,
      isFixed: form.isFixed,
      recurrence: form.recurrence || undefined,
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)));
    setShowForm(false);
    setForm({ title: "", time: "", duration: "1h", location: "", attendees: "", type: "ESTRATÉGICO", isFixed: false, recurrence: "" });
  };

  const deleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Módulo Temporal
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface">
            Agenda <span className="text-gradient">Institucional</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {displayedEvents.length} evento{displayedEvents.length !== 1 ? "s" : ""} {view === "fixos" ? "recorrentes" : "hoje"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black"
          >
            <Plus size={18} /> Novo Evento
          </button>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-2xl w-fit border border-outline-variant/40">
        <button
          onClick={() => setView("geral")}
          className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all",
            view === "geral" ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <CalendarIcon size={15} /> Agenda Geral
        </button>
        <button
          onClick={() => setView("fixos")}
          className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all",
            view === "fixos" ? "bg-surface shadow-sm text-violet-600" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Pin size={15} /> Eventos Fixos
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center">
            {events.filter(e => e.isFixed).length}
          </span>
        </button>
      </div>

      {/* Fixed Events Banner */}
      {view === "fixos" && (
        <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 flex items-center gap-3">
          <Repeat size={18} className="text-violet-600 shrink-0" />
          <div>
            <p className="text-sm font-black text-violet-700">Eventos Recorrentes</p>
            <p className="text-xs text-violet-600">Estes eventos se repetem automaticamente conforme a recorrência configurada.</p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-lg p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black text-on-surface">Novo Evento</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface">
                <X size={16} />
              </button>
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary" placeholder="Título do evento *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Horário</label>
                <input type="time" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Duração</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
                  {["30min","45min","1h","1h30","2h","3h"].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Local / Link" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Convidados (separados por vírgula)" value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Tipo</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as EventType })}>
                  {["CRÍTICO","ESTRATÉGICO","ADMIN","FIXO"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Recorrência</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.recurrence} onChange={e => setForm({ ...form, recurrence: e.target.value as "" | "semanal" | "mensal", isFixed: e.target.value !== "" })}>
                  <option value="">Sem recorrência</option>
                  <option value="semanal">Semanal (Fixo)</option>
                  <option value="mensal">Mensal (Fixo)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">Criar Evento</button>
            </div>
          </div>
        </div>
      )}

      {/* Events Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-3">
          {displayedEvents.map(event => (
            <div key={event.id} className="group flex gap-4 p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all">
              {/* Time block */}
              <div className="text-center shrink-0 w-14">
                <p className="font-heading font-black text-sm text-on-surface">{event.time}</p>
                <p className="text-[10px] text-on-surface-variant">{event.duration}</p>
              </div>

              <div className="w-px bg-outline-variant/40 shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {event.isFixed && <Pin size={12} className="text-violet-500 shrink-0" />}
                    <h3 className="font-heading font-black text-sm text-on-surface">{event.title}</h3>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-error/10 flex items-center justify-center text-error hover:bg-error/20 transition-all shrink-0">
                    <X size={12} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", TYPE_COLORS[event.type])}>
                    {event.type}
                  </span>
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", STATUS_COLORS[event.status])}>
                    {event.status}
                  </span>
                  {event.recurrence && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-600 flex items-center gap-1">
                      <Repeat size={8} /> {event.recurrence}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {event.location && (
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <MapPin size={10} /> {event.location}
                    </span>
                  )}
                  {event.attendees.length > 0 && (
                    <span className="text-xs text-on-surface-variant">
                      👥 {event.attendees.slice(0, 2).join(", ")}{event.attendees.length > 2 ? ` +${event.attendees.length - 2}` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {displayedEvents.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">Nenhum evento {view === "fixos" ? "fixo" : ""} cadastrado.</p>
            </div>
          )}
        </div>

        {/* Mini stats sidebar */}
        <div className="space-y-4">
          <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Resumo do Dia</p>
            <div className="space-y-3">
              {[
                { label: "Total", value: events.length, color: "text-on-surface" },
                { label: "Fixos", value: events.filter(e => e.isFixed).length, color: "text-violet-600" },
                { label: "Confirmados", value: events.filter(e => e.status === "CONFIRMADO").length, color: "text-emerald-600" },
                { label: "Pendentes", value: events.filter(e => e.status === "PENDENTE").length, color: "text-amber-600" },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">{s.label}</span>
                  <span className={`font-heading font-black text-lg ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-violet-50 border border-violet-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Pin size={14} className="text-violet-600" />
              <p className="text-xs font-black text-violet-700 uppercase tracking-widest">Próximos Fixos</p>
            </div>
            <div className="space-y-2">
              {events.filter(e => e.isFixed).slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center gap-2">
                  <Clock size={10} className="text-violet-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-violet-800 leading-tight">{e.title}</p>
                    <p className="text-[10px] text-violet-600">{e.time} · {e.recurrence}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
