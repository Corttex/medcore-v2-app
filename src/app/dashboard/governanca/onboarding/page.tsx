"use client";

import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Send, 
  Sparkles, 
  KeyRound, 
  Smartphone, 
  Building2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  accessStatus: "ativo" | "revogado" | "onboarding_em_andamento";
  facialRecognitionSetup: boolean;
  totemAccessGranted: boolean;
  mobileAppAccess: boolean;
}

export default function OnboardingRHPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "COLAB-01",
      name: "Dra. Camila Vasconcelos",
      role: "Médica Dermatologista",
      department: "Corpo Clínico",
      email: "camila.v@medcore.com.br",
      phone: "+55 (11) 98844-1234",
      accessStatus: "ativo",
      facialRecognitionSetup: true,
      totemAccessGranted: true,
      mobileAppAccess: true,
    },
    {
      id: "COLAB-02",
      name: "Lucas Ribeiro Prado",
      role: "Enfermeiro Chefe do Bloco Cirúrgico",
      department: "Enfermagem & CME",
      email: "lucas.prado@medcore.com.br",
      phone: "+55 (11) 97722-5566",
      accessStatus: "ativo",
      facialRecognitionSetup: true,
      totemAccessGranted: true,
      mobileAppAccess: true,
    },
    {
      id: "COLAB-03",
      name: "Juliana Mendes Costa",
      role: "Recepcionista / Atendimento VIP",
      department: "Recepção Central",
      email: "juliana.costa@medcore.com.br",
      phone: "+55 (11) 96611-3344",
      accessStatus: "revogado",
      facialRecognitionSetup: false,
      totemAccessGranted: false,
      mobileAppAccess: false,
    },
  ]);

  const [isNewColabModalOpen, setIsNewColabModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Médico Plantonista");
  const [newDept, setNewDept] = useState("Pronto Atendimento");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleInstantOffboarding = (id: string, name: string) => {
    if (!confirm(`CONFIRMAÇÃO ZERO TRUST (LGPD):\n\nDeseja revogar IMEDIATAMENTE todos os acessos de ${name}?\n\n• Sessões web ativas serão deslogadas.\n• Reconhecimento facial de ponto bloqueado nos totens.\n• Acesso aos prontuários e app mobile cortado instantaneamente.`)) {
      return;
    }

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              accessStatus: "revogado",
              totemAccessGranted: false,
              mobileAppAccess: false,
              facialRecognitionSetup: false,
            }
          : e
      )
    );
    alert(`🔒 Acesso revogado com sucesso para ${name}. Notificação de conformidade gravada em auditoria.`);
  };

  const handleCreateOnboarding = () => {
    if (!newName.trim() || !newEmail.trim()) return;

    const newColab: Employee = {
      id: `COLAB-0${employees.length + 1}`,
      name: newName,
      role: newRole,
      department: newDept,
      email: newEmail,
      phone: newPhone || "+55 (11) 99999-9999",
      accessStatus: "ativo",
      facialRecognitionSetup: true,
      totemAccessGranted: true,
      mobileAppAccess: true,
    };

    setEmployees([newColab, ...employees]);
    setIsNewColabModalOpen(false);

    alert(
      `🤖 Skill Dra. Conte RH Ativada!\n\n` +
      `• Login Zero-Trust gerado para: ${newEmail}\n` +
      `• Permissões de prontuário e escala atribuídas para o setor: ${newDept}\n` +
      `• WhatsApp automático de boas-vindas disparado com o link do app e cadastro do ponto facial!`
    );

    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Módulo */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Governança RH: Onboarding & Offboarding Zero Touch</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <Bot className="h-3 w-3" /> Dra. Conte RH
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Concessão automática de logins e revogação instantânea de acessos em um clique (conformidade rigorosa com a LGPD).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewColabModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-400 font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="h-4 w-4" />
            Admitir Novo Colaborador (Zero Touch)
          </button>
        </div>
      </div>

      {/* Indicadores de Governança */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Acessos Ativos</span>
          <p className="text-3xl font-black text-white">{employees.filter((e) => e.accessStatus === "ativo").length}</p>
          <p className="text-xs text-zinc-500">Médicos e equipe técnica</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Segurança Zero-Trust</span>
          <p className="text-3xl font-black text-emerald-400">100%</p>
          <p className="text-xs text-zinc-500">MFA & Sessões Criptografadas</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tempo de Offboarding</span>
          <p className="text-3xl font-black text-rd-cyan">&lt; 1 seg</p>
          <p className="text-xs text-zinc-500">Revogação global instantânea</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Conformidade LGPD</span>
          <p className="text-3xl font-black text-purple-400">Auditado</p>
          <p className="text-xs text-zinc-500">Trilha imutável em blockchain</p>
        </div>
      </div>

      {/* Tabela de Colaboradores e Controle de Acessos */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h4 className="font-bold text-base text-white">Quadro de Colaboradores & Status de Acessos</h4>
            <p className="text-xs text-zinc-400">Integração com totens físicos, prontuário, CRM e aplicativo de ponto</p>
          </div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {employees.length} registros gerenciados
          </span>
        </div>

        <div className="space-y-3">
          {employees.map((colab) => (
            <div
              key={colab.id}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4",
                colab.accessStatus === "revogado"
                  ? "bg-zinc-950/40 border-zinc-800 opacity-60"
                  : "bg-zinc-950/70 border-zinc-800"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{colab.name}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                    {colab.role}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      colab.accessStatus === "ativo"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}
                  >
                    {colab.accessStatus === "ativo" ? "Acesso Total Ativo" : "Acesso Revogado (Desligado)"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5">
                  <span>{colab.department}</span>
                  <span>•</span>
                  <span>{colab.email}</span>
                  <span>•</span>
                  <span>{colab.phone}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] pt-1.5">
                  <span className={cn("flex items-center gap-1 font-medium", colab.facialRecognitionSetup ? "text-emerald-400" : "text-zinc-600")}>
                    <CheckCircle2 className="h-3 w-3" /> Ponto Facial
                  </span>
                  <span className={cn("flex items-center gap-1 font-medium", colab.totemAccessGranted ? "text-emerald-400" : "text-zinc-600")}>
                    <CheckCircle2 className="h-3 w-3" /> Catracas & Totens
                  </span>
                  <span className={cn("flex items-center gap-1 font-medium", colab.mobileAppAccess ? "text-emerald-400" : "text-zinc-600")}>
                    <CheckCircle2 className="h-3 w-3" /> App Mobile
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                {colab.accessStatus === "ativo" ? (
                  <button
                    onClick={() => handleInstantOffboarding(colab.id, colab.name)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    <UserMinus className="h-4 w-4" />
                    Offboarding (1 Clique)
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Desligamento Concluído
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Admissão Zero Touch */}
      {isNewColabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <h4 className="font-heading font-bold text-base text-white">Admissão de Colaborador (Zero Touch)</h4>
              </div>
              <button onClick={() => setIsNewColabModalOpen(false)} className="text-zinc-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Gabriel Henrique Souza"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cardiologista / Instrumentador"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Departamento
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Corpo Clínico">Corpo Clínico</option>
                    <option value="Enfermagem & CME">Enfermagem & CME</option>
                    <option value="Recepção Central">Recepção Central</option>
                    <option value="Centro Cirúrgico">Centro Cirúrgico</option>
                    <option value="Administrativo / Faturamento">Administrativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    placeholder="gabriel@clinica.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    WhatsApp para Boas-Vindas
                  </label>
                  <input
                    type="text"
                    placeholder="+55 (11) 99999-9999"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-purple-400" /> Ações Automáticas do Robô:
                </p>
                <p>1. Criar credenciais com perfil de acesso estrito ao setor {newDept}.</p>
                <p>2. Disparar link temporário de cadastro facial no WhatsApp informado.</p>
                <p>3. Liberar leitor biométrico nas catracas da unidade matriz.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsNewColabModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOnboarding}
                className="px-6 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-purple-400 transition-all shadow-lg shadow-purple-500/20"
              >
                Executar Admissão Zero Touch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
