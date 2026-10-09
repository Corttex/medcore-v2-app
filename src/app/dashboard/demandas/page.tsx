"use client";

import React, { useState, useRef } from "react";
import { Plus, Users, MapPin, FileText, Clock, Coffee, Monitor, Download, X, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import { SafeInput } from "@/components/ui/SafeInput";

interface Guest { name: string; role: string; contact?: string; }
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: "Presencial" | "Online" | "Híbrida";
  location: string;
  guests: Guest[];
  subject: string;
  agenda: string;
  minutes: string; // ata
  food: string;
  equipment: string;
  deadlines: string;
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
}

const STATUS_COLORS = {
  "Agendada":     "bg-blue-50 border-blue-200 text-blue-700",
  "Em Andamento": "bg-primary/10 border-primary/30 text-primary",
  "Concluída":    "bg-emerald-50 border-emerald-200 text-emerald-700",
  "Cancelada":    "bg-red-50 border-red-200 text-error",
};

const INITIAL_MEETINGS: Meeting[] = [];

export default function DemandasPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const emptyForm: Omit<Meeting, "id"> = {
    title: "", date: "", time: "", duration: "1h", type: "Presencial",
    location: "", guests: [], subject: "", agenda: "", minutes: "",
    food: "", equipment: "", deadlines: "", status: "Agendada",
  };
  const [form, setForm] = useState(emptyForm);
  const [guestInput, setGuestInput] = useState({ name: "", role: "", contact: "" });
  const [requestOS, setRequestOS] = useState(false);

  const addGuest = () => {
    if (!guestInput.name.trim()) return;
    setForm(f => ({
      ...f,
      guests: [...f.guests, { name: guestInput.name.trim(), role: guestInput.role.trim(), contact: guestInput.contact.trim() }]
    }));
    setGuestInput({ name: "", role: "", contact: "" });
  };

  const saveMeeting = async () => {
    if (!form.title.trim() || !form.date) return;
    const sanitizedForm = {
        ...form,
        title: form.title,
        location: form.location,
        subject: form.subject,
        agenda: form.agenda,
        minutes: form.minutes,
        food: form.food,
        equipment: form.equipment,
        deadlines: form.deadlines,
    };
    if (selected) {
      setMeetings(m => m.map(x => x.id === selected.id ? { ...sanitizedForm, id: selected.id } : x));
      setSelected({ ...sanitizedForm, id: selected.id });
    } else {
      const newM = { ...sanitizedForm, id: Date.now().toString() };
      setMeetings(m => [...m, newM]);
    }

    if (requestOS && form.equipment.trim()) {
      try {
        await fetch("/api/os", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoria: "Equipamento para Reunião",
            descricao: `Solicitação de Equipamento para Reunião (${form.title}): ${form.equipment}`,
            prioridade: "Média",
          }),
        });
      } catch (err) {
        console.error("Erro ao criar Ordem de Serviço:", err);
      }
    }

    setShowForm(false);
    setForm(emptyForm);
    setRequestOS(false);
  };

  const openEdit = (m: Meeting) => {
    setSelected(m);
    setForm({ ...m });
    setShowForm(true);
  };

  const generateAIMinutes = async (m: Meeting) => {
    setAiLoading(true);
    try {
      const { callAI } = await import("@/lib/services/openrouter");
      const prompt = `Gere uma ATA profissional de reunião com base nas informações:
Título: ${m.title}
Data: ${m.date} às ${m.time}
Tipo: ${m.type} | Local: ${m.location}
Participantes: ${m.guests.map(g => `${g.name} (${g.role})`).join(", ")}
Assunto: ${m.subject}
Pauta: ${m.agenda}
Solicitações: Alimentação: ${m.food} | Equipamentos: ${m.equipment}
Prazos: ${m.deadlines}

Gere uma ata formal, objetiva e em português brasileiro, com cabeçalho, corpo e assinaturas.`;
      const result = await callAI([{ role: "user", content: prompt }]);
      const updated = { ...m, minutes: result };
      setMeetings(prev => prev.map(x => x.id === m.id ? updated : x));
      setSelected(updated);
    } catch (e) {
      alert("Erro ao gerar ata com IA. Verifique sua chave do OpenRouter.");
    }
    setAiLoading(false);
  };

  const exportPDF = async (m: Meeting) => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ATA DE REUNIÃO", 105, 20, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const lines = [
      `Título: ${m.title}`,
      `Data: ${new Date(m.date).toLocaleDateString("pt-BR")} às ${m.time}`,
      `Duração: ${m.duration}`,
      `Tipo: ${m.type}  |  Local: ${m.location}`,
      `Status: ${m.status}`,
      "",
      "PARTICIPANTES:",
      ...m.guests.map(g => `  • ${g.name} — ${g.role}`),
      "",
      "ASSUNTO:",
      m.subject,
      "",
      "PAUTA:",
      m.agenda,
      "",
      "ATA / NOTAS:",
      m.minutes || "(sem ata registrada)",
      "",
      "LOGÍSTICA:",
      `  Alimentação: ${m.food}`,
      `  Equipamentos: ${m.equipment}`,
      "",
      "PRAZOS E AÇÕES:",
      m.deadlines,
    ];
    let y = 32;
    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }
      const split = doc.splitTextToSize(line, 180);
      doc.text(split, 15, y);
      y += split.length * 6;
    });
    doc.save(`ata-${m.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const exportExcel = async (m: Meeting) => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.aoa_to_sheet([
      ["ATA DE REUNIÃO — MEDCORE"],
      [],
      ["Título", m.title],
      ["Data", new Date(m.date).toLocaleDateString("pt-BR")],
      ["Hora", m.time],
      ["Duração", m.duration],
      ["Tipo", m.type],
      ["Local", m.location],
      ["Status", m.status],
      [],
      ["PARTICIPANTES"],
      ["Nome", "Cargo"],
      ...m.guests.map(g => [g.name, g.role]),
      [],
      ["ASSUNTO"],
      [m.subject],
      [],
      ["PAUTA"],
      [m.agenda],
      [],
      ["ATA / NOTAS"],
      [m.minutes || "(sem ata)"],
      [],
      ["LOGÍSTICA"],
      ["Alimentação", m.food],
      ["Equipamentos", m.equipment],
      [],
      ["PRAZOS / AÇÕES"],
      [m.deadlines],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reunião");
    XLSX.writeFile(wb, `reuniao-${m.title.replace(/\s+/g, "-").toLowerCase()}.xlsx`);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayMeetings = meetings.filter(m => m.date === today);
  const upcoming = meetings.filter(m => m.date > today).sort((a, b) => a.date.localeCompare(b.date));
  const past = meetings.filter(m => m.date < today);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-widest rounded-full">Demandas Internas</span>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-on-surface mt-2">
            Reuniões & <span className="text-gradient">Escala</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {todayMeetings.length} hoje · {upcoming.length} próximas · {past.length} concluídas
          </p>
        </div>
        <button onClick={() => { setSelected(null); setForm(emptyForm); setShowForm(true); }} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold">
          <Plus size={18} /> Nova Reunião
        </button>
      </div>

      {/* Today's schedule */}
      {todayMeetings.length > 0 && (
        <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">📅 Escala de Hoje</p>
          <div className="space-y-2">
            {todayMeetings.map(m => (
              <div key={m.id} onClick={() => setSelected(m)} className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-outline-variant/40 cursor-pointer hover:shadow-sm transition-all">
                <div className="text-center w-12 shrink-0">
                  <p className="font-semibold text-sm text-primary">{m.time}</p>
                  <p className="text-sm text-on-surface-variant">{m.duration}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-on-surface">{m.title}</p>
                  <p className="text-xs text-on-surface-variant">{m.location} · {m.type}</p>
                </div>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[m.status]}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting detail panel */}
      {selected && !showForm && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-on-surface">{selected.title}</h2>
                  <p className="text-sm text-on-surface-variant">{new Date(selected.date).toLocaleDateString("pt-BR")} às {selected.time} · {selected.duration} · {selected.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(selected)} className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-medium text-on-surface-variant hover:text-on-surface border border-outline-variant/40">Editar</button>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={14} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-on-surface-variant"><MapPin size={14}/> {selected.location || "—"}</div>
                <div className="flex items-center gap-2 text-on-surface-variant"><Coffee size={14}/> {selected.food || "—"}</div>
                <div className="flex items-center gap-2 text-on-surface-variant"><Monitor size={14}/> {selected.equipment || "—"}</div>
                <div className="flex items-center gap-2 text-on-surface-variant"><Clock size={14}/> {selected.deadlines || "—"}</div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Participantes</p>
                <div className="flex flex-wrap gap-2">
                  {selected.guests.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-surface-container border border-outline-variant/40 text-xs font-medium rounded-full text-on-surface">{g.name} <span className="text-on-surface-variant font-normal">· {g.role}</span></span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Pauta</p>
                <pre className="text-sm text-on-surface whitespace-pre-wrap font-body">{selected.agenda || "—"}</pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Ata da Reunião</p>
                  <button
                    onClick={() => generateAIMinutes(selected)}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-sm font-semibold shadow-sm hover:shadow-primary/30 transition-all disabled:opacity-60"
                  >
                    {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                    {aiLoading ? "Gerando..." : "Gerar com IA"}
                  </button>
                </div>
                <SafeInput
                  as="textarea"
                  className="resize-none h-48"
                  placeholder="Registre as notas e decisões da reunião aqui..."
                  value={selected.minutes}
                  onSafeChange={val => {
                    const updated = { ...selected, minutes: val };
                    setSelected(updated);
                    setMeetings(m => m.map(x => x.id === selected.id ? updated : x));
                  }}
                />
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex gap-3">
              <button onClick={() => exportPDF(selected)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors">
                <Download size={16} /> Exportar PDF
              </button>
              <button onClick={() => exportExcel(selected)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors">
                <Download size={16} /> Exportar Excel
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-3">Outras Reuniões</p>
              <div className="space-y-2">
                {meetings.filter(m => m.id !== selected.id).map(m => (
                  <button key={m.id} onClick={() => setSelected(m)} className="w-full text-left p-3 rounded-xl hover:bg-surface-container border border-outline-variant/30 transition-colors">
                    <p className="text-xs font-medium text-on-surface truncate">{m.title}</p>
                    <p className="text-sm text-on-surface-variant">{new Date(m.date).toLocaleDateString("pt-BR")} · {m.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All meetings list */}
      {!selected && (
        <div className="space-y-3">
          {meetings.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} className="flex items-center gap-5 p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md cursor-pointer transition-all group">
              <div className="text-center w-14 shrink-0">
                <p className="font-heading font-semibold text-sm text-on-surface">{m.time}</p>
                <p className="text-sm text-on-surface-variant">{m.date === today ? "Hoje" : new Date(m.date).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-on-surface group-hover:text-primary transition-colors">{m.title}</p>
                <p className="text-xs text-on-surface-variant truncate">{m.type} · {m.location} · {m.guests.length} participante{m.guests.length !== 1 ? "s" : ""}</p>
              </div>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[m.status]}`}>{m.status}</span>
            </div>
          ))}
          {meetings.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma reunião cadastrada ainda.</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl border border-zinc-700 shadow-2xl w-full max-w-2xl text-white flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header (Fixo no topo) */}
            <div className="p-6 sm:px-8 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900 z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rd-cyan shadow-[0_0_10px_#00A9FF]" />
                <h2 className="font-heading text-2xl font-bold text-white">{selected ? "Editar Reunião" : "Nova Reunião"}</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"><X size={18} /></button>
            </div>

            {/* Scroll Indicator Top Arrow */}
            <div className="bg-zinc-950/90 py-1.5 px-4 text-center border-b border-zinc-800 flex items-center justify-center gap-2 text-[11px] font-bold text-rd-cyan uppercase tracking-wider shrink-0 shadow-sm">
              <ChevronUp size={14} className="animate-bounce text-rd-cyan" /> Role a página para ver todos os campos <ChevronUp size={14} className="animate-bounce text-rd-cyan" />
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto custom-blue-scrollbar flex-1 bg-zinc-900">
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Título da Reunião *</label>
                <SafeInput className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Ex: Alinhamento de Escala de Plantão" value={form.title} onSafeChange={val => setForm({ ...form, title: val })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Data *</label>
                  <input type="date" className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Horário *</label>
                  <input type="time" className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Duração</label>
                  <select className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
                    {["30min","45min","1h","1h30","2h","3h"].map(d => <option key={d} className="bg-zinc-900 text-white">{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Tipo</label>
                  <select className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Meeting["type"] })}>
                    {["Presencial","Online","Híbrida"].map(t => <option key={t} className="bg-zinc-900 text-white">{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Local ou Link da Reunião</label>
                <SafeInput className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Ex: Sala de Reunião 2 / Google Meet link" value={form.location} onSafeChange={val => setForm({ ...form, location: val })} />
              </div>

              {/* Convidados Sub-form */}
              <div className="bg-zinc-950 p-5 rounded-2xl border-2 border-zinc-800 space-y-3">
                <label className="text-xs font-bold text-rd-cyan uppercase tracking-wider block">Convidados / Participantes</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <SafeInput className="bg-zinc-900 border border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-3 py-2 text-sm font-medium outline-none [color-scheme:dark]" placeholder="Nome Completo *" value={guestInput.name} onSafeChange={val => setGuestInput({ ...guestInput, name: val })} onKeyDown={e => e.key === "Enter" && addGuest()} />
                  <SafeInput className="bg-zinc-900 border border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-3 py-2 text-sm font-medium outline-none [color-scheme:dark]" placeholder="Cargo / Função (ex: Médico)" value={guestInput.role} onSafeChange={val => setGuestInput({ ...guestInput, role: val })} onKeyDown={e => e.key === "Enter" && addGuest()} />
                  <div className="flex gap-2">
                    <SafeInput className="bg-zinc-900 border border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-3 py-2 text-sm font-medium outline-none flex-1 [color-scheme:dark]" placeholder="Email ou WhatsApp" value={guestInput.contact} onSafeChange={val => setGuestInput({ ...guestInput, contact: val })} onKeyDown={e => e.key === "Enter" && addGuest()} />
                    <button type="button" onClick={addGuest} className="px-3.5 py-2 bg-rd-cyan text-zinc-950 font-bold hover:bg-rd-cyan/90 rounded-xl text-sm transition-colors flex items-center shrink-0">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {form.guests.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {form.guests.map((g, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-700 text-xs rounded-xl text-white">
                        <div className="font-semibold text-white">{g.name}</div>
                        {g.role && <div className="text-zinc-400">· {g.role}</div>}
                        {g.contact && <div className="text-rd-cyan font-mono">({g.contact})</div>}
                        <button type="button" onClick={() => setForm(f => ({ ...f, guests: f.guests.filter((_, j) => j !== i) }))} className="ml-1 text-zinc-400 hover:text-red-400"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Assunto / Objetivo da Reunião</label>
                <SafeInput as="textarea" className="resize-none h-20 w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Descreva sucintamente o objetivo principal..." value={form.subject} onSafeChange={val => setForm({ ...form, subject: val })} />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">Pauta (Itens Numerados)</label>
                <SafeInput as="textarea" className="resize-none h-24 w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="1. Aprovação da ata anterior&#10;2. Apresentação dos indicadores&#10;3. Planejamento do próximo mês" value={form.agenda} onSafeChange={val => setForm({ ...form, agenda: val })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">☕ Alimentação / Coffee Break</label>
                  <SafeInput className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Ex: Café, água e biscoitos para 10 pessoas" value={form.food} onSafeChange={val => setForm({ ...form, food: val })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">🖥️ Equipamentos Necessários</label>
                  <SafeInput className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Ex: Projetor HDMI, Caixa de Som" value={form.equipment} onSafeChange={val => setForm({ ...form, equipment: val })} />
                </div>
              </div>

              {/* Auto OS Request toggle */}
              <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <input
                  type="checkbox"
                  id="requestOS"
                  checked={requestOS}
                  onChange={e => setRequestOS(e.target.checked)}
                  className="w-4 h-4 accent-rd-cyan rounded cursor-pointer"
                />
                <label htmlFor="requestOS" className="text-xs font-medium text-zinc-300 cursor-pointer select-none">
                  Solicitar Ordem de Serviço (OS) de TI / Manutenção automaticamente para estes equipamentos caso não estejam disponíveis no patrimônio
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5 block">⏰ Prazos e Ações Definidas</label>
                <SafeInput className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-rd-cyan text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rd-cyan/30 outline-none transition-all shadow-md [color-scheme:dark]" placeholder="Ex: Envio do relatório até sexta-feira" value={form.deadlines} onSafeChange={val => setForm({ ...form, deadlines: val })} />
              </div>
            </div>

            {/* Scroll Indicator Bottom Arrow */}
            <div className="bg-zinc-950/90 py-1.5 px-4 text-center border-t border-zinc-800 flex items-center justify-center gap-2 text-[11px] font-bold text-rd-cyan uppercase tracking-wider shrink-0 shadow-sm">
              <ChevronDown size={14} className="animate-bounce text-rd-cyan" /> Ações sempre fixas abaixo <ChevronDown size={14} className="animate-bounce text-rd-cyan" />
            </div>

            {/* Sticky Action Footer (Sempre visível no rodapé, sem precisar rolar até o final) */}
            <div className="p-5 sm:px-8 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md flex gap-4 shrink-0 shadow-2xl z-20">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 text-sm font-bold transition-all shadow-sm">
                Descartar / Cancelar
              </button>
              <button type="button" onClick={saveMeeting} className="flex-1 btn-gradient py-3.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)]">
                Salvar Reunião
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
