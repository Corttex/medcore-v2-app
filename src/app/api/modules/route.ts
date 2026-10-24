import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const modules = await prisma.systemModule.findMany({
      orderBy: { id: "asc" }
    });
    
    // Se houver módulos no banco, garantir que todos estão com isEnabled: true
    if (modules && modules.length > 0) {
      return NextResponse.json(modules.map(m => ({ ...m, isEnabled: true, isInMaintenance: false })));
    }
  } catch (error) {
    console.warn("Fallback de módulos ativado:", error);
  }

  // Lista mestre completa de todos os módulos liberados no nível máximo
  const allModules = [
    { id: "dashboard", code: "dashboard", name: "Visão Geral", icon: "LayoutDashboard", route: "/dashboard", isEnabled: true, isInMaintenance: false },
    { id: "pacientes", code: "pacientes", name: "Pacientes", icon: "Users", route: "/dashboard/pacientes", isEnabled: true, isInMaintenance: false },
    { id: "agenda", code: "agenda", name: "Agenda Inteligente", icon: "Calendar", route: "/dashboard/agenda", isEnabled: true, isInMaintenance: false },
    { id: "mensagens", code: "mensagens", name: "WhatsApp & Omnichannel", icon: "MessageSquare", route: "/dashboard/mensagens", isEnabled: true, isInMaintenance: false },
    { id: "marketing", code: "marketing", name: "Marketing & Campanhas WhatsApp", icon: "Megaphone", route: "/dashboard/marketing", isEnabled: true, isInMaintenance: false },
    { id: "ia-executiva", code: "ia-executiva", name: "Dra. Conte IA Copilot", icon: "BrainCircuit", route: "/dashboard/ia-executiva", isEnabled: true, isInMaintenance: false },
    { id: "tiss", code: "tiss", name: "Faturamento & RPA TISS", icon: "Receipt", route: "/dashboard/tiss", isEnabled: true, isInMaintenance: false },
    { id: "prontuario", code: "prontuario", name: "Prontuário & AI Scribe", icon: "Stethoscope", route: "/dashboard/prontuario", isEnabled: true, isInMaintenance: false },
    { id: "telemedicina", code: "telemedicina", name: "Telemedicina", icon: "Video", route: "/dashboard/telemedicina", isEnabled: true, isInMaintenance: false },
    { id: "kanban", code: "kanban", name: "Kanban Operacional", icon: "Kanban", route: "/dashboard/kanban", isEnabled: true, isInMaintenance: false },
    { id: "demandas", code: "demandas", name: "Demandas", icon: "ListTodo", route: "/dashboard/demandas", isEnabled: true, isInMaintenance: false },
    { id: "lembretes", code: "lembretes", name: "Lembretes", icon: "Bell", route: "/dashboard/lembretes", isEnabled: true, isInMaintenance: false },
    { id: "loja", code: "loja", name: "Loja de Skills Dra. Conte", icon: "ShoppingBag", route: "/dashboard/loja", isEnabled: true, isInMaintenance: false },
    { id: "configuracoes", code: "configuracoes", name: "Configurações", icon: "Settings", route: "/dashboard/configuracoes", isEnabled: true, isInMaintenance: false }
  ];

  return NextResponse.json(allModules);
}

