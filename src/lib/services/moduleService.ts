export interface SystemModule {
  id: string;
  name: string;
  isEnabled: boolean;
  isInMaintenance: boolean;
  maintenanceMessage?: string;
}

export const moduleService = {
  /**
   * Busca todos os módulos e seus estados via API interna (Prisma)
   */
  async getModules(): Promise<SystemModule[]> {
    try {
      const res = await fetch("/api/modules");
      if (!res.ok) return [];
      const data = await res.json();
      return data;
    } catch (error) {
      console.warn("Aviso: Falha temporária ao buscar módulos (servidor offline/reiniciando).", error);
      return [];
    }
  },

  /**
   * Monitora mudanças (Polling temporário até integração de WebSocket local)
   */
  subscribeToChanges(callback: (payload: any) => void) {
    const interval = setInterval(async () => {
      const data = await this.getModules();
      callback(data);
    }, 15000); // Polling a cada 15 segundos
    
    return {
      unsubscribe: () => clearInterval(interval)
    };
  }
};
