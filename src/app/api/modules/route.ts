import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const modules = await prisma.systemModule.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json([
        { id: "1", code: "dashboard", name: "Visão Geral", icon: "LayoutDashboard", route: "/dashboard", active: true },
        { id: "2", code: "pacientes", name: "Pacientes", icon: "Users", route: "/dashboard/pacientes", active: true },
        { id: "3", code: "kanban", name: "Kanban Operacional", icon: "Kanban", route: "/dashboard/kanban", active: true },
        { id: "4", code: "demandas", name: "Demandas", icon: "ListTodo", route: "/dashboard/demandas", active: true },
        { id: "5", code: "lembretes", name: "Lembretes", icon: "Bell", route: "/dashboard/lembretes", active: true },
        { id: "6", code: "configuracoes", name: "Configurações", icon: "Settings", route: "/dashboard/configuracoes", active: true }
      ]);
    }
    return NextResponse.json([], { status: 500 });
  }
}
