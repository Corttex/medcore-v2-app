import { createClient } from "@/core/supabase/client";
import { sanitize } from "@/lib/sanitize";

export const authService = {
  /**
   * Realiza login via API segura (Next.js API Routes)
   */
  async signIn(email: string, pass: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: sanitize(email), 
        password: pass 
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao realizar login");
    return data;
  },

  /**
   * Registra via API segura
   */
  async signUp(email: string, pass: string, fullName: string) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: sanitize(email), 
        password: pass, 
        fullName: sanitize(fullName) 
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar conta");
    return data;
  },

  /**
   * Realiza logout limpando a sessão JWT
   */
  async signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Também limpa a sessão do Supabase no client por garantia
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  /**
   * Atualiza o PIN de 4 dígitos via API segura
   */
  async updatePin(pin: string) {
    const res = await fetch("/api/auth/pin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: sanitize(pin) }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao atualizar PIN operacional");
    return data;
  },

  /**
   * Valida o PIN de acesso via API segura
   */
  async verifyPin(pin: string) {
    const res = await fetch("/api/auth/pin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: sanitize(pin) }),
    });

    const data = await res.json();
    if (!res.ok && res.status !== 403) throw new Error(data.error || "Erro na validação de segurança");
    return data;
  },

  /**
   * Inicia autenticação via Google OAuth (Supabase)
   */
  async signInWithGoogle() {
    const supabase = createClient();
    
    // IMPORTANTE: Adicione o domínio da Vercel em 'Redirect URLs' no Dashboard do Supabase
    // URL: https://medcore-v2.vercel.app/api/auth/callback
    const redirectUrl = `${window.location.origin}/api/auth/callback`;
    
    console.log("Iniciando Google OAuth com redirect:", redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
  }
};
