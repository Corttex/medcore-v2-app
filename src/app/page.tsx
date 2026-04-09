'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick Access PIN State (Optional usage)
  const [pinMode, setPinMode] = useState(false);
  const [pin, setPin] = useState('');

  const handleNumClick = (num: number) => {
    if (pin.length < 4) setPin(prev => prev + num);
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
          options: {
            data: {
              role: 'individual_user'
            }
          }
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setAuthError('Verifique seu e-mail para confirmar a conta.');
        } else if (data.session) {
           router.push('/bioflow'); // Padrão individual
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Middleware cuidará do roteamento ideal, mas vamos reverter para bioflow
        if (data.session) router.push('/bioflow');
      }
    } catch (error: any) {
      setAuthError(error.message || 'Falha na autenticação');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error.message || 'Falha ao iniciar Google Auth');
      setIsAuthenticating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 lg:p-12 relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-900/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-cyan-900/10 blur-[80px] rounded-full mix-blend-screen" />
      </div>

      {/* Header Compacto */}
      <div className="z-10 w-full max-w-6xl flex justify-between items-center mb-16 transition-all duration-1000">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-white text-[10px] font-bold">⚕</span>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-white/90">CONTE CORE</span>
        </div>
        <div className="hidden md:flex gap-4 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
          <span className="cursor-pointer hover:text-emerald-400 transition-colors">Suporte</span>
          <span className="flex items-center gap-1.5 cursor-pointer text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Operante
          </span>
        </div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4 drop-shadow-sm">
          Acesso Restrito
        </h1>
        <p className="text-zinc-400 max-w-lg text-sm font-light">
          Plataforma modular de gestão em saúde. Autentique-se para ter acesso ao seu workspace correspondente.
        </p>
      </div>

      <div className="z-10 flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center items-stretch">
        
        {/* Left Module: Fast Access Portals (Agora apenas 3 e mais compactos) */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          <div className="group relative card p-5 text-left overflow-hidden flex flex-col justify-between min-h-[120px] ring-1 ring-emerald-500/0 hover:ring-emerald-500/30 transition-all cursor-default">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center mb-2 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
              <span className="text-[10px]">01</span>
            </div>
            <div>
              <h2 className="relative z-10 text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">Empresa</h2>
              <p className="relative z-10 text-[10px] text-zinc-500 mt-1 line-clamp-2">Painel de gerenciamento administrativo corporativo.</p>
            </div>
          </div>

          <div className="group relative card p-5 text-left overflow-hidden flex flex-col justify-between min-h-[120px] ring-1 ring-emerald-500/0 hover:ring-emerald-500/30 transition-all cursor-default">
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center mb-2 text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
              <span className="text-[10px]">02</span>
            </div>
            <div>
              <h2 className="relative z-10 text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">Colaborador</h2>
              <p className="relative z-10 text-[10px] text-zinc-500 mt-1 line-clamp-2">Atendimento médico e fluxos operacionais.</p>
            </div>
          </div>

          <div className="group relative card p-5 text-left overflow-hidden flex flex-col justify-between min-h-[120px] ring-1 ring-cyan-500/0 hover:ring-cyan-500/30 transition-all cursor-default sm:col-span-2 lg:col-span-1">
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center mb-2 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
              <span className="text-[10px]">03</span>
            </div>
            <div>
              <h2 className="relative z-10 text-sm font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors">Indívidual</h2>
              <p className="relative z-10 text-[10px] text-zinc-500 mt-1 line-clamp-2">Dashboard auxiliar adm completo (BioFlow).</p>
            </div>
          </div>
        </div>

        {/* Right Module: Advanced Auth Panel */}
        <section className="w-full max-w-[320px] mx-auto filter drop-shadow-xl" aria-labelledby="login-title">
          <div className="card p-6 h-full flex flex-col">
            
            {/* Auth Service Tabs */}
            <div className="flex w-full bg-black/40 rounded-md p-1 mb-6 border border-zinc-800">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded transition-all ${authMode === 'login' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded transition-all ${authMode === 'register' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Cadastro
              </button>
            </div>
            
            {pinMode ? (
              /* PIN BLOCK */
              <div className="space-y-4 flex-1 flex flex-col transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Acesso Rápido</span>
                  <button onClick={() => setPinMode(false)} className="text-[10px] text-zinc-500 underline">Usar Senha</button>
                </div>
                
                <div className="flex justify-center gap-2 mb-2">
                  {[0, 1, 2, 3].map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${pin.length > i ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-zinc-800'}`} />
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button key={num} onClick={() => handleNumClick(num)} className="input-field aspect-square font-mono text-sm hover:bg-zinc-800" disabled={isAuthenticating}>
                      {num}
                    </button>
                  ))}
                  <button onClick={() => setPin('')} className="text-[10px] text-zinc-500 uppercase font-bold" disabled={isAuthenticating}>C</button>
                  <button onClick={() => handleNumClick(0)} className="input-field aspect-square font-mono text-sm hover:bg-zinc-800" disabled={isAuthenticating}>0</button>
                  <button onClick={() => setPin(prev => prev.slice(0, -1))} className="text-[10px] text-zinc-500 uppercase font-bold" disabled={isAuthenticating}>Del</button>
                </div>
                
                <button onClick={() => handleAuth()} disabled={pin.length < 4 || isAuthenticating} className="btn-primary w-full h-10 text-[10px] uppercase tracking-wider mt-2">
                  {isAuthenticating ? 'Validando...' : 'Entrar com PIN'}
                </button>
              </div>
            ) : (
              /* EMAIL/PASS + GOOGLE BLOCK */
              <form onSubmit={handleAuth} className="space-y-4 flex-1 flex flex-col transition-all">
                
                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black h-9 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {authMode === 'login' ? 'Continuar com Google' : 'Cadastrar com Google'}
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-px bg-zinc-800 flex-1" />
                  <span className="text-[10px] text-zinc-600 uppercase">ou e-mail</span>
                  <div className="h-px bg-zinc-800 flex-1" />
                </div>

                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="E-mail profissional" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full h-9 text-xs placeholder:text-zinc-600"
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full h-9 text-xs placeholder:text-zinc-600"
                    required
                  />
                </div>

                {authError && (
                  <div className="text-[10px] text-red-500 text-center bg-red-500/10 p-2 rounded">
                    {authError}
                  </div>
                )}

                <div className="mt-auto pt-4 space-y-2">
                  <button type="submit" disabled={isAuthenticating} className="btn-primary w-full h-10 text-[10px] uppercase tracking-wider">
                    {isAuthenticating ? 'Processando...' : (authMode === 'login' ? 'Entrar no Sistema' : 'Criar Conta')}
                  </button>
                  
                  {authMode === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setPinMode(true)}
                      className="w-full text-center text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors"
                    >
                      Acessar usando PIN Biométrico
                    </button>
                  )}
                </div>
              </form>
            )}

          </div>
        </section>
      </div>

    </main>
  );
}
