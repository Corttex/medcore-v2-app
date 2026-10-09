"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  MapPin, 
  User, 
  Phone, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  ChevronRight, 
  Activity,
  AlertCircle 
} from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sanitize } from "@/lib/sanitize";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Unit {
  id: string;
  name: string;
  type: "Hospital" | "UPA" | "Clínica" | "Policlínica" | "Centro Cirúrgico" | "Outro";
  address: string | null;
  responsible: string | null;
  phone: string | null;
  email: string | null;
  cnpj: string | null;
  active: boolean;
  color: string | null;
}

const UNIT_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500",
];

const UNIT_TYPES = ["Hospital", "UPA", "Clínica", "Policlínica", "Centro Cirúrgico", "Outro"] as const;

const initialUnits: Unit[] = [];

export default function UnitsPage() {
  const { selectedUnitId, setSelectedUnitId } = useDashboardContext();
  const { theme } = useTheme();
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [form, setForm] = useState({ name: "", type: "Hospital" as Unit["type"], address: "", responsible: "", phone: "", email: "", cnpj: "", color: UNIT_COLORS[0] });

  // Confirmation state
  const [confirmDelete, setConfirmDelete] = useState<Unit | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    fetch("/api/units")
      .then(res => res.json())
      .then(data => {
        if (data.units) setUnits(data.units);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (unit: Unit) => {
    setSelectedUnitId(unit.id);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;

    const sanitizedForm = {
      ...form,
      name: sanitize(form.name),
      address: sanitize(form.address),
      responsible: sanitize(form.responsible),
      phone: sanitize(form.phone),
      email: sanitize(form.email),
      cnpj: sanitize(form.cnpj),
    };

    if (editingUnit) {
      // Implementação futura de edição (PUT)
      setUnits(units.map(u => u.id === editingUnit.id ? { ...editingUnit, ...sanitizedForm } : u));
    } else {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedForm)
      });
      if (res.ok) {
        const data = await res.json();
        setUnits([...units, { ...data.unit, active: true }]);
      }
    }
    setShowForm(false);
    setEditingUnit(null);
    setForm({ name: "", type: "Hospital", address: "", responsible: "", phone: "", email: "", cnpj: "", color: UNIT_COLORS[0] });
  };

  const openEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setForm({ 
      name: unit.name, 
      type: unit.type, 
      address: unit.address || "", 
      responsible: unit.responsible || "", 
      phone: unit.phone || "", 
      email: unit.email || "", 
      cnpj: unit.cnpj || "", 
      color: unit.color || UNIT_COLORS[0] 
    });
    setShowForm(true);
  };

  const toggleActive = (id: string) => setUnits(units.map(u => u.id === id ? { ...u, active: !u.active } : u));
  
  const initiateDelete = (unit: Unit) => {
    setConfirmDelete(unit);
    setConfirmName("");
  };

  const executeDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/units/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updatedUnits = units.filter(u => u.id !== id);
        setUnits(updatedUnits);
        
        if (selectedUnitId === id || updatedUnits.length === 0) {
          setSelectedUnitId(null);
        }
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
      setConfirmName("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-3 py-1 border text-sm font-semibold uppercase tracking-widest rounded-full",
              theme === 'dark' ? "bg-primary/10 border-primary/20 text-primary" : "bg-primary/5 border-primary/10 text-primary"
            )}>
              Gestão de Rede
            </span>
          </div>
          <h1 className={cn(
            "font-heading text-4xl font-semibold tracking-tighter",
            theme === 'dark' ? "text-white" : "text-zinc-900"
          )}>
            Unidades <span className="text-gradient">Hospitalares</span>
          </h1>
          <p className={cn(
            "text-sm mt-1 font-medium",
            theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
          )}>{units.length} unidades cadastradas · {units.filter(u => u.active).length} ativas</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingUnit(null); }}
          className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl border shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-lg p-8 space-y-6 animate-in fade-in zoom-in-95 backdrop-blur-2xl",
            theme === 'dark' ? "bg-zinc-900/80 border-white/10" : "bg-white/90 border-zinc-200"
          )}>
            <h2 className={cn(
              "font-heading text-2xl font-semibold ",
              theme === 'dark' ? "text-white" : "text-zinc-900"
            )}>
              {editingUnit ? "Editar Unidade" : "Nova Unidade"}
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={cn(
                  "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                  theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                )}>Nome da Unidade *</label>
                <input
                  className={cn(
                    "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                    theme === 'dark' 
                      ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                      : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                  )}
                  placeholder="Ex: Hospital São Lucas"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>Tipo</label>
                  <select
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan appearance-none",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as Unit["type"] })}
                  >
                    {UNIT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={cn(
                    "text-sm font-semibold uppercase tracking-widest mb-1.5 block",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Destaque Visual</label>
                  <div className="flex gap-2">
                    {UNIT_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        className={cn(
                          "w-8 h-8 rounded-full bg-gradient-to-r transition-all ring-offset-2",
                          c,
                          form.color === c ? (theme === 'dark' ? "ring-2 ring-rd-cyan" : "ring-2 ring-rd-cyan") : ""
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>CNPJ</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    placeholder="00.000.000/0000-00"
                    value={form.cnpj}
                    onChange={e => setForm({ ...form, cnpj: e.target.value })}
                  />
                </div>
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>Endereço Operacional</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    placeholder="Rua, número — Bairro"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>Responsável Técnico</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    placeholder="Dr. Nome"
                    value={form.responsible}
                    onChange={e => setForm({ ...form, responsible: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>Telefone Contato</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    placeholder="(11) 0000-0000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className={cn(
                    "text-sm font-bold uppercase tracking-[0.15em] mb-2 block ml-1",
                    theme === 'dark' ? "text-zinc-300" : "text-zinc-500"
                  )}>E-mail Oficial</label>
                  <input
                    type="email"
                    className={cn(
                      "w-full rounded-xl px-4 py-3.5 text-sm font-medium outline-none border transition-all shadow-inner focus:ring-1 focus:ring-rd-cyan",
                      theme === 'dark' 
                        ? "bg-black/20 backdrop-blur-md border-white/10 text-white focus:border-rd-cyan [color-scheme:dark]" 
                        : "bg-black/5 backdrop-blur-md border-zinc-300 text-zinc-900 focus:border-rd-cyan"
                    )}
                    placeholder="contato@hospital.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => { setShowForm(false); setEditingUnit(null); }} 
                className={cn(
                  "flex-1 py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest transition-colors border",
                  theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-800" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200"
                )}
              >
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 btn-gradient py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest shadow-lg shadow-primary/20">
                {editingUnit ? "Salvar Alterações" : "Criar Unidade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {units.map(unit => (
          <div key={unit.id} className={cn(
            "group relative rounded-3xl border shadow-sm hover:shadow-xl transition-all overflow-hidden duration-500",
            theme === 'dark' ? "bg-zinc-900/40 border-zinc-800/40" : "bg-white border-zinc-200",
            !unit.active && "opacity-60"
          )}>
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${unit.color}`} />

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center shadow-lg shadow-black/10`}>
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-heading font-semibold text-sm leading-tight ",
                      theme === 'dark' ? "text-white" : "text-zinc-900"
                    )}>{unit.name}</h3>
                    <span className={cn(
                      "text-sm font-semibold uppercase tracking-widest",
                      theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                    )}>{unit.type}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button onClick={() => openEdit(unit)} className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                    theme === 'dark' ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                  )}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => initiateDelete(unit)} className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                    theme === 'dark' ? "bg-red-500/10 hover:bg-red-500/20 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-500"
                  )}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {unit.address && (
                  <div className={cn(
                    "flex items-center gap-2 text-[11px] font-medium",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <MapPin size={12} className="shrink-0 text-rd-cyan/60" />
                    <span className="truncate">{unit.address}</span>
                  </div>
                )}
                {unit.responsible && (
                  <div className={cn(
                    "flex items-center gap-2 text-[11px] font-medium",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <User size={12} className="shrink-0 text-rd-cyan/60" />
                    <span>{unit.responsible}</span>
                  </div>
                )}
                {unit.phone && (
                  <div className={cn(
                    "flex items-center gap-2 text-[11px] font-medium",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <Phone size={12} className="shrink-0 text-rd-cyan/60" />
                    <span>{unit.phone}</span>
                  </div>
                )}
              </div>

              <div className={cn(
                "flex items-center justify-between pt-4 border-t",
                theme === 'dark' ? "border-zinc-800/50" : "border-zinc-100"
              )}>
                <button
                  onClick={() => toggleActive(unit.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest transition-colors",
                    unit.active ? "text-emerald-500" : "text-zinc-500"
                  )}
                >
                  <CheckCircle2 size={12} />
                  {unit.active ? "Ativa" : "Inativa"}
                </button>
                <button
                  onClick={() => handleSelect(unit)}
                  className={cn(
                    "flex items-center gap-2 transition-all p-2.5 rounded-xl text-sm font-semibold uppercase tracking-widest border group/btn",
                    theme === 'dark' 
                      ? "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-rd-cyan hover:border-rd-cyan/40" 
                      : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:text-rd-cyan hover:border-rd-cyan/20 shadow-sm"
                  )}
                >
                  <Activity size={14} className="group-hover/btn:animate-pulse" />
                  Gerenciar
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl border shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95 backdrop-blur-2xl",
            theme === 'dark' ? "bg-zinc-900/80 border-white/10" : "bg-white/90 border-zinc-200"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto border",
              theme === 'dark' ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100"
            )}>
              <AlertCircle size={32} />
            </div>
            
            <div className="text-center space-y-3">
              <h2 className={cn(
                "font-heading text-xl font-semibold uppercase tracking-tight",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>Zona de Perigo</h2>
              <p className={cn(
                "text-sm leading-relaxed font-medium",
                theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
              )}>
                Esta ação é <strong>IRREVERSÍVEL</strong>. Todas as contas, convênios e configurações atreladas ao hospital <span className="text-red-500 font-bold">{confirmDelete.name}</span> serão permanentemente excluídas e você receberá uma notificação via e-mail sobre a eliminação.
              </p>
            </div>

            <div className={cn(
              "p-4 rounded-2xl border text-center",
              theme === 'dark' ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-100"
            )}>
               <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                 Para prosseguir, digite o nome exato em <strong className="text-red-500">CAPS LOCK</strong>:
               </p>
               <input 
                 type="text"
                 placeholder={confirmDelete.name.toUpperCase()}
                 value={confirmName}
                 onChange={(e) => setConfirmName(e.target.value)}
                 className={cn(
                   "w-full text-center rounded-xl px-4 py-3 text-sm font-bold tracking-widest outline-none border transition-all shadow-inner focus:ring-1 focus:ring-red-500",
                   theme === 'dark' 
                     ? "bg-black/40 border-red-500/20 text-red-400 focus:border-red-500" 
                     : "bg-white border-red-200 text-red-600 focus:border-red-500"
                 )}
               />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => executeDelete(confirmDelete.id)}
                disabled={isDeleting || confirmName !== confirmDelete.name.toUpperCase()}
                className="btn-gradient-brand !from-red-600 !to-red-800 w-full py-4 rounded-2xl font-semibold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo Base de Dados...
                  </>
                ) : (
                  <>Excluir Unidade Permanentemente</>
                )}
              </button>
              <button 
                onClick={() => { setConfirmDelete(null); setConfirmName(""); }}
                className={cn(
                  "w-full py-3 rounded-2xl text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  theme === 'dark' ? "text-zinc-500 hover:bg-zinc-800" : "text-zinc-400 hover:bg-zinc-50"
                )}
                disabled={isDeleting}
              >
                Cancelar Operação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
