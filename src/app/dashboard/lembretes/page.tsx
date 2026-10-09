"use client";

import React, { useState, useEffect } from "react";
import { Bell, Plus, Repeat, Calendar, Clock, CheckCircle2, Trash2, MessageCircle, Mail, AlertTriangle, Pin } from "lucide-react";

import { SafeInput } from "@/components/ui/SafeInput";

type ReminderType = "once" | "weekly" | "monthly" | "yearly";
type ReminderStatus = "pending" | "done";

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: ReminderType;
  status: ReminderStatus;
  notifyEmail: boolean;
  notifyWhatsapp: boolean;
  whatsappNumber: string;
  email: string;
  isFixed: boolean;
  user_id?: string;
}

const TYPE_CONFIG: Record<ReminderType, { label: string; icon: string }> = {
  once:    { label: "Uma vez",   icon: "📅" },
  weekly:  { label: "Semanal",   icon: "🔁" },
  monthly: { label: "Mensal",    icon: "📆" },
  yearly:  { label: "Anual",     icon: "🗓️" },
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "fixed" | "once">("all");
  const [form, setForm] = useState<Omit<Reminder, "id" | "status">>({
    title: "", description: "", date: "", time: "", type: "once",
    notifyEmail: false, notifyWhatsapp: false, whatsappNumber: "", email: "", isFixed: false,
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders");
      if (res.ok) {
        const data = await res.json();
        setReminders(data.map((r: any) => ({
          ...r,
          notifyEmail: r.notify_email,
          notifyWhatsapp: r.notify_whatsapp,
          whatsappNumber: r.whatsapp_number,
          isFixed: r.is_fixed,
          type: r.type as ReminderType,
          status: r.status as ReminderStatus
        })));
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date) return;

    const newReminder = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time || null,
      type: form.type,
      status: "pending",
      notify_email: form.notifyEmail,
      notify_whatsapp: form.notifyWhatsapp,
      whatsapp_number: form.whatsappNumber,
      email: form.email,
      is_fixed: form.isFixed,
    };

    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder)
      });
      if (res.ok) {
        fetchReminders();
        setShowForm(false);
        setForm({ title: "", description: "", date: "", time: "", type: "once", notifyEmail: false, notifyWhatsapp: false, whatsappNumber: "", email: "", isFixed: false });
      } else {
        alert("Erro ao salvar lembrete.");
      }
    } catch (error) {
      console.error("Error saving reminder:", error);
      alert("Erro ao salvar lembrete.");
    }
  };

  const toggleDone = async (reminder: Reminder) => {
    const newStatus = reminder.status === "done" ? "pending" : "done";
    try {
      const res = await fetch("/api/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reminder.id, status: newStatus })
      });
      if (res.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchReminders();
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  const sendWhatsApp = (r: Reminder) => {
    const msg = encodeURIComponent(`🔔 Lembrete MedCore\n\n*${r.title}*\n${r.description}\n📅 ${new Date(r.date).toLocaleDateString("pt-BR")} às ${r.time}`);
    window.open(`https://wa.me/${r.whatsappNumber}?text=${msg}`, "_blank");
  };

  const filtered = reminders.filter(r => {
    if (filter === "fixed") return r.isFixed;
    if (filter === "once") return r.type === "once";
    return true;
  });

  const urgent = reminders.filter(r => r.status === "pending" && daysUntil(r.date) <= 7).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest rounded-full">
              Central de Alertas
            </span>
            {urgent > 0 && (
              <span className="px-2 py-1 bg-error/10 border border-error/20 text-error text-sm font-semibold uppercase tracking-widest rounded-full flex items-center gap-1">
                <AlertTriangle size={9} /> {urgent} urgente{urgent > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface">
            Lembretes & <span className="text-gradient">Notificações</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{reminders.filter(r => r.status === "pending").length} pendentes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold">
          <Plus size={18} /> Novo Lembrete
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-2xl w-fit">
        {([["all", "Todos"], ["fixed", "Fixos 📌"], ["once", "Avulsos"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === val ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900/80 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-lg p-8 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
            <h2 className="font-heading text-2xl font-semibold text-white">Novo Lembrete</h2>
            <SafeInput className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" placeholder="Título *" value={form.title} onSafeChange={val => setForm({ ...form, title: val })} />
            <SafeInput as="textarea" className="resize-none h-20 w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" placeholder="Descrição..." value={form.description} onSafeChange={val => setForm({ ...form, description: val })} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Data *</label>
                <input type="date" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Hora</label>
                <input type="time" className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner [color-scheme:dark]" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 block ml-1">Recorrência</label>
                <select className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none transition-all shadow-inner" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ReminderType, isFixed: e.target.value !== "once" ? form.isFixed : false })}>
                  {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k} className="bg-zinc-800 text-white">{v.icon} {v.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 cursor-pointer mt-5 pl-2">
                  <input type="checkbox" className="w-4 h-4 accent-rd-cyan" checked={form.isFixed} onChange={e => setForm({ ...form, isFixed: e.target.checked })} />
                  <span className="text-sm font-medium text-white">📌 Lembrete Fixo</span>
                </label>
              </div>
            </div>

            {/* Notificações */}
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4 shadow-inner">
              <p className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em] mb-2 ml-1">Notificações</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-rd-cyan" checked={form.notifyEmail} onChange={e => setForm({ ...form, notifyEmail: e.target.checked })} />
                <Mail size={16} className="text-rd-cyan" />
                <span className="text-sm text-white font-medium">Enviar por Email</span>
              </label>
              {form.notifyEmail && (
                <SafeInput className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rd-cyan focus:ring-1 focus:ring-rd-cyan focus:outline-none shadow-inner" placeholder="email@hospital.com" value={form.email} onSafeChange={val => setForm({ ...form, email: val })} />
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={form.notifyWhatsapp} onChange={e => setForm({ ...form, notifyWhatsapp: e.target.checked })} />
                <MessageCircle size={16} className="text-emerald-500" />
                <span className="text-sm text-white font-medium">Enviar por WhatsApp</span>
              </label>
              {form.notifyWhatsapp && (
                <SafeInput className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none shadow-inner" placeholder="55119999... (com código do país)" value={form.whatsappNumber} onSafeChange={val => setForm({ ...form, whatsappNumber: val })} />
              )}
            </div>

            <div className="flex gap-4 pt-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all">Cancelar</button>
              <button onClick={handleSave} className="flex-1 btn-gradient py-3 rounded-xl text-sm font-semibold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]">Salvar Lembrete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map(reminder => {
          const days = daysUntil(reminder.date);
          const isUrgent = days <= 3 && reminder.status === "pending";
          const isOverdue = days < 0 && reminder.status === "pending";
          return (
            <div key={reminder.id} className={`group flex items-start gap-4 p-5 bg-surface rounded-2xl border transition-all shadow-sm ${reminder.status === "done" ? "opacity-50 border-outline-variant/30" : isOverdue ? "border-error/40 bg-red-50/50" : isUrgent ? "border-amber-400/40 bg-amber-50/50" : "border-outline-variant/40 hover:shadow-md"}`}>
              <button onClick={() => toggleDone(reminder)} className="mt-0.5 shrink-0">
                <CheckCircle2 size={20} className={reminder.status === "done" ? "text-emerald-500" : "text-outline-variant"} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {reminder.isFixed && <Pin size={12} className="text-primary shrink-0" />}
                  <span className={`font-heading font-medium text-sm ${reminder.status === "done" ? "line-through text-on-surface-variant" : "text-on-surface"}`}>{reminder.title}</span>
                  <span className="text-sm text-on-surface-variant">{TYPE_CONFIG[reminder.type].icon} {TYPE_CONFIG[reminder.type].label}</span>
                </div>
                {reminder.description && <p className="text-xs text-on-surface-variant mb-2">{reminder.description}</p>}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${isOverdue ? "bg-error/10 border-error/30 text-error" : isUrgent ? "bg-amber-100 border-amber-300 text-amber-700" : "bg-surface-container border-outline-variant/40 text-on-surface-variant"}`}>
                    {isOverdue ? `⚠️ ${Math.abs(days)}d atrasado` : days === 0 ? "Hoje" : `${days}d restantes`} · {new Date(reminder.date + "T00:00:00").toLocaleDateString("pt-BR")} {reminder.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {reminder.notifyWhatsapp && reminder.whatsappNumber && (
                  <button onClick={() => sendWhatsApp(reminder)} className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-100" title="Enviar WhatsApp">
                    <MessageCircle size={14} />
                  </button>
                )}
                <button onClick={() => deleteReminder(reminder.id)} className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center text-error hover:bg-error/20">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-sm font-medium">Nenhum lembrete aqui ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
