"use client";

import React, { useState, useRef } from "react";
import { Plus, Users, MapPin, FileText, Clock, Coffee, Monitor, Download, X, ChevronDown, Loader2, Sparkles } from "lucide-react";

interface Guest { name: string; role: string; }
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

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Alinhamento de Gestão Clínica",
    date: "2026-04-12",
    time: "08:00",
    duration: "1h",
    type: "Presencial",
    location: "Sala de Conferência A",
    guests: [{ name: "Dr. Thorne", role: "CMO" }, { name: "Dra. Helena", role: "Diretora Clínica" }],
    subject: "Revisão de protocolos e indicadores mensais",
    agenda: "1. Indicadores clínicos\n2. Revisão de protocolos\n3. Próximos passos",
    minutes: "",
    food: "Café e pão de queijo",
    equipment: "Projetor, TV",
    deadlines: "Enviar relatório até 15/04",
    status: "Agendada",
  },
];

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
  const [guestInput, setGuestInput] = useState({ name: "", role: "" });

  const addGuest = () => {
    if (!guestInput.name.trim()) return;
    setForm(f => ({ ...f, guests: [...f.guests, { ...guestInput }] }));
    setGuestInput({ name: "", role: "" });
  };

  const saveMeeting = () => {
    if (!form.title.trim() || !form.date) return;
    if (selected) {
      setMeetings(m => m.map(x => x.id === selected.id ? { ...form, id: selected.id } : x));
      setSelected({ ...form, id: selected.id });
    } else {
      const newM = { ...form, id: Date.now().toString() };
      setMeetings(m => [...m, newM]);
    }
    setShowForm(false);
    setForm(emptyForm);
  };

  const openEdit = (m: Meeting) => {
    setSelected(m);
    setForm({ ...m });
    setShowForm(true);
  };

  const generateAIMinutes = async (m: Meeting) => {
    setAiLoading(true);
    try {
      const { callAI } = await import("@/modules/shared/services/openrouter");
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
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Demandas Internas</span>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface mt-2">
            Reuniões & <span className="text-gradient">Escala</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {todayMeetings.length} hoje · {upcoming.length} próximas · {past.length} concluídas
          </p>
        </div>
        <button onClick={() => { setSelected(null); setForm(emptyForm); setShowForm(true); }} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black">
          <Plus size={18} /> Nova Reunião
        </button>
      </div>

      {/* Today's schedule */}
      {todayMeetings.length > 0 && (
        <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">📅 Escala de Hoje</p>
          <div className="space-y-2">
            {todayMeetings.map(m => (
              <div key={m.id} onClick={() => setSelected(m)} className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-outline-variant/40 cursor-pointer hover:shadow-sm transition-all">
                <div className="text-center w-12 shrink-0">
                  <p className="font-black text-sm text-primary">{m.time}</p>
                  <p className="text-[10px] text-on-surface-variant">{m.duration}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-on-surface">{m.title}</p>
                  <p className="text-xs text-on-surface-variant">{m.location} · {m.type}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${STATUS_COLORS[m.status]}`}>{m.status}</span>
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
                  <h2 className="font-heading text-xl font-black text-on-surface">{selected.title}</h2>
                  <p className="text-sm text-on-surface-variant">{new Date(selected.date).toLocaleDateString("pt-BR")} às {selected.time} · {selected.duration} · {selected.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(selected)} className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-on-surface-variant hover:text-on-surface border border-outline-variant/40">Editar</button>
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
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Participantes</p>
                <div className="flex flex-wrap gap-2">
                  {selected.guests.map((g, i) => (
                    <span key={i} className="px-3 py-1 bg-surface-container border border-outline-variant/40 text-xs font-bold rounded-full text-on-surface">{g.name} <span className="text-on-surface-variant font-normal">· {g.role}</span></span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Pauta</p>
                <pre className="text-sm text-on-surface whitespace-pre-wrap font-body">{selected.agenda || "—"}</pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Ata da Reunião</p>
                  <button
                    onClick={() => generateAIMinutes(selected)}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary-container text-white text-[10px] font-black shadow-sm hover:shadow-primary/30 transition-all disabled:opacity-60"
                  >
                    {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                    {aiLoading ? "Gerando..." : "Gerar com IA"}
                  </button>
                </div>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary resize-none h-48"
                  placeholder="Registre as notas e decisões da reunião aqui..."
                  value={selected.minutes}
                  onChange={e => {
                    const updated = { ...selected, minutes: e.target.value };
                    setSelected(updated);
                    setMeetings(m => m.map(x => x.id === selected.id ? updated : x));
                  }}
                />
              </div>
            </div>

            {/* Export buttons */}
            <div className="flex gap-3">
              <button onClick={() => exportPDF(selected)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-black hover:bg-red-100 transition-colors">
                <Download size={16} /> Exportar PDF
              </button>
              <button onClick={() => exportExcel(selected)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-black hover:bg-emerald-100 transition-colors">
                <Download size={16} /> Exportar Excel
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">Outras Reuniões</p>
              <div className="space-y-2">
                {meetings.filter(m => m.id !== selected.id).map(m => (
                  <button key={m.id} onClick={() => setSelected(m)} className="w-full text-left p-3 rounded-xl hover:bg-surface-container border border-outline-variant/30 transition-colors">
                    <p className="text-xs font-bold text-on-surface truncate">{m.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{new Date(m.date).toLocaleDateString("pt-BR")} · {m.time}</p>
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
                <p className="font-heading font-black text-sm text-on-surface">{m.time}</p>
                <p className="text-[10px] text-on-surface-variant">{m.date === today ? "Hoje" : new Date(m.date).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{m.title}</p>
                <p className="text-xs text-on-surface-variant truncate">{m.type} · {m.location} · {m.guests.length} participante{m.guests.length !== 1 ? "s" : ""}</p>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[m.status]}`}>{m.status}</span>
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
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-2xl p-8 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black text-on-surface">{selected ? "Editar Reunião" : "Nova Reunião"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant"><X size={16} /></button>
            </div>

            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Título da reunião *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Data *</label>
                <input type="date" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
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
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Tipo</label>
                <select className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Meeting["type"] })}>
                  {["Presencial","Online","Híbrida"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Local / Link da reunião" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

            {/* Guests */}
            <div>
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 block">Convidados</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Nome" value={guestInput.name} onChange={e => setGuestInput({ ...guestInput, name: e.target.value })} onKeyDown={e => e.key === "Enter" && addGuest()} />
                <input className="w-28 bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Cargo" value={guestInput.role} onChange={e => setGuestInput({ ...guestInput, role: e.target.value })} onKeyDown={e => e.key === "Enter" && addGuest()} />
                <button onClick={addGuest} className="px-3 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm border border-primary/20 hover:bg-primary/20"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.guests.map((g, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 bg-surface-container border border-outline-variant/40 text-xs rounded-full">
                    {g.name} · {g.role}
                    <button onClick={() => setForm(f => ({ ...f, guests: f.guests.filter((_, j) => j !== i) }))} className="ml-1 text-error hover:text-error/80"><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-20" placeholder="Assunto / Objetivo da reunião" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            <textarea className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none h-24" placeholder="Pauta (itens numerados)" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="☕ Alimentação" value={form.food} onChange={e => setForm({ ...form, food: e.target.value })} />
              <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="🖥️ Equipamentos" value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })} />
            </div>
            <input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="⏰ Prazos e ações definidas" value={form.deadlines} onChange={e => setForm({ ...form, deadlines: e.target.value })} />

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold">Cancelar</button>
              <button onClick={saveMeeting} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">Salvar Reunião</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
