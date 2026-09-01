export const authService = {
  /**
   * Realiza login via API segura (Next.js API Routes)
   */
  async signIn(email: string, pass: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email, 
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
        email: email, 
        password: pass, 
        fullName: fullName 
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
  },

  /**
   * Atualiza o PIN de 4 dígitos via API segura
   */
  async updatePin(pin: string) {
    const res = await fetch("/api/auth/pin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pin }),
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
      body: JSON.stringify({ pin: pin }),
    });

    const data = await res.json();
    if (!res.ok && res.status !== 403) throw new Error(data.error || "Erro na validação de segurança");
    return data;
  },

  /**
   * Inicia autenticação via Google OAuth (Removido por migração do Supabase)
   */
  async signInWithGoogle() {
    console.log("Google OAuth temporariamente desativado após migração.");
    throw new Error("Login com Google está temporariamente indisponível.");
  }
};
