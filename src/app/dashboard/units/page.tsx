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
  address: string;
  responsible: string;
  phone: string;
  active: boolean;
  color: string;
}

const UNIT_COLORS = [
  "from-blue-500 to-cyan-500",
  "from-teal-500 to-emerald-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500",
];

const UNIT_TYPES = ["Hospital", "UPA", "Clínica", "Policlínica", "Centro Cirúrgico", "Outro"] as const;

const initialUnits: Unit[] = [
  { id: "1", name: "Hospital Central São Lucas", type: "Hospital", address: "Av. Principal, 1000 — Centro", responsible: "Dr. Thorne", phone: "(11) 3000-0001", active: true, color: UNIT_COLORS[0] },
  { id: "2", name: "UPA Norte", type: "UPA", address: "Rua das Flores, 200 — Zona Norte", responsible: "Dra. Helena", phone: "(11) 3000-0002", active: true, color: UNIT_COLORS[1] },
];

export default function UnitsPage() {
  const { selectedUnitId, setSelectedUnitId } = useDashboardContext();
  const { theme } = useTheme();
  const router = useRouter();
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [form, setForm] = useState({ name: "", type: "Hospital" as Unit["type"], address: "", responsible: "", phone: "", color: UNIT_COLORS[0] });

  // Confirmation state
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const handleSelect = (unit: Unit) => {
    setSelectedUnitId(unit.id);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const sanitizedForm = {
      ...form,
      name: sanitize(form.name),
      address: sanitize(form.address),
      responsible: sanitize(form.responsible),
      phone: sanitize(form.phone),
    };

    if (editingUnit) {
      setUnits(units.map(u => u.id === editingUnit.id ? { ...editingUnit, ...sanitizedForm } : u));
    } else {
      const newId = Date.now().toString();
      setUnits([...units, { ...sanitizedForm, id: newId, active: true }]);
    }
    setShowForm(false);
    setEditingUnit(null);
    setForm({ name: "", type: "Hospital", address: "", responsible: "", phone: "", color: UNIT_COLORS[0] });
  };

  const openEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setForm({ name: unit.name, type: unit.type, address: unit.address, responsible: unit.responsible, phone: unit.phone, color: unit.color });
    setShowForm(true);
  };

  const toggleActive = (id: string) => setUnits(units.map(u => u.id === id ? { ...u, active: !u.active } : u));
  
  const initiateDelete = (id: string) => {
    // Rule: Units older than 3 days (mocked) require email confirmation
    const isOld = true; // Simulating old unit for demonstration
    if (isOld) {
      setConfirmDelete(id);
    } else {
      if (confirm("Deseja realmente excluir esta unidade?")) {
        executeDelete(id);
      }
    }
  };

  const executeDelete = (id: string) => {
    const updatedUnits = units.filter(u => u.id !== id);
    setUnits(updatedUnits);
    setConfirmDelete(null);

    // Safety logic: If deleted unit was selected, or no units left, reset selection
    if (selectedUnitId === id || updatedUnits.length === 0) {
      setSelectedUnitId(null);
    }
  };

  const handleEmailVerification = () => {
    setIsVerifyingEmail(true);
    // Simulating email auth flow
    setTimeout(() => {
      if (confirmDelete) {
        executeDelete(confirmDelete);
      }
      setIsVerifyingEmail(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-3 py-1 border text-[10px] font-black uppercase tracking-widest rounded-full",
              theme === 'dark' ? "bg-primary/10 border-primary/20 text-primary" : "bg-primary/5 border-primary/10 text-primary"
            )}>
              Gestão de Rede
            </span>
          </div>
          <h1 className={cn(
            "font-heading text-4xl font-black tracking-tighter",
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
          className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl border shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in fade-in zoom-in-95",
            theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
          )}>
            <h2 className={cn(
              "font-heading text-2xl font-black italic",
              theme === 'dark' ? "text-white" : "text-zinc-900"
            )}>
              {editingUnit ? "Editar Unidade" : "Nova Unidade"}
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>Nome da Unidade *</label>
                <input
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all",
                    theme === 'dark' 
                      ? "bg-zinc-950 border-zinc-800 text-white focus:border-brand/50" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-brand/50"
                  )}
                  placeholder="Ex: Hospital São Lucas"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Tipo</label>
                  <select
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-sm font-bold border outline-none appearance-none",
                      theme === 'dark' 
                        ? "bg-zinc-950 border-zinc-800 text-white" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-900"
                    )}
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as Unit["type"] })}
                  >
                    {UNIT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
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
                          form.color === c ? (theme === 'dark' ? "ring-2 ring-brand" : "ring-2 ring-brand") : ""
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
                  theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                )}>Endereço Operacional</label>
                <input
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all",
                    theme === 'dark' 
                      ? "bg-zinc-950 border-zinc-800 text-white focus:border-brand/50" 
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-brand/50"
                  )}
                  placeholder="Rua, número — Bairro"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Responsável Técnico</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all",
                      theme === 'dark' 
                        ? "bg-zinc-950 border-zinc-800 text-white focus:border-brand/50" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-brand/50"
                    )}
                    placeholder="Dr. Nome"
                    value={form.responsible}
                    onChange={e => setForm({ ...form, responsible: e.target.value })}
                  />
                </div>
                <div>
                  <label className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1.5 block",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-400"
                  )}>Telefone Contato</label>
                  <input
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all",
                      theme === 'dark' 
                        ? "bg-zinc-950 border-zinc-800 text-white focus:border-brand/50" 
                        : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-brand/50"
                    )}
                    placeholder="(11) 0000-0000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => { setShowForm(false); setEditingUnit(null); }} 
                className={cn(
                  "flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors border",
                  theme === 'dark' ? "bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-800" : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200"
                )}
              >
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 btn-gradient py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
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
                      "font-heading font-black text-sm leading-tight italic",
                      theme === 'dark' ? "text-white" : "text-zinc-900"
                    )}>{unit.name}</h3>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
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
                  <button onClick={() => initiateDelete(unit.id)} className={cn(
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
                    "flex items-center gap-2 text-[11px] font-bold",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <MapPin size={12} className="shrink-0 text-brand/60" />
                    <span className="truncate">{unit.address}</span>
                  </div>
                )}
                {unit.responsible && (
                  <div className={cn(
                    "flex items-center gap-2 text-[11px] font-bold",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <User size={12} className="shrink-0 text-brand/60" />
                    <span>{unit.responsible}</span>
                  </div>
                )}
                {unit.phone && (
                  <div className={cn(
                    "flex items-center gap-2 text-[11px] font-bold",
                    theme === 'dark' ? "text-zinc-500" : "text-zinc-500"
                  )}>
                    <Phone size={12} className="shrink-0 text-brand/60" />
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
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                    unit.active ? "text-emerald-500" : "text-zinc-500"
                  )}
                >
                  <CheckCircle2 size={12} />
                  {unit.active ? "Ativa" : "Inativa"}
                </button>
                <button
                  onClick={() => handleSelect(unit)}
                  className={cn(
                    "flex items-center gap-2 transition-all p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border group/btn",
                    theme === 'dark' 
                      ? "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-brand hover:border-brand/40" 
                      : "bg-zinc-50 border-zinc-100 text-zinc-500 hover:text-brand hover:border-brand/20 shadow-sm"
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
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className={cn(
            "rounded-3xl border shadow-2xl w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in-95",
            theme === 'dark' ? "bg-zinc-900 border-red-500/20" : "bg-white border-red-100"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto border",
              theme === 'dark' ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-100"
            )}>
              <AlertCircle size={32} />
            </div>
            
            <div className="text-center space-y-3">
              <h2 className={cn(
                "font-heading text-xl font-black uppercase tracking-tight",
                theme === 'dark' ? "text-white" : "text-zinc-900"
              )}>Segurança Operacional</h2>
              <p className={cn(
                "text-sm leading-relaxed font-medium",
                theme === 'dark' ? "text-zinc-400" : "text-zinc-500"
              )}>
                Esta unidade possui mais de <span className="text-red-500 font-bold">3 dias de registro</span>. Para evitar perdas acidentais de dados clínicos, é necessária a confirmação via assinatura digital enviada ao seu e-mail.
              </p>
            </div>

            <div className={cn(
              "p-4 rounded-2xl border",
              theme === 'dark' ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-100"
            )}>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Unidade a ser removida:</p>
               <p className={cn(
                 "text-sm font-bold italic",
                 theme === 'dark' ? "text-white" : "text-zinc-900"
               )}>{units.find(u => u.id === confirmDelete)?.name}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleEmailVerification}
                disabled={isVerifyingEmail}
                className="btn-gradient-brand w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-95 transition-all"
              >
                {isVerifyingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verificando Assinatura...
                  </>
                ) : (
                  <>Confirmar via E-mail</>
                )}
              </button>
              <button 
                onClick={() => setConfirmDelete(null)}
                className={cn(
                  "w-full py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors",
                  theme === 'dark' ? "text-zinc-500 hover:bg-zinc-800" : "text-zinc-400 hover:bg-zinc-50"
                )}
                disabled={isVerifyingEmail}
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
