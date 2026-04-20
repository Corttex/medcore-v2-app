import { createClient } from "@/core/supabase/client";

export interface SystemModule {
  id: string;
  name: string;
  is_enabled: boolean;
  is_in_maintenance: boolean;
  maintenance_message?: string;
}

export const moduleService = {
  /**
   * Busca todos os módulos e seus estados do Supabase
   */
  async getModules(): Promise<SystemModule[]> {
    const supabase = createClient() as any;
    const { data, error } = await supabase
      .from("system_modules")
      .select("*")
      .order("id");

    if (error) {
      console.error("Erro ao buscar módulos:", error);
      // Retorno fallback caso a tabela não exista ainda ou erro de rede
      return [];
    }

    return data as SystemModule[];
  },

  /**
   * Monitora mudanças em tempo real nos módulos
   */
  subscribeToChanges(callback: (payload: any) => void) {
    const supabase = createClient() as any;
    return supabase
      .channel("system_modules_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_modules" },
        callback
      )
      .subscribe();
  }
};
