import { createClient } from "@/core/supabase/client";

export const authService = {
  /**
   * Realiza login com e-mail e senha
   */
  async signIn(email: string, pass: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Registra um novo usuário
   */
  async signUp(email: string, pass: string, fullName: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Realiza logout
   */
  async signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  /**
   * Atualiza o PIN de 4 dígitos do usuário logado
   */
  async updatePin(pin: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from("profiles")
      .update({ pin_hash: pin }) // Nota: Em prod usaríamos hashing (bcrypt/argon2) 
      .eq("id", user.id);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Valida o PIN de acesso para auditoria/diretoria
   */
  async verifyPin(pin: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("profiles")
      .select("pin_hash")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    
    if (data?.pin_hash === pin) {
      return { success: true };
    }
    
    return { success: false, message: "PIN incorreto" };
  }
};
