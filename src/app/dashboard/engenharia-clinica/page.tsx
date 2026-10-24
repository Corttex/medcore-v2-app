"use client";

import React, { useState } from "react";
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Calendar, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck,
  FileText,
  AlertOctagon,
  ChevronRight,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  brandModel: string;
  location: string;
  calibrationValidUntil: string;
  status: "operacional" | "manutencao_preventiva" | "quebrado" | "calibrando";
  lastPreventive: string;
  preventiveCycleDays: number;
}

interface MaintenanceOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  openedAt: string;
  priority: "baixa" | "media" | "alta" | "critica";
  type: "corretiva" | "preventiva" | "calibracao";
  status: "aberta" | "em_andamento" | "concluida";
  description: string;
  technician: string;
}

export default function EngenhariaClinicaPage() {
  const [activeTab, setActiveTab] = useState<"equipamentos" | "ordens">("equipamentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: "EQ-001",
      name: "Ultrassom Doppler Colorido",
      serialNumber: "SN-GE-981247",
      brandModel: "GE Healthcare Voluson E10",
      location: "Sala de Ultrassonografia 02",
      calibrationValidUntil: "15/12/2026",
      status: "operacional",
      lastPreventive: "15/06/2026",
      preventiveCycleDays: 180,
    },
    {
      id: "EQ-002",
      name: "Laser Fracionado CO2",
      serialNumber: "SN-LUM-44019",
      brandModel: "Lumenis UltraPulse",
      location: "Centro Estético - Bloco B",
      calibrationValidUntil: "05/11/2026",
      status: "manutencao_preventiva",
      lastPreventive: "05/05/2026",
      preventiveCycleDays: 180,
    },
    {
      id: "EQ-003",
      name: "Cardioversor / Desfibrilador Bifásico",
      serialNumber: "SN-ZOL-77812",
      brandModel: "Zoll R Series Plus",
      location: "Carrinho de Emergência - UTI Leito 04",
      calibrationValidUntil: "20/01/2027",
      status: "operacional",
      lastPreventive: "20/07/2026",
      preventiveCycleDays: 90,
    },
    {
      id: "EQ-004",
      name: "Aparelho de Anestesia com Monitor Integrado",
      serialNumber: "SN-DRA-55310",
      brandModel: "Dräger Primus",
      location: "Centro Cirúrgico - Sala 01",
      calibrationValidUntil: "28/10/2026",
      status: "quebrado",
      lastPreventive: "10/04/2026",
      preventiveCycleDays: 180,
    },
  ]);

  const [orders, setOrders] = useState<MaintenanceOrder[]>([
    {
      id: "OS-2026-089",
      equipmentId: "EQ-004",
      equipmentName: "Aparelho de Anestesia Dräger Primus",
      openedAt: "24/10/2026 08:30",
      priority: "critica",
      type: "corretiva",
      status: "em_andamento",
      description: "Sensor de fluxo O2 apresentando instabilidade e alarme falso intermitente. Sala cirúrgica interditada temporariamente.",
      technician: "Eng. Roberto Vianna (Biomédica)",
    },
    {
      id: "OS-2026-088",
      equipmentId: "EQ-002",
      equipmentName: "Laser Fracionado CO2 Lumenis",
      openedAt: "22/10/2026 14:15",
      priority: "media",
      type: "preventiva",
      status: "aberta",
      description: "Troca periódica de fluido de arrefecimento e calibração de ponteiras ópticas programada.",
      technician: "Técnica Especializada Lumenis",
    },
  ]);

  // Nova OS Form
  const [selectedEquipId, setSelectedEquipId] = useState("EQ-001");
  const [osPriority, setOsPriority] = useState<MaintenanceOrder["priority"]>("alta");
  const [osType, setOsType] = useState<MaintenanceOrder["type"]>("corretiva");
  const [osDesc, setOsDesc] = useState("");

  const handleCreateOrder = () => {
    if (!osDesc.trim()) return;
    const equip = equipments.find((e) => e.id === selectedEquipId);
    const newOS: MaintenanceOrder = {
      id: `OS-2026-0${orders.length + 90}`,
      equipmentId: selectedEquipId,
      equipmentName: equip?.name || "Equipamento Geral",
      openedAt: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      priority: osPriority,
      type: osType,
      status: "aberta",
      description: osDesc,
      technician: "Engenharia Clínica / Atribuição Pendente",
    };
    setOrders([newOS, ...orders]);
    setIsNewOrderModalOpen(false);
    setOsDesc("");
  };

  const getStatusBadge = (status: Equipment["status"]) => {
    switch (status) {
      case "operacional":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Operacional</span>;
      case "manutencao_preventiva":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Preventiva Pendente</span>;
      case "quebrado":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">Interditado / Chamado Aberto</span>;
      case "calibrando":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">Em Calibração</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in p-2 md:p-6 pb-20">
      
      {/* Header do Módulo */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-rd-cyan/10 border border-rd-cyan/20 flex items-center justify-center text-rd-cyan">
            <Wrench className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-heading font-bold text-white">Engenharia Clínica & Parque de Equipamentos</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rd-cyan/10 text-rd-cyan border border-rd-cyan/20">
                Plano Clínica Inteligente
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Controle do ciclo de vida, calibração periódica (RDC ANVISA) e chamados corretivos integrados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 hover:bg-rd-cyan/90 font-bold text-xs uppercase tracking-wider shadow-lg shadow-rd-cyan/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Abrir Ordem de Serviço (OS)
          </button>
        </div>
      </div>

      {/* Métricas do Parque Tecnológico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-rd-cyan" />
            Total de Equipamentos
          </span>
          <p className="text-3xl font-black text-white">{equipments.length}</p>
          <p className="text-xs text-zinc-500">Valor patrimonial ativo</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Índice de Disponibilidade
          </span>
          <p className="text-3xl font-black text-emerald-400">92.5%</p>
          <p className="text-xs text-zinc-500">3 de 4 em plena operação</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            Calibrações a Vencer (30d)
          </span>
          <p className="text-3xl font-black text-amber-400">2</p>
          <p className="text-xs text-zinc-500">Alertas preventivos gerados</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <AlertOctagon className="h-3.5 w-3.5 text-red-400" />
            OS Corretivas Abertas
          </span>
          <p className="text-3xl font-black text-red-400">{orders.filter((o) => o.status !== "concluida").length}</p>
          <p className="text-xs text-zinc-500">1 chamado com sala bloqueada</p>
        </div>
      </div>

      {/* Tabs: Equipamentos vs Ordens de Serviço */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab("equipamentos")}
          className={cn(
            "pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2",
            activeTab === "equipamentos"
              ? "border-rd-cyan text-rd-cyan"
              : "border-transparent text-zinc-400 hover:text-white"
          )}
        >
          <HardDrive className="h-4 w-4" />
          Inventário de Equipamentos ({equipments.length})
        </button>

        <button
          onClick={() => setActiveTab("ordens")}
          className={cn(
            "pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2",
            activeTab === "ordens"
              ? "border-rd-cyan text-rd-cyan"
              : "border-transparent text-zinc-400 hover:text-white"
          )}
        >
          <Wrench className="h-4 w-4" />
          Ordens de Serviço / Manutenção ({orders.length})
        </button>
      </div>

      {/* TAB 1: INVENTÁRIO DE EQUIPAMENTOS */}
      {activeTab === "equipamentos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          {equipments.map((equip) => (
            <div
              key={equip.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rd-cyan block">
                    {equip.id} • {equip.brandModel}
                  </span>
                  <h4 className="font-bold text-base text-white mt-0.5">{equip.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{equip.serialNumber}</p>
                </div>
                {getStatusBadge(equip.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-zinc-800/80">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Localização</span>
                  <span className="text-zinc-200 font-medium">{equip.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Validade Calibração</span>
                  <span className="text-zinc-200 font-medium">{equip.calibrationValidUntil}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500">
                  Ciclo preventivo: a cada <strong>{equip.preventiveCycleDays} dias</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedEquipId(equip.id);
                    setIsNewOrderModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
                >
                  Abrir Chamado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ORDENS DE SERVIÇO */}
      {activeTab === "ordens" && (
        <div className="space-y-3 animate-in fade-in">
          {orders.map((os) => (
            <div
              key={os.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-rd-cyan">{os.id}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                      os.priority === "critica"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    )}
                  >
                    Prioridade {os.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                    {os.type}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{os.equipmentName}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{os.description}</p>
                <p className="text-[11px] text-zinc-500">
                  Aberto em: {os.openedAt} • Responsável: <strong className="text-zinc-300">{os.technician}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    os.status === "concluida"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : os.status === "em_andamento"
                      ? "bg-rd-cyan/20 text-rd-cyan"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  {os.status === "concluida" ? "Concluída" : os.status === "em_andamento" ? "Em Atendimento" : "Fila de Triagem"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Abertura de Ordem de Serviço */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h4 className="font-heading font-bold text-base text-white">Nova Ordem de Serviço (OS)</h4>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-zinc-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Equipamento Afetado
                </label>
                <select
                  value={selectedEquipId}
                  onChange={(e) => setSelectedEquipId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan cursor-pointer font-medium"
                >
                  {equipments.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.serialNumber}) - {e.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Tipo de Manutenção
                  </label>
                  <select
                    value={osType}
                    onChange={(e) => setOsType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="corretiva">Corretiva (Quebra/Falha)</option>
                    <option value="preventiva">Preventiva Programada</option>
                    <option value="calibracao">Calibração Periódica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Prioridade de Atendimento
                  </label>
                  <select
                    value={osPriority}
                    onChange={(e) => setOsPriority(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan cursor-pointer"
                  >
                    <option value="baixa">Baixa (Estética/Geral)</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica (Interdição de Sala/UTI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Descrição Detalhada do Problema / Sintoma
                </label>
                <textarea
                  rows={3}
                  placeholder="Relate o código de erro em tela, ruídos anormais ou comportamento inadequado..."
                  value={osDesc}
                  onChange={(e) => setOsDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-rd-cyan resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrder}
                className="px-5 py-2.5 rounded-xl bg-rd-cyan text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-rd-cyan/90 shadow-lg shadow-rd-cyan/20"
              >
                Registrar Ordem de Serviço
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
