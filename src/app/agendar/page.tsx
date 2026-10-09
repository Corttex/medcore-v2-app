'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  QrCode, 
  Search,
  Stethoscope,
  Sparkles,
  Award,
  AlertTriangle,
  Lock,
  ExternalLink,
  Building,
  PhoneCall
} from 'lucide-react';

type Profissional = { id: string; fullName: string; email: string; especialidade?: string };
type UnitInfo = { id: string; name: string; type?: string; phone?: string; address?: string };

function AgendarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unitId = searchParams.get('unit') || '';
  
  // Status de validação da clínica: 'loading' | 'missing_unit' | 'invalid_unit' | 'ready'
  const [unitStatus, setUnitStatus] = useState<'loading' | 'missing_unit' | 'invalid_unit' | 'ready'>('loading');
  const [unitInfo, setUnitInfo] = useState<UnitInfo | null>(null);
  const [unitErrorMsg, setUnitErrorMsg] = useState('');

  const [step, setStep] = useState(1);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [selectedProfissional, setSelectedProfissional] = useState('');
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState('');
  const [horarios, setHorarios] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  
  const [formData, setFormData] = useState({
    pacienteNome: '',
    pacienteCpf: '',
    pacienteEmail: '',
    pacienteTelefone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agendamentoSucesso, setAgendamentoSucesso] = useState(false);
  const [tokenPublico, setTokenPublico] = useState('');

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Validar e carregar Clínica & Profissionais
  useEffect(() => {
    if (!unitId || unitId.trim() === '') {
      setUnitStatus('missing_unit');
      return;
    }

    setUnitStatus('loading');
    fetch(`/api/agendamento/profissionais?unit=${encodeURIComponent(unitId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setUnitErrorMsg(data.error || 'Clínica não encontrada ou link inválido.');
          setUnitStatus('invalid_unit');
          return;
        }

        if (data.unit) {
          setUnitInfo(data.unit);
          setProfissionais(data.profissionais || []);
          setUnitStatus('ready');
          
          // Pré-selecionar o profissional caso só exista 1
          if (data.profissionais && data.profissionais.length === 1) {
            setSelectedProfissional(data.profissionais[0].id);
          }
        } else {
          setUnitStatus('invalid_unit');
        }
      })
      .catch((err) => {
        console.error(err);
        setUnitErrorMsg('Falha de conexão com a clínica.');
        setUnitStatus('invalid_unit');
      });
  }, [unitId]);

  // 2. Buscar Horários ao selecionar data e profissional
  useEffect(() => {
    if (selectedProfissional && date) {
      setLoading(true);
      fetch(`/api/agendamento/horarios?profissionalId=${selectedProfissional}&date=${date}`)
        .then(res => res.json())
        .then(data => {
          if (data.availableSlots) setHorarios(data.availableSlots);
          setLoading(false);
        })
        .catch(() => {
          setError('Erro ao carregar horários.');
          setLoading(false);
        });
    }
  }, [selectedProfissional, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profissionalId: selectedProfissional,
          date,
          time: selectedTime,
          unitId,
          ...formData
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Falha ao agendar');
      
      setTokenPublico(data.tokenPublico || 'TK-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      setAgendamentoSucesso(true);
      setStep(4);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const profissionalSelecionadoObj = profissionais.find(p => p.id === selectedProfissional);

  const profissionaisFiltrados = profissionais.filter(p => {
    const term = searchTerm.toLowerCase();
    const nome = (p.fullName || p.email || '').toLowerCase();
    const esp = (p.especialidade || '').toLowerCase();
    return nome.includes(term) || esp.includes(term);
  });

  // Atalhos de datas
  const hojeStr = new Date().toISOString().split('T')[0];
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaStr = amanha.toISOString().split('T')[0];
  const depois = new Date();
  depois.setDate(depois.getDate() + 2);
  const depoisStr = depois.toISOString().split('T')[0];

  // ==========================================
  // CENÁRIO 1: LOADING INICIAL
  // ==========================================
  if (unitStatus === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Verificando autorização da clínica...</p>
      </div>
    );
  }

  // ==========================================
  // CENÁRIO 2: ACESSO SEM ID DA CLÍNICA (REGRA DE NEGÓCIO)
  // ==========================================
  if (unitStatus === 'missing_unit') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 font-body transition-colors">
        
        {/* Card de Bloqueio & Exclusividade */}
        <div className="max-w-lg w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl text-center space-y-6 animate-in zoom-in-95">
          
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mx-auto shadow-sm">
            <Lock size={30} />
          </div>

          <div>
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-3">
              Identificação da Clínica Obrigatória
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Portal de Agendamento Online
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
              O agendamento online é um serviço exclusivo disponibilizado individualmente por cada clínica e médico credenciado na plataforma MedCore.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
              <Building size={15} className="text-blue-600 dark:text-blue-400" />
              <span>Como agendar sua consulta:</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-normal">
              Para marcar seu atendimento, acesse diretamente o link personalizado fornecido pela sua clínica (ex: no WhatsApp, Instagram ou site oficial do consultório).
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <p className="text-[11px] text-zinc-500">
              É médico(a) ou gestor(a) de clínica? Acesse o painel para gerar seu link ou ativar o módulo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <User size={14} /> Acesso da Clínica (Login)
              </Link>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 mt-6">
          MedCore Tecnologia Hospitalar & Gestão Clínica
        </p>
      </div>
    );
  }

  // ==========================================
  // CENÁRIO 3: CLÍNICA INVÁLIDA OU NÃO ENCONTRADA
  // ==========================================
  if (unitStatus === 'invalid_unit') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-6 font-body transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto">
            <AlertTriangle size={30} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Link Não Encontrado</h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5">
              {unitErrorMsg || 'O link de agendamento informado é inválido ou expirou.'}
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500">
            Entre em contato com a recepção da sua clínica para solicitar um novo link de agendamento online.
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2"
          >
            Ir para a página de Login <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // CENÁRIO 4: CLÍNICA AUTORIZADA E ATIVA (PORTAL COMPLETO)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-body transition-colors">
      
      {/* Top Header Branding da Clínica */}
      <div className="max-w-2xl w-full flex justify-center mb-8">
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
            <Building size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                {unitInfo?.name || "Clínica"}
              </h1>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={10} /> Oficial
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Agendamento Online 24h</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-6 sm:p-10 rounded-3xl relative shadow-xl overflow-visible">
        
        {/* Subtle Decorative Glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
            <ShieldCheck size={18} className="shrink-0" /> {error}
          </div>
        )}

        <div className="relative z-10">
          
          {/* STEP 1: Profissional / Especialista */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                  Passo 1 de 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Escolha o Profissional</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Selecione o especialista para o seu atendimento em {unitInfo?.name}.</p>
              </div>

              {/* MODERN CUSTOM DROPDOWN SELECTOR */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                  Especialista / Médico
                </label>

                {/* Dropdown Trigger Box */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none shadow-sm ${
                    isDropdownOpen 
                      ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20' 
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-500/60 bg-zinc-50 dark:bg-zinc-800/50'
                  }`}
                >
                  {profissionalSelecionadoObj ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {profissionalSelecionadoObj.fullName ? profissionalSelecionadoObj.fullName.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                          {profissionalSelecionadoObj.fullName || profissionalSelecionadoObj.email}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5 flex items-center gap-1">
                          <Stethoscope size={12} />
                          {profissionalSelecionadoObj.especialidade || "Clínico Geral"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                      <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700/60 flex items-center justify-center shrink-0">
                        <Stethoscope size={18} />
                      </div>
                      <span className="text-sm font-medium">Selecione o especialista desejado...</span>
                    </div>
                  )}

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Floating Modern Options Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* Fast Search Filter */}
                    {profissionais.length > 3 && (
                      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <div className="relative">
                          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Buscar médico ou especialidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {/* Options List */}
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1.5 custom-blue-scrollbar">
                      {profissionaisFiltrados.length === 0 ? (
                        <div className="p-6 text-center text-xs text-zinc-500">
                          Nenhum especialista disponível nesta unidade.
                        </div>
                      ) : (
                        profissionaisFiltrados.map((p) => {
                          const isSelected = selectedProfissional === p.id;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedProfissional(p.id);
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                                isSelected 
                                  ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60' 
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  isSelected 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-blue-600 group-hover:text-white'
                                }`}>
                                  {p.fullName ? p.fullName.charAt(0).toUpperCase() : 'M'}
                                </div>
                                <div className="truncate">
                                  <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight truncate">
                                    {p.fullName || p.email}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                      {p.especialidade || "Clínico Geral"}
                                    </span>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-[10px] text-zinc-600 dark:text-zinc-300">Disponível</span>
                                  </div>
                                </div>
                              </div>

                              {isSelected && (
                                <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 ml-2" />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!selectedProfissional}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                Continuar para Data & Horário <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Data e Hora */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                  Passo 2 de 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Melhor Data e Hora</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Escolha o dia ideal para seu atendimento.</p>
              </div>

              {/* Atalhos rápidos de data */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                  Sugestões Rápidas de Dias
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setDate(hojeStr); setSelectedTime(''); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      date === hojeStr 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-500'
                    }`}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDate(amanhaStr); setSelectedTime(''); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      date === amanhaStr 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-500'
                    }`}
                  >
                    Amanhã
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDate(depoisStr); setSelectedTime(''); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      date === depoisStr 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-500'
                    }`}
                  >
                    Depois de amanhã
                  </button>
                </div>

                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                  Ou selecione no calendário:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={hojeStr}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setSelectedTime('');
                    }}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-zinc-900 dark:text-white shadow-sm font-medium transition-all"
                  />
                </div>
              </div>

              {date && (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                    Horários Disponíveis
                  </label>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : horarios.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {horarios.map(time => (
                         <button
                           key={time}
                           onClick={() => setSelectedTime(time)}
                           className={`p-3 rounded-xl text-sm font-bold transition-all border ${
                             selectedTime === time
                               ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-105'
                               : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                           }`}
                         >
                           {time}
                         </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-amber-700 dark:text-amber-300 text-sm font-medium text-center">
                      Nenhum horário disponível para esta data. Por favor escolha outro dia.
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 p-4 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedTime}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dados do Paciente */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-6">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full inline-block mb-2">
                  Passo 3 de 3
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Seus Dados Pessoais</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">Preencha para confirmarmos seu agendamento seguro em {unitInfo?.name}.</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold mb-1">Resumo da Consulta</p>
                  <p className="text-zinc-900 dark:text-white font-medium text-sm flex items-center gap-2">
                    <Calendar size={15} className="text-blue-600 dark:text-blue-400" /> {date.split('-').reverse().join('/')} 
                    <span className="text-zinc-300 dark:text-zinc-700">|</span> 
                    <Clock size={15} className="text-blue-600 dark:text-blue-400" /> {selectedTime}
                    <span className="text-zinc-300 dark:text-zinc-700">|</span> 
                    <span className="font-bold text-blue-600 dark:text-blue-400">{profissionalSelecionadoObj?.fullName}</span>
                  </p>
                </div>
                <button type="button" onClick={() => setStep(2)} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">Alterar</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
                    value={formData.pacienteNome}
                    onChange={e => setFormData({...formData, pacienteNome: e.target.value})}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">CPF *</label>
                  <input
                    required
                    type="text"
                    className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
                    value={formData.pacienteCpf}
                    onChange={e => setFormData({...formData, pacienteCpf: e.target.value})}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">Email *</label>
                    <input
                      required
                      type="email"
                      className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
                      value={formData.pacienteEmail}
                      onChange={e => setFormData({...formData, pacienteEmail: e.target.value})}
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">WhatsApp *</label>
                    <input
                      required
                      type="tel"
                      className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
                      value={formData.pacienteTelefone}
                      onChange={e => setFormData({...formData, pacienteTelefone: e.target.value})}
                      placeholder="(00) 90000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 p-4 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Confirmar Agendamento <CheckCircle2 size={18} /></>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Validação / Segurança / Sucesso */}
          {step === 4 && agendamentoSucesso && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Pré-Agendamento Concluído!</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                Seu horário está garantido em {unitInfo?.name}. Apresente este QR Code na recepção para liberação instantânea da sua consulta.
              </p>
              
              <div className="bg-white p-5 rounded-3xl inline-block border-2 border-zinc-200 dark:border-zinc-800 shadow-xl mt-4 relative group transition-transform hover:scale-102">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://app.medcore.com.br/verify/${tokenPublico}`} 
                  alt="QR Code de Verificação"
                  className="w-44 h-44 mx-auto relative z-10"
                />
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl p-4 max-w-sm mx-auto mt-4">
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 uppercase tracking-widest font-bold mb-1">Token de Entrada</p>
                <p className="font-mono text-xl text-blue-600 dark:text-blue-400 tracking-[0.2em] font-black">{tokenPublico}</p>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-4 max-w-xs mx-auto">
                Enviamos os detalhes com link de confirmação para {formData.pacienteEmail}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer de Segurança & Conformidade */}
      <div className="max-w-2xl w-full mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold">
           <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Criptografia Ponta a Ponta</span>
           <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {unitInfo?.name} • MedCore</span>
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-lg">
          Agendamento seguro em conformidade com as diretrizes do CFM e LGPD.
        </p>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-sm font-medium">Carregando portal...</p>
        </div>
      </div>
    }>
      <AgendarContent />
    </Suspense>
  );
}
