"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Search, 
  ExternalLink, 
  Lock, 
  Unlock,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { useAdminContext } from "@/context/AdminContext";

export function AdminTopHeader() {
  const { 
    isDemo, 
    setIsDemo, 
    selectedTenantId, 
    setSelectedTenantId,
    selectedTenantName,
    setSelectedTenantName,
    isPinUnlocked 
  } = useAdminContext();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const mockTenants = [
    { id: "tenant_demo_1", name: "CardioVida Prime Brasília", cnpj: "12.345.678/0001-90", doctor: "Dr. Marcelo Arantes" },
    { id: "tenant_demo_2", name: "Instituto de Olhos Taguatinga", cnpj: "98.765.432/0001-10", doctor: "Dra. Camila Castro" },
    { id: "tenant_demo_3", name: "Clínica Pediátrica Crescer", cnpj: "45.123.789/0001-55", doctor: "Dr. Lucas Martins" },
    { id: "tenant_demo_4", name: "DermatoLaser Asa Sul", cnpj: "33.222.111/0001-44", doctor: "Dra. Renata Vasconcelos" },
  ];

  const filteredTenants = mockTenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cnpj.includes(searchTerm) ||
    t.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTenant = (tenant: typeof mockTenants[0]) => {
    setSelectedTenantId(tenant.id);
    setSelectedTenantName(tenant.name);
    setSearchOpen(false);
  };

  const handleImpersonate = () => {
    if (!selectedTenantId) return;
    // Abre a visão da clínica em nova aba com identificador
    window.open(`/dashboard?tenant=${selectedTenantId}&impersonate=true`, "_blank");
  };

  return (
    <div className="bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-3 md:p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm">
      
      {/* 1. Toggle Modo Demo vs Produção */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-container-highest/60 border border-outline-variant/30">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
            DADOS DEMO:
          </span>
          <div className="flex bg-surface-container rounded-xl p-0.5 border border-outline-variant/20">
            <button
              onClick={() => setIsDemo(false)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                !isDemo
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              NÃO (Produção Real)
            </button>
            <button
              onClick={() => setIsDemo(true)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                isDemo
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SIM (Apresentação)
            </button>
          </div>
        </div>

        {isDemo ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Sparkles size={13} /> Modo Demonstração Ativo
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 size={13} /> Rumo aos R$ 500k Reais
          </span>
        )}
      </div>

      {/* 2. Tenant Switcher & Impersonate */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest/80 hover:bg-surface-container-highest border border-outline-variant/40 rounded-2xl text-xs font-bold text-on-surface transition-all"
          >
            <Building2 size={15} className="text-primary" />
            <span className="max-w-[180px] truncate">
              {selectedTenantName || "Selecionar Clínica (Tenant)..."}
            </span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {searchOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-surface-container-low border border-outline-variant/40 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar por CNPJ, Nome ou Médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-xl pl-9 pr-3 py-1.5 text-xs text-on-surface outline-none border border-outline-variant/30"
                  autoFocus
                />
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1">
                {filteredTenants.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">Nenhuma clínica encontrada</p>
                ) : (
                  filteredTenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTenant(t)}
                      className="w-full text-left p-2 rounded-xl hover:bg-primary/10 transition-colors group flex flex-col"
                    >
                      <span className="text-xs font-bold text-on-surface group-hover:text-primary">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {t.doctor} • CNPJ: {t.cnpj}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {selectedTenantId && (
          <button
            onClick={handleImpersonate}
            className="px-3.5 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="Acessar o painel da clínica como administrador de suporte"
          >
            <ExternalLink size={13} /> Acessar Painel (Impersonate)
          </button>
        )}

        {/* 3. Indicador de PIN Operacional */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-surface-container-highest/60 border border-outline-variant/30 text-xs font-bold">
          {isPinUnlocked ? (
            <span className="text-emerald-500 flex items-center gap-1">
              <Unlock size={13} /> PIN Desbloqueado
            </span>
          ) : (
            <span className="text-zinc-400 flex items-center gap-1">
              <Lock size={13} /> Sessão Segura
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
