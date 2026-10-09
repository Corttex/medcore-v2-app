'use client';

import React, { useEffect, useState } from 'react';
import { Download, FileText, CheckSquare, Square, DollarSign } from 'lucide-react';

export default function FaturamentoPage() {
  const [pendencias, setPendencias] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [convenios, setConvenios] = useState<any[]>([]);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedConvenio, setSelectedConvenio] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      const res = await fetch('/api/faturamento/tiss');
      const data = await res.json();
      setPendencias(data.pendencias || []);
      setLotes(data.lotes || []);
      
      // Criar um convênio mock se não vier nenhum do banco
      if (!data.convenios || data.convenios.length === 0) {
        setConvenios([{ id: 'mock-unimed', nome: 'Unimed (Mock)' }]);
      } else {
        setConvenios(data.convenios);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleGerarLote = async () => {
    if (selectedIds.size === 0) return alert('Selecione ao menos um atendimento.');
    const convenio = selectedConvenio || convenios[0]?.id;
    if (!convenio) return alert('Selecione um convênio.');

    setGenerating(true);
    try {
      const res = await fetch('/api/faturamento/tiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingIds: Array.from(selectedIds),
          convenioId: convenio
        })
      });
      
      if (res.ok) {
        alert('Lote gerado com sucesso!');
        setSelectedIds(new Set());
        fetchDados(); // recarrega
      } else {
        alert('Falha ao gerar lote.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-10">Carregando módulo financeiro...</div>;
  }

  return (
    <div className="min-h-screen bg-surface p-8 font-body">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[--color-rd-navy]">Faturamento TISS</h1>
            <p className="text-[--color-on-surface-variant]">Gestão de guias e exportação para convênios.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl border border-[--color-outline-variant] flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                 <DollarSign className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-xs text-[--color-on-surface-variant] uppercase font-bold">A Faturar</p>
                 <p className="text-xl font-bold text-[--color-on-surface]">{pendencias.length} guias</p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna 1: Pendências */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[--color-rd-navy]">Atendimentos Pendentes</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {pendencias.length === 0 ? (
                <div className="text-center py-10 text-[--color-on-surface-variant]">
                  Nenhum atendimento pendente para faturamento.
                </div>
              ) : (
                pendencias.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border border-[--color-outline-variant] flex items-center justify-between hover:border-[--color-rd-cyan] transition-colors cursor-pointer" onClick={() => toggleSelect(p.id)}>
                    <div className="flex items-center gap-4">
                      {selectedIds.has(p.id) ? (
                        <CheckSquare className="w-5 h-5 text-[--color-rd-cyan]" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300" />
                      )}
                      <div>
                        <p className="font-semibold text-[--color-on-surface]">{p.paciente?.nome}</p>
                        <p className="text-xs text-[--color-on-surface-variant]">Data: {p.date} • Hora: {p.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[--color-rd-navy]">Consulta</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Painel de Ação */}
            <div className="mt-4 pt-4 border-t border-[--color-outline-variant]">
              <div className="flex items-center gap-3">
                <select 
                  className="flex-1 p-3 bg-white border border-[--color-outline-variant] rounded-lg text-sm focus:border-[--color-rd-cyan] focus:outline-none"
                  value={selectedConvenio}
                  onChange={e => setSelectedConvenio(e.target.value)}
                >
                  <option value="">Selecione o Convênio...</option>
                  {convenios.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                <button 
                  onClick={handleGerarLote}
                  disabled={generating || selectedIds.size === 0}
                  className="bg-[--color-rd-coral] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {generating ? 'Gerando...' : `Gerar Lote (${selectedIds.size})`}
                </button>
              </div>
            </div>
          </div>

          {/* Coluna 2: Lotes Gerados */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[600px]">
            <h2 className="text-lg font-bold text-[--color-rd-navy] mb-6">Lotes Transmitidos (XML)</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {lotes.length === 0 ? (
                <div className="text-center py-10 text-[--color-on-surface-variant]">
                  Nenhum lote gerado ainda.
                </div>
              ) : (
                lotes.map(lote => (
                  <div key={lote.id} className="bg-white p-5 rounded-xl border border-[--color-outline-variant]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-[--color-rd-cyan]" />
                          <p className="font-bold text-[--color-rd-navy]">{lote.numero}</p>
                        </div>
                        <p className="text-xs text-[--color-on-surface-variant]">Gerado em: {new Date(lote.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {lote.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium">{lote.guias?.length || 0} guias incluídas</p>
                    </div>

                    <a 
                      href={`/api/faturamento/tiss/xml/${lote.id}`}
                      target="_blank"
                      download
                      className="w-full flex justify-center items-center gap-2 bg-[--color-rd-navy] hover:bg-blue-900 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Baixar XML TISS
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
