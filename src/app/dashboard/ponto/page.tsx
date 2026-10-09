"use client";

import React, { useState, useEffect } from "react";
import { Clock, MapPin, CheckCircle2, History, AlertCircle, Fingerprint } from "lucide-react";
import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";

export default function PontoEletronicoPage() {
  const { selectedUnitId } = useDashboardContext();
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<any[]>([]);
  const [locationStatus, setLocationStatus] = useState<"pending" | "ok" | "error">("pending");
  const [locationData, setLocationData] = useState<GeolocationCoordinates | null>(null);

  // Relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Busca histórico inicial
  const fetchHistorico = async () => {
    try {
      // Como não temos user em contexto total nesse MVP, pegamos via API sem param e a API usa fallback
      const res = await fetch(`/api/ponto?unitId=${selectedUnitId}`);
      const data = await res.json();
      if (data.success) {
        setHistorico(data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  useEffect(() => {
    fetchHistorico();
  }, [selectedUnitId]);

  // Capturar Localização
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData(position.coords);
          setLocationStatus("ok");
        },
        (error) => {
          console.warn("Erro de GPS ou Permissão Negada:", error.message || error.code);
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("error");
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const baterPonto = async (tipo: string) => {
    setLoading(true);
    try {
      const payload = {
        tipo,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        precisao: locationData?.accuracy,
        unitId: selectedUnitId
      };

      const res = await fetch('/api/ponto', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert(`Ponto registrado com sucesso: ${tipo}`);
        fetchHistorico();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro de comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-on-surface">Ponto Eletrônico</h1>
        <p className="text-sm text-on-surface-variant mt-1 flex items-center gap-2">
          {locationStatus === "ok" ? (
            <span className="flex items-center gap-1 text-emerald-500"><MapPin size={14}/> Localização capturada</span>
          ) : locationStatus === "error" ? (
            <span className="flex items-center gap-1 text-error"><AlertCircle size={14}/> GPS Desabilitado ou sem sinal</span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500"><MapPin size={14}/> Buscando sinal GPS...</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Relógio e Ações */}
        <div className="bg-surface border-2 border-outline-variant/30 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-4 ring-primary/5">
            <Clock size={36} />
          </div>
          
          <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <h2 className="text-6xl font-heading font-bold text-on-surface tracking-tighter tabular-nums mb-8">
            {formatTime(time)}
          </h2>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => baterPonto("ENTRADA")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 rounded-2xl transition-all disabled:opacity-50"
            >
              <Fingerprint size={24} />
              <span className="font-semibold text-sm">Entrada</span>
            </button>
            <button 
              onClick={() => baterPonto("SAIDA_ALMOCO")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 rounded-2xl transition-all disabled:opacity-50"
            >
              <Fingerprint size={24} />
              <span className="font-semibold text-sm">Saída Almoço</span>
            </button>
            <button 
              onClick={() => baterPonto("RETORNO_ALMOCO")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 rounded-2xl transition-all disabled:opacity-50"
            >
              <Fingerprint size={24} />
              <span className="font-semibold text-sm">Retorno Almoço</span>
            </button>
            <button 
              onClick={() => baterPonto("SAIDA")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-error/10 hover:bg-error/20 border border-error/30 text-error rounded-2xl transition-all disabled:opacity-50"
            >
              <Fingerprint size={24} />
              <span className="font-semibold text-sm">Saída</span>
            </button>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-on-surface">
            <History size={20} />
            <h3 className="text-lg font-heading font-semibold">Histórico de Hoje</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {historico.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant flex flex-col items-center justify-center">
                <Clock size={32} className="opacity-20 mb-3" />
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              historico.map((registro) => (
                <div key={registro.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      registro.tipo === 'ENTRADA' ? 'bg-emerald-500' :
                      registro.tipo === 'SAIDA' ? 'bg-error' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {registro.tipo.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        {registro.statusLocal === 'VALIDO' ? (
                          <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={10} /> Local Válido</span>
                        ) : (
                          <span>Sem Localização</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-on-surface">
                      {new Date(registro.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
