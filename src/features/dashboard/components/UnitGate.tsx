"use client";

import React, { useState } from "react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import { Building2, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const maskCnpj = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length > 9) v = `${v.slice(0, 9)}-${v.slice(9)}`;
  return v;
};

export function UnitGate({ children }: { children: React.ReactNode }) {
  const { selectedUnitId, setSelectedUnitId, units, loadingUnits } = useDashboardContext();
  const [isSetting, setIsSetting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    address: "",
    responsible: ""
  });

  async function handleCreateUnit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSetting(true);
    try {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name, 
          type: "Hospital",
          cnpj: formData.cnpj,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          responsible: formData.responsible
        })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const errData = await res.json();
        console.error("Erro da API:", errData);
        alert(errData.error || "Ocorreu um erro ao conectar com o servidor. Verifique a conexão com o banco de dados.");
        setIsSetting(false);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro ao tentar conectar com o servidor.");
      setIsSetting(false);
    }
  }

  async function handleSelectUnit(unitId: string) {
    setIsSetting(true);
    setSelectedUnitId(unitId);
    try {
      await fetch("/api/units", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId })
      });
    } catch (error) {
      console.error("Erro ao definir unidade primária:", error);
    } finally {
      setIsSetting(false);
    }
  }

  if (loadingUnits || isSetting) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-rd-cyan/5 pointer-events-none blur-[120px]"></div>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-rd-cyan/10 border border-rd-cyan/20 rounded-3xl flex items-center justify-center text-rd-cyan mx-auto shadow-card">
            <Loader2 size={40} className="animate-spin" />
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-tighter text-white ">
            Carregando <span className="text-gradient-brand">Sistema...</span>
          </h1>
        </div>
      </div>
    );
  }

  // Se já tiver uma unidade selecionada, libera o acesso
  if (selectedUnitId) return <>{children}</>;

  // Se o usuário TEM unidades, mas nenhuma selecionada (ex: acabou de entrar e tem várias)
  if (units.length > 0 && !selectedUnitId) {
    return (
      <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rd-cyan/10 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none"></div>
          
          <div className="text-center space-y-3 mb-8 relative z-10">
            <div className="w-16 h-16 bg-rd-cyan/10 border border-rd-cyan/20 rounded-2xl flex items-center justify-center text-rd-cyan mx-auto mb-4">
              <Building2 size={32} />
            </div>
            <h1 className="font-heading text-3xl font-semibold text-white">Selecione seu <span className="text-rd-cyan">Hospital</span></h1>
            <p className="text-zinc-400 text-sm">Escolha em qual ambiente de trabalho você deseja operar agora.</p>
          </div>

          <div className="grid gap-3 relative z-10 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {units.map(unit => (
              <button
                key={unit.id}
                onClick={() => handleSelectUnit(unit.id)}
                className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-rd-cyan/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-rd-cyan group-hover:bg-rd-cyan/10 transition-colors">
                    <Building2 size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">{unit.name}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">{unit.type}</p>
                  </div>
                </div>
                <ArrowRight className="text-zinc-600 group-hover:text-rd-cyan group-hover:translate-x-1 transition-all" />
              </button>
            ))}
            
            {/* Botão de Cadastrar Novo Hospital */}
            {!isCreating ? (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center p-5 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 hover:bg-zinc-800 hover:border-rd-cyan/50 transition-all group mt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-rd-cyan group-hover:border-rd-cyan transition-colors">
                    +
                  </div>
                  <p className="text-zinc-400 group-hover:text-white font-medium transition-colors">Cadastrar Novo Hospital</p>
                </div>
              </button>
            ) : (
              <form onSubmit={handleCreateUnit} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 animate-in fade-in mt-2 space-y-3">
                <input 
                  type="text" 
                  placeholder="Nome do Hospital *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
                  autoFocus
                />
                <input 
                  type="text" 
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: maskCnpj(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="email" 
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={!formData.name.trim() || isSetting}
                    className="flex-1 px-4 py-2 bg-rd-cyan text-zinc-950 font-medium rounded-xl hover:bg-rd-cyan/90 transition-colors disabled:opacity-50"
                  >
                    {isSetting ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sem unidade cadastrada
  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-rd-cyan/5 pointer-events-none blur-[120px]"></div>
      
      <div className="max-w-xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-rd-cyan/10 border border-rd-cyan/20 rounded-3xl flex items-center justify-center text-rd-cyan mx-auto shadow-card animate-pulse">
            <Building2 size={40} />
          </div>
          <h1 className="font-heading text-4xl font-semibold tracking-tighter text-white ">
            Nenhum Hospital <span className="text-gradient-brand">Cadastrado</span>
          </h1>
          <p className="text-zinc-400 font-medium leading-relaxed max-w-md mx-auto">
            Para acessar o ecossistema MedCore, é necessário cadastrar o seu primeiro hospital.
          </p>
        </div>

        {!isCreating ? (
          <div className="flex justify-center">
            <button 
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-rd-cyan text-zinc-950 font-semibold rounded-xl hover:bg-rd-cyan/90 transition-colors shadow-glow"
            >
              Cadastrar Meu Primeiro Hospital
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateUnit} className="max-w-md mx-auto space-y-3 animate-in fade-in zoom-in-95">
            <input 
              type="text" 
              placeholder="Nome do Hospital *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
              />
              <input 
                type="text" 
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
              />
            </div>
            <input 
              type="email" 
              placeholder="E-mail Administrativo"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rd-cyan text-sm"
            />
            <div className="flex gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={!formData.name.trim() || isSetting}
                className="flex-1 px-4 py-3 bg-rd-cyan text-zinc-950 font-medium rounded-xl hover:bg-rd-cyan/90 transition-colors disabled:opacity-50"
              >
                {isSetting ? "Criando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 text-center">
          <p className="text-sm text-zinc-600 font-semibold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-rd-cyan rounded-full"></span>
            Protocolo de Segurança Ativo
          </p>
        </div>
      </div>
    </div>
  );
}
