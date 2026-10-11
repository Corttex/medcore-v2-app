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
      {/* Action Bar Compacta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900/90 border-2 border-zinc-200 dark:border-zinc-700/80 px-5 py-3.5 rounded-2xl shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Clock className="text-rd-cyan" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Ponto Eletrônico Digital</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <div className="text-xs font-medium flex items-center gap-1.5">
            {locationStatus === "ok" ? (
              <span className="flex items-center gap-1 text-emerald-500 font-semibold"><MapPin size={13}/> GPS Capturado (Portaria 671)</span>
            ) : locationStatus === "error" ? (
              <span className="flex items-center gap-1 text-rose-500 font-semibold"><AlertCircle size={13}/> GPS Desabilitado</span>
            ) : (
              <span className="flex items-center gap-1 text-amber-500 font-semibold"><MapPin size={13}/> Conectando ao GPS...</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rd-cyan/10 border border-rd-cyan/30 text-rd-cyan">
            {historico.length} Batidas Registradas Hoje
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Relógio e Ações */}
        <div className="bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-8 shadow-md flex flex-col items-center justify-center text-center backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full bg-rd-cyan/10 flex items-center justify-center text-rd-cyan mb-6 ring-4 ring-rd-cyan/20">
            <Clock size={36} />
          </div>
          
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <h2 className="text-6xl font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tighter tabular-nums mb-8">
            {formatTime(time)}
          </h2>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => baterPonto("ENTRADA")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
            >
              <Fingerprint size={24} />
              <span>Entrada</span>
            </button>
            <button 
              onClick={() => baterPonto("SAIDA_ALMOCO")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
            >
              <Fingerprint size={24} />
              <span>Saída Almoço</span>
            </button>
            <button 
              onClick={() => baterPonto("RETORNO_ALMOCO")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-sky-500/10 hover:bg-sky-500/20 border-2 border-sky-500/30 text-sky-600 dark:text-sky-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
            >
              <Fingerprint size={24} />
              <span>Retorno Almoço</span>
            </button>
            <button 
              onClick={() => baterPonto("SAIDA")}
              disabled={loading}
              className="flex flex-col items-center justify-center gap-2 py-4 px-4 bg-rose-500/10 hover:bg-rose-500/20 border-2 border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl transition-all disabled:opacity-50 font-bold text-sm"
            >
              <Fingerprint size={24} />
              <span>Saída</span>
            </button>
          </div>
        </div>

        {/* Histórico */}
        <div className="bg-white dark:bg-zinc-900/85 border-2 border-zinc-200 dark:border-zinc-700/80 rounded-3xl p-6 shadow-md flex flex-col backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
            <History size={20} className="text-rd-cyan" />
            <h3 className="text-base font-bold">Histórico de Hoje</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {historico.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant flex flex-col items-center justify-center">
                <Clock size={32} className="opacity-20 mb-3" />
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              historico.map((registro) => (
                <div key={registro.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      registro.tipo === 'ENTRADA' ? 'bg-emerald-500' :
                      registro.tipo === 'SAIDA' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {registro.tipo.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                        {registro.statusLocal === 'VALIDO' ? (
                          <span className="text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 size={11} /> Local Válido</span>
                        ) : (
                          <span>Sem Localização</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-extrabold text-zinc-900 dark:text-zinc-100 tabular-nums">
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
