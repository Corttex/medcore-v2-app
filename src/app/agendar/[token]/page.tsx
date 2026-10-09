'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AgendamentoTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [agendamento, setAgendamento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    fetch(`/api/agendamento/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAgendamento(data.agendamento);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;
    
    setCanceling(true);
    try {
      const res = await fetch(`/api/agendamento/${token}`, { method: 'PATCH' });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro ao cancelar');
      
      setAgendamento({ ...agendamento, status: 'cancelado' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-[--color-on-surface-variant]">Buscando agendamento...</p>
      </div>
    );
  }

  if (error || !agendamento) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full border-red-200">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold text-[--color-on-surface] mb-2">Ops!</h2>
          <p className="text-red-500 mb-6">{error || 'Agendamento não encontrado.'}</p>
          <button 
            onClick={() => router.push('/agendar')}
            className="w-full bg-[--color-rd-navy] text-white p-3 rounded-lg font-semibold"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  const isCanceled = agendamento.status === 'cancelado';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Elementos Decorativos */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[--color-rd-cyan] opacity-10 blur-3xl"></div>
      
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isCanceled ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCanceled ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              )}
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[--color-on-surface]">
            {isCanceled ? 'Consulta Cancelada' : 'Agendamento Confirmado!'}
          </h2>
          {!isCanceled && (
            <p className="text-[--color-on-surface-variant] mt-2 text-sm">
              Sua consulta foi reservada com sucesso. Em breve você receberá um WhatsApp com as orientações.
            </p>
          )}
        </div>

        <div className="bg-background rounded-xl p-5 border border-[--color-outline-variant] space-y-3 mb-6">
          <div>
            <p className="text-xs text-[--color-on-surface-variant] uppercase tracking-wider font-semibold">Paciente</p>
            <p className="text-[--color-on-surface] font-medium">{agendamento.pacienteNome}</p>
          </div>
          <div>
            <p className="text-xs text-[--color-on-surface-variant] uppercase tracking-wider font-semibold">Especialista</p>
            <p className="text-[--color-on-surface] font-medium">{agendamento.profissionalNome}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-[--color-on-surface-variant] uppercase tracking-wider font-semibold">Data</p>
              <p className="text-[--color-on-surface] font-medium">{agendamento.date.split('-').reverse().join('/')}</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[--color-on-surface-variant] uppercase tracking-wider font-semibold">Hora</p>
              <p className="text-[--color-on-surface] font-medium">{agendamento.time}</p>
            </div>
          </div>
          <div>
             <p className="text-xs text-[--color-on-surface-variant] uppercase tracking-wider font-semibold mt-2">Status</p>
             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${isCanceled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
               {agendamento.status.toUpperCase()}
             </span>
          </div>
        </div>

        <div className="space-y-3">
          {!isCanceled && (
            <button 
              onClick={handleCancel}
              disabled={canceling}
              className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 p-3 rounded-lg font-semibold transition-all"
            >
              {canceling ? 'Cancelando...' : 'Cancelar Consulta'}
            </button>
          )}
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-transparent text-[--color-on-surface-variant] hover:text-[--color-on-surface] p-2 text-sm font-medium"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
