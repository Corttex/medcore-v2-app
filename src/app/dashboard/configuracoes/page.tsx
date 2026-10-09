"use client";

import React, { useState, useRef } from "react";
import { PinSettings } from "@/features/auth/components/PinSettings";
import { 
  Shield, User, Bell, Palette, Camera, Globe, Monitor, Moon, Sun, Smartphone, 
  ChevronRight, Link2, Mail, Apple, Wifi, Check, Loader2, Save,
  Phone, Building2, Stethoscope, Upload
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sanitize } from "@/lib/sanitize";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useTheme, type Palette as ThemePalette } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none",
        enabled ? "bg-primary" : "bg-zinc-700"
      )}
    >
      <span className={cn(
        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300",
        enabled ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme, palette, setPalette } = useTheme();
  const { user, refreshUser } = useUser();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Perfil
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  // Inicializa os dados com base no usuário logado
  useEffect(() => {
    if (user) {
      setNome(user.full_name || "");
      setCrm(user.crm || "");
      setEmail(user.email_corporativo || user.email || "");
      setCargo(user.cargo || "");
      setTelefone(user.telefone || "");
      setEspecialidade(user.especialidade || "");
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    }
  }, [user]);

  // Notificações
  const [notifs, setNotifs] = useState({
    criticos: true,
    ia: true,
    juridico: false,
    sistema: true,
    email: false,
    whatsapp: true,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Sanitização dos campos
    const sanitizedName = sanitize(nome);
    const sanitizedEmail = sanitize(email);
    const sanitizedCargo = sanitize(cargo);
    const sanitizedTelefone = sanitize(telefone);
    const sanitizedEspecialidade = sanitize(especialidade);
    const sanitizedCrm = sanitize(crm);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: sanitizedName,
          email_corporativo: sanitizedEmail,
          cargo: sanitizedCargo,
          telefone: sanitizedTelefone,
          especialidade: sanitizedEspecialidade,
          crm: sanitizedCrm
        })
      });

      if (res.ok) {
        await refreshUser();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
    } finally {
      setSaving(false);
    }
  };

  const integrations = [
    { name: "Google", desc: "Agenda, E-mail e Drive", icon: "google", connected: true, color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
    { name: "Outlook / Office 365", desc: "E-mail e Calendário Microsoft", icon: "outlook", connected: false, color: "text-sky-400 border-sky-400/20 bg-sky-400/5" },
    { name: "Apple / iCloud", desc: "Calendário e Contatos Apple", icon: "apple", connected: false, color: "text-zinc-300 border-zinc-500/20 bg-zinc-700/10" },
    { name: "IMAP / SMTP Custom", desc: "Qualquer e-mail corporativo", icon: "mail", connected: false, color: "text-amber-400 border-amber-400/20 bg-amber-400/5" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-outline-variant/30 pb-6">
        <h1 className="text-4xl font-semibold text-on-surface font-heading tracking-tighter">Configurações</h1>
        <p className="text-on-surface-variant font-medium opacity-70 text-sm">
          Gerencie seu perfil, segurança, notificações e integrações.
        </p>
      </div>

      {/* ══════════════════════════════════ */}
      {/* PERFIL PROFISSIONAL                */}
      {/* ══════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <User size={18} />
          </div>
          <h2 className="text-lg font-semibold text-on-surface font-heading ">Perfil Profissional</h2>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-8 space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatarPreview}
                alt="Foto do perfil"
                className="w-24 h-24 rounded-[1.5rem] object-cover ring-4 ring-surface-container shadow-xl group-hover:opacity-80 transition-all"
              />
              <div className="absolute inset-0 rounded-[1.5rem] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={20} className="text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-surface">
                <Camera size={14} className="text-white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div>
              <h3 className="text-xl font-semibold text-on-surface font-heading ">{nome}</h3>
              <p className="text-xs text-primary font-medium uppercase tracking-widest mt-0.5">{crm}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{cargo}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-sm font-semibold text-primary uppercase tracking-widest hover:underline"
              >
                Alterar foto
              </button>
            </div>
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nome Completo", value: nome, onChange: setNome, icon: User },
              { label: "CRM / Registro", value: crm, onChange: setCrm, icon: Stethoscope },
              { label: "E-mail Corporativo", value: email, onChange: setEmail, icon: Mail },
              { label: "Cargo / Função", value: cargo, onChange: setCargo, icon: Building2 },
              { label: "Telefone / WhatsApp", value: telefone, onChange: setTelefone, icon: Phone },
              { label: "Especialidade", value: especialidade, onChange: setEspecialidade, icon: Stethoscope },
            ].map((field, i) => (
              <div key={i} className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-500 uppercase tracking-widest block">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full bg-surface-container-highest/40 border border-outline-variant/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ */}
      {/* SEGURANÇA                          */}
      {/* ══════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Shield size={18} />
          </div>
          <h2 className="text-lg font-semibold text-on-surface font-heading ">Segurança & Autenticação</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-1 overflow-hidden">
            <PinSettings />
          </div>

          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-6 space-y-6">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Métodos de Acesso</p>
            {[
              { title: "Login por Biometria", desc: "FaceID ou Impressão Digital", enabled: true },
              { title: "Autenticação 2 Fatores (2FA)", desc: "Via App TOTP (Google Auth)", enabled: false },
              { title: "Sessão Persistente", desc: "Manter login por 30 dias", enabled: true },
            ].map((item, i) => {
              const [on, setOn] = useState(item.enabled);
              return (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface ">{item.title}</h4>
                    <p className="text-sm text-on-surface-variant font-medium">{item.desc}</p>
                  </div>
                  <Toggle enabled={on} onToggle={() => setOn(!on)} />
                </div>
              );
            })}

            <div className="pt-4 border-t border-outline-variant/20">
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">Dispositivos Conectados</p>
              <div className="flex items-center justify-between text-xs font-medium text-on-surface-variant">
                <span className="flex items-center gap-2"><Smartphone size={14} /> iPhone 15 Pro <span className="text-zinc-600">(Este)</span></span>
                <span className="text-emerald-500 font-semibold text-xs uppercase tracking-widest">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ */}
      {/* INTEGRAÇÕES                        */}
      {/* ══════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <Link2 size={18} />
          </div>
          <h2 className="text-lg font-semibold text-on-surface font-heading ">Integrações de Conta</h2>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-6 space-y-4">
          {integrations.map((item, i) => (
            <div key={i} className={cn("flex items-center justify-between p-4 rounded-2xl border transition-all", item.color)}>
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", item.color)}>
                  {item.icon === "google" && (
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  )}
                  {item.icon === "outlook" && <Wifi size={18} className="text-sky-400" />}
                  {item.icon === "apple" && <Apple size={18} className="text-zinc-300" />}
                  {item.icon === "mail" && <Mail size={18} className="text-amber-400" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                  <p className="text-sm text-on-surface-variant font-medium">{item.desc}</p>
                </div>
              </div>
              <button className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all",
                item.connected
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary"
              )}>
                {item.connected ? <><Check size={12} /> Conectado</> : <>Conectar <ChevronRight size={12} /></>}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════ */}
      {/* NOTIFICAÇÕES                       */}
      {/* ══════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Bell size={18} />
          </div>
          <h2 className="text-lg font-semibold text-on-surface font-heading ">Notificações & Alertas</h2>
        </div>

        <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-6">
          <div className="space-y-5">
            {[
              { key: "criticos" as const, title: "Alertas Críticos de CTI", desc: "Push em tempo real para emergências setoriais." },
              { key: "ia" as const, title: "Relatórios de IA", desc: "Resumos executivos ao final de cada turno." },
              { key: "juridico" as const, title: "Demandas Jurídicas", desc: "Atualizações sobre processos e movimentações." },
              { key: "sistema" as const, title: "Status do Sistema", desc: "Manutenção ou degradação de serviços." },
              { key: "email" as const, title: "Notificação por E-mail", desc: "Receba um resumo diário no seu e-mail." },
              { key: "whatsapp" as const, title: "Notificação por WhatsApp", desc: "Alertas diretos no seu número cadastrado." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between pb-5 border-b border-outline-variant/15 last:border-0 last:pb-0">
                <div>
                  <h4 className="text-sm font-semibold text-on-surface ">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant font-medium opacity-70">{item.desc}</p>
                </div>
                <Toggle enabled={notifs[item.key]} onToggle={() => toggleNotif(item.key)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ */}
      {/* APARÊNCIA                          */}
      {/* ══════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <Palette size={18} />
          </div>
          <h2 className="text-lg font-semibold text-on-surface font-heading ">Sistema & Aparência</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Modo Visual</p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: "light" as const, label: "Claro", icon: Sun },
                  { key: "dark" as const, label: "Escuro", icon: Moon },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => theme !== opt.key && toggleTheme()}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                      theme === opt.key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-surface-container hover:border-outline-variant/40 text-on-surface-variant"
                    )}
                  >
                    <opt.icon size={20} />
                    <span className="text-xs font-semibold uppercase tracking-widest">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20">
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Paleta de Cores Corporativa</p>
              <div className="flex items-center gap-3">
                {([
                  { key: "default", color: "#8b5cf6", name: "Midnight Violet" },
                  { key: "emerald", color: "#10b981", name: "Healthcare Emerald" },
                  { key: "sapphire", color: "#3b82f6", name: "Corporate Sapphire" },
                  { key: "amber", color: "#f59e0b", name: "Executive Amber" },
                  { key: "ruby", color: "#f43f5e", name: "Urgent Ruby" },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPalette(opt.key as ThemePalette)}
                    title={opt.name}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
                      palette === opt.key ? "border-on-surface scale-110 shadow-lg" : "border-transparent"
                    )}
                    style={{ backgroundColor: opt.color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-6 space-y-4">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Idioma & Localidade</p>
            <button className="w-full flex items-center justify-between p-4 bg-surface-container border border-outline-variant/20 rounded-2xl hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-zinc-500 group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-on-surface ">Português (Brasil)</p>
                  <p className="text-xs text-on-surface-variant font-medium">UTC -03:00 • BRT</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-500" />
            </button>

            <div className="pt-2">
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">Plano Atual</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-xs font-semibold text-primary ">VitalFlow MAX</span>
                <button className="text-xs font-semibold text-zinc-500 uppercase tracking-widest hover:text-primary transition-colors">Gerenciar →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Botão Salvar */}
      <div className="pt-6 border-t border-outline-variant/30 flex justify-end gap-4">
        <button className="px-6 py-3 text-zinc-500 text-xs font-semibold uppercase tracking-widest hover:text-on-surface transition-colors">
          Descartar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all shadow-lg",
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-primary text-white hover:scale-105 shadow-primary/20 disabled:opacity-60"
          )}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? "Salvando..." : saved ? "Saved!" : "Salvar Preferências"}
        </button>
      </div>
    </div>
  );
}
