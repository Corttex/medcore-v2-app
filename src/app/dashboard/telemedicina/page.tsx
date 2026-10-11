"use client";

import React, { useState, useEffect } from "react";
import { Teleconsulta, TelemedicinaStatus } from "@/features/telemedicina/types";
import { TelemedicinaActionBar } from "@/features/telemedicina/components/TelemedicinaActionBar";
import { TelemedicinaStats } from "@/features/telemedicina/components/TelemedicinaStats";
import { TelemedicinaList } from "@/features/telemedicina/components/TelemedicinaList";
import { NewTelemedicinaModal } from "@/features/telemedicina/components/NewTelemedicinaModal";
import { TelemedicinaRoomModal } from "@/features/telemedicina/components/TelemedicinaRoomModal";
import { DeviceTestModal } from "@/features/telemedicina/components/DeviceTestModal";

export default function TelemedicinaPage() {
  const [consultas, setConsultas] = useState<Teleconsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("todas");

  // Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDeviceTestOpen, setIsDeviceTestOpen] = useState(false);
  const [activeRoomConsulta, setActiveRoomConsulta] = useState<Teleconsulta | null>(null);

  // Carregar dados de telemedicina
  const fetchConsultas = async () => {
    try {
      const res = await fetch("/api/telemedicina");
      if (res.ok) {
        const data = await res.json();
        setConsultas(data);
      }
    } catch (err) {
      console.error("Erro ao carregar teleconsultas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();

    // Polling a cada 15 segundos para atualizar status da sala de espera em tempo real
    const interval = setInterval(fetchConsultas, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filtro por busca
  const filteredConsultas = consultas.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nome = c.paciente?.nome?.toLowerCase() || "";
    const cpf = c.paciente?.cpf?.toLowerCase() || "";
    const conv = c.paciente?.convenio?.nome?.toLowerCase() || "";
    return nome.includes(query) || cpf.includes(query) || conv.includes(query);
  });

  // Métricas
  const totalHoje = consultas.length;
  const totalEmEspera = consultas.filter((c) => c.status === "sala_espera").length;
  const totalEmAndamento = consultas.filter((c) => c.status === "em_andamento").length;
  const totalConcluidas = consultas.filter((c) => c.status === "concluido").length;

  // Ações
  const handleStatusChange = async (id: string, newStatus: TelemedicinaStatus) => {
    // Otimista
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    try {
      await fetch(`/api/telemedicina/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente remover esta teleconsulta?")) return;

    setConsultas((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/telemedicina/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const handleEnterRoom = (consulta: Teleconsulta) => {
    setActiveRoomConsulta(consulta);
    if (consulta.status === "agendado" || consulta.status === "sala_espera") {
      handleStatusChange(consulta.id, "em_andamento");
    }
  };

  const handleFinishConsulta = async (id: string, prontuarioData: any) => {
    setConsultas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "concluido",
              prontuario: {
                ...c.prontuario,
                ...prontuarioData,
              },
            }
          : c
      )
    );

    try {
      await fetch(`/api/telemedicina/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "concluido",
          prontuarioData,
        }),
      });
    } catch (err) {
      console.error("Erro ao finalizar consulta:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Bar Superior Padronizada do Design System (Sem H1 duplicado) */}
      <TelemedicinaActionBar
        totalHoje={totalHoje}
        totalEmEspera={totalEmEspera}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenDeviceTest={() => setIsDeviceTestOpen(true)}
      />

      {/* Cards Métricos Liquid Glass */}
      <TelemedicinaStats
        totalHoje={totalHoje}
        totalEmEspera={totalEmEspera}
        totalEmAndamento={totalEmAndamento}
        totalConcluidas={totalConcluidas}
      />

      {/* Grid de Consultas com Abas Tipo Pílula */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center text-zinc-400 gap-3">
          <div className="w-8 h-8 border-3 border-rd-cyan/30 border-t-rd-cyan rounded-full animate-spin" />
          <p className="text-xs font-semibold">Carregando painel de telemedicina...</p>
        </div>
      ) : (
        <TelemedicinaList
          consultas={filteredConsultas}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          onEnterRoom={handleEnterRoom}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onOpenNewModal={() => setIsNewModalOpen(true)}
        />
      )}

      {/* Modal de Nova Teleconsulta */}
      <NewTelemedicinaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreated={(newC) => {
          setConsultas((prev) => [newC, ...prev]);
        }}
      />

      {/* Modal de Teste de Periféricos */}
      <DeviceTestModal
        isOpen={isDeviceTestOpen}
        onClose={() => setIsDeviceTestOpen(false)}
      />

      {/* Sala de Teleconsulta ao Vivo com AI Scribe */}
      <TelemedicinaRoomModal
        consulta={activeRoomConsulta}
        isOpen={!!activeRoomConsulta}
        onClose={() => setActiveRoomConsulta(null)}
        onFinishConsulta={handleFinishConsulta}
      />
    </div>
  );
}
