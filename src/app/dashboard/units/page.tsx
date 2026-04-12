"use client";

import React, { useState } from "react";
import { Building2, Plus, MapPin, User, Phone, Edit2, Trash2, CheckCircle2, ChevronRight } from "lucide-react";

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
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [form, setForm] = useState({ name: "", type: "Hospital" as Unit["type"], address: "", responsible: "", phone: "", color: UNIT_COLORS[0] });

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingUnit) {
      setUnits(units.map(u => u.id === editingUnit.id ? { ...editingUnit, ...form } : u));
    } else {
      setUnits([...units, { ...form, id: Date.now().toString(), active: true }]);
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
  const deleteUnit = (id: string) => setUnits(units.filter(u => u.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
              Gestão de Rede
            </span>
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-on-surface">
            Unidades <span className="text-gradient">Hospitalares</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{units.length} unidades cadastradas · {units.filter(u => u.active).length} ativas</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingUnit(null); }}
          className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black"
        >
          <Plus size={18} /> Nova Unidade
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl w-full max-w-lg p-8 space-y-5 animate-in fade-in zoom-in-95">
            <h2 className="font-heading text-2xl font-black text-on-surface">
              {editingUnit ? "Editar Unidade" : "Nova Unidade"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Nome da Unidade *</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Ex: Hospital São Lucas"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Tipo</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as Unit["type"] })}
                  >
                    {UNIT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Cor</label>
                  <div className="flex gap-2 mt-1">
                    {UNIT_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${c} transition-all ${form.color === c ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Endereço</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Rua, número — Bairro"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Responsável</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                    placeholder="Dr. Nome"
                    value={form.responsible}
                    onChange={e => setForm({ ...form, responsible: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block">Telefone</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary"
                    placeholder="(11) 0000-0000"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowForm(false); setEditingUnit(null); }} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 btn-gradient py-3 rounded-2xl text-sm font-black">
                {editingUnit ? "Salvar Alterações" : "Criar Unidade"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {units.map(unit => (
          <div key={unit.id} className={`group relative bg-surface rounded-3xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-all overflow-hidden ${!unit.active ? "opacity-60" : ""}`}>
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${unit.color}`} />

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${unit.color} flex items-center justify-center shadow-sm`}>
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-on-surface text-sm leading-tight">{unit.name}</h3>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{unit.type}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(unit)} className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteUnit(unit.id)} className="w-8 h-8 rounded-xl bg-error/10 hover:bg-error/20 flex items-center justify-center text-error">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {unit.address && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{unit.address}</span>
                  </div>
                )}
                {unit.responsible && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <User size={12} className="shrink-0" />
                    <span>{unit.responsible}</span>
                  </div>
                )}
                {unit.phone && (
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Phone size={12} className="shrink-0" />
                    <span>{unit.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                <button
                  onClick={() => toggleActive(unit.id)}
                  className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${unit.active ? "text-emerald-600" : "text-on-surface-variant"}`}
                >
                  <CheckCircle2 size={12} />
                  {unit.active ? "Ativa" : "Inativa"}
                </button>
                <button className="flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-container transition-colors">
                  Ver Agenda <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
