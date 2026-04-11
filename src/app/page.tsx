'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const { verifyPin, profile } = useAuth();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick Access PIN State
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState('');

  const handleNumClick = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        handlePinAuth(newPin);
      }
    }
  };

  const handlePinAuth = async (pinValue: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      if (!profile) {
        throw new Error('Realize o login com senha primeiro para ativar o PIN.');
      }
      
      const isValid = await verifyPin(profile.id, pinValue);
      if (isValid) {
        router.refresh();
      } else {
        setAuthError('PIN incorreto.');
        setPin('');
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Erro do PIN');
      setPin('');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      if (authMode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: 'individual_user' } }
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setAuthError('Verifique seu e-mail para confirmar a conta.');
        } else if (data.session) {
           router.refresh();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) router.refresh();
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Falha na autenticação');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Modal States
  const [showTerms, setShowTerms] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  // Global Settings State — default TRUE so buttons always visible until DB says otherwise
  const [showDemoAccess, setShowDemoAccess] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'show_demo_access')
          .single();
        // Only hide if DB explicitly returns false — error/miss keeps buttons visible
        if (!error && data) {
          setShowDemoAccess(data.value === true || data.value === 'true');
        }
      } catch {
        // Keep default true on any failure
      }
    }
    fetchSettings();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-[#030712]">
      
      {/* Background ambient lighting - Teal themed */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-teal-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Floating Header */}
      <header className="z-20 absolute top-8 left-0 right-0 px-6 lg:px-12 flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.3)] border border-white/10">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-widest text-white leading-none">MED<span className="text-teal-400">CORE</span></span>
            <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">BioFlow Powered</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6 text-[11px] font-bold tracking-widest uppercase text-slate-400">
          <span className="cursor-pointer hover:text-teal-400 transition-colors">Suporte</span>
          <span className="flex items-center gap-2 cursor-pointer text-teal-400 bg-teal-500/5 px-3 py-1.5 rounded-full border border-teal-500/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            Sistema Ativo
          </span>
        </div>
      </header>

      {/* Main Glass Content */}
      <div className="z-10 w-full max-w-md mt-16">
        <section className="cc-card p-1 sm:p-1 overflow-visible">
          <div className="p-8 sm:p-10 bg-slate-900/40 backdrop-blur-3xl rounded-[19px]">
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">Bem-vindo</h1>
              <p className="text-slate-400 text-sm font-medium italic">"Excelência em Gestão e Organização Estratégica."</p>
            </div>

            {/* Auth Service Tabs */}
            <div className="flex w-full bg-slate-950/50 rounded-2xl p-1.5 mb-8 border border-white/5">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 text-[11px] font-bold py-2.5 rounded-xl transition-all ${authMode === 'login' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                LOGIN
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 text-[11px] font-bold py-2.5 rounded-xl transition-all ${authMode === 'register' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                CADASTRO
              </button>
            </div>

            {pinMode ? (
              /* PIN BLOCK (Quick Access) */
              <div className="flex flex-col gap-6 flex-1 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">PIN de Segurança</span>
                  <button onClick={() => { setPinMode(false); setPin(''); }} className="text-[10px] text-slate-500 hover:text-white underline font-bold transition-colors">Usar Senha</button>
                </div>
                
                <div className="flex justify-center gap-3 mb-4">
                  {[0, 1, 2, 3].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.8)] scale-110' : 'bg-white/10'}`} />
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button key={num} onClick={() => handleNumClick(num)} className="cc-form-input aspect-square font-black text-lg hover:bg-teal-500/10 hover:border-teal-500/30 flex items-center justify-center transition-all bg-slate-900/50" disabled={isAuthenticating}>
                      {num}
                    </button>
                  ))}
                  <button onClick={() => setPin('')} className="text-[10px] text-slate-500 uppercase font-black" disabled={isAuthenticating}>C</button>
                  <button onClick={() => handleNumClick(0)} className="cc-form-input aspect-square font-black text-lg hover:bg-teal-500/10 hover:border-teal-500/30 flex items-center justify-center transition-all bg-slate-900/50" disabled={isAuthenticating}>0</button>
                  <button onClick={() => setPin(prev => prev.slice(0, -1))} className="text-[10px] text-slate-500 uppercase font-black" disabled={isAuthenticating}>Del</button>
                </div>

                {authError && (
                  <div className="text-[10px] font-bold text-red-500 text-center bg-red-500/5 border border-red-500/20 p-3 rounded-xl">
                    {authError}
                  </div>
                )}
              </div>
            ) : (
              /* EMAIL/PASS BLOCK */
              <form onSubmit={handleAuth} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail corporativo</label>
                    <input 
                      type="email" 
                      placeholder="seu@exemplo.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cc-form-input bg-slate-950/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</label>
                      <button type="button" className="text-[9px] text-teal-500 hover:text-teal-400 font-bold transition-colors">Esqueceu a senha?</button>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="cc-form-input bg-slate-950/50"
                      required
                    />
                  </div>
                </div>

                {authError && (
                  <div className="text-[10px] font-bold text-red-400 text-center bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                    {authError}
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={isAuthenticating} 
                    className="w-full flex items-center justify-center h-12 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 shadow-[0_4px_20px_rgba(13,148,136,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {isAuthenticating ? 'PROCESSANDO...' : (authMode === 'login' ? 'ENTRAR NO PORTAL' : 'CRIAR MINHA CONTA')}
                  </button>
                  
                  {authMode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setPinMode(true)}
                      className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-widest pt-2"
                    >
                      Acessar com PIN de Segurança
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        {showDemoAccess && (
          <div className="mt-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-[1px] bg-white/5 flex-1" />
              <p className="text-[10px] font-black text-teal-500/50 uppercase tracking-[0.4em]">Acesso Rápido • Demo</p>
              <div className="h-[1px] bg-white/5 flex-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <Link href="/admin" className="cc-card p-4 flex flex-col items-center gap-2 hover:border-teal-500/40 group transition-all bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">🛡️</div>
                  <span className="text-[11px] font-bold text-white group-hover:text-teal-400 transition-colors">Super Admin</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Controle Global</span>
               </Link>
               <Link href="/management" className="cc-card p-4 flex flex-col items-center gap-2 hover:border-teal-500/40 group transition-all bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">🏢</div>
                  <span className="text-[11px] font-bold text-white group-hover:text-teal-400 transition-colors">Gestão</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Unidade Clínica</span>
               </Link>
               <Link href="/workspace" className="cc-card p-4 flex flex-col items-center gap-2 hover:border-teal-500/40 group transition-all bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">👨‍⚕️</div>
                  <span className="text-[11px] font-bold text-white group-hover:text-teal-400 transition-colors">Workspace</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Corpo Clínico</span>
               </Link>
               <Link href="/dashboard" className="cc-card p-4 flex flex-col items-center gap-2 hover:border-teal-500/40 group transition-all bg-slate-900/20 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">🧬</div>
                  <span className="text-[11px] font-bold text-white group-hover:text-teal-400 transition-colors">BioFlow</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Mind-Map AI</span>
               </Link>
            </div>
          </div>
        )}
      </div>

      {/* Institutional Footer */}
      <footer className="z-10 mt-auto py-10 w-full max-w-7xl mx-auto px-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span className="text-[11px] font-bold text-slate-500">Developed by <span className="text-slate-300">Conte Core Technologies</span></span>
          <span className="text-[10px] text-slate-600">© 2026 MedCore Excellence in Healthcare.</span>
        </div>

        <div className="flex gap-4 sm:gap-8">
          <button onClick={() => setShowTerms(true)} className="text-[10px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.14em]">Termos de Uso</button>
          <button onClick={() => setShowSecurity(true)} className="text-[10px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.14em]">Segurança</button>
          <button className="text-[10px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.14em]">Privacidade</button>
          <button className="text-[10px] font-bold text-slate-500 hover:text-teal-400 transition-colors uppercase tracking-[0.14em]">Suporte</button>
        </div>
      </footer>

      {/* Modals */}
      {(showTerms || showSecurity) && (
        <div className="z-[100] fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="cc-card max-w-lg w-full p-8 border-teal-500/30">
            <h2 className="text-xl font-bold text-white mb-4">
              {showTerms ? 'Termos de Uso MedCore' : 'Segurança da Informação'}
            </h2>
            <div className="text-slate-400 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-4 mb-8">
              {showTerms ? (
                <>
                  <p className="mb-4">Ao acessar a plataforma MedCore, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. A MedCore Excellence in Healthcare preza pela transparência e ética em todos os seus processos de gestão hospitalar.</p>
                  <p>A utilização dos dados aqui processados segue rigorosamente a Lei Geral de Proteção de Dados (LGPD) e diretrizes internacionais de saúde.</p>
                </>
              ) : (
                <>
                  <p className="mb-4">Nossa infraestrutura utiliza criptografia de nível militar (AES-256) e protocolos de autenticação mútua. Todos os seus dados de saúde são armazenados em nuvens seguras com redundância geográfica e auditoria contínua de segurança.</p>
                  <p>Implementamos monitoramento em tempo real contra invasões e sistemas de backup automático para garantir a integridade total do seu prontuário e operações clínicas.</p>
                </>
              )}
            </div>
            <button 
              onClick={() => { setShowTerms(false); setShowSecurity(false); }}
              className="cc-btn-primary w-full"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}

    </main>

  );
}
