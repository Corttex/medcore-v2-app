import { NextResponse } from "next/server";

export interface SystemNotification {
  id: string;
  type: "CRITICO" | "SUCESSO" | "INFO" | "ALERTA";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

declare global {
  var __medcoreNotifications: SystemNotification[] | undefined;
}

const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-01",
    type: "CRITICO",
    title: "Sobrecarga no CTI (Setor Alpha)",
    message: "A capacidade de admissão superou 92%. Ação diretiva requerida.",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    read: false,
    link: "/dashboard/emergencia"
  },
  {
    id: "notif-02",
    type: "SUCESSO",
    title: "Relatório Estratégico Pronto",
    message: "Análise de eficiência cirúrgica semanal gerada pela IA Core.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: false,
    link: "/dashboard/relatorios"
  }
];

export async function GET() {
  if (!globalThis.__medcoreNotifications) {
    globalThis.__medcoreNotifications = [...DEFAULT_NOTIFICATIONS];
  }
  return NextResponse.json({
    success: true,
    notifications: globalThis.__medcoreNotifications,
    unreadCount: globalThis.__medcoreNotifications.filter(n => !n.read).length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, title, message, type, link } = body;

    if (!globalThis.__medcoreNotifications) {
      globalThis.__medcoreNotifications = [...DEFAULT_NOTIFICATIONS];
    }

    if (action === "MARK_AS_READ") {
      if (id) {
        globalThis.__medcoreNotifications = globalThis.__medcoreNotifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        );
      } else {
        globalThis.__medcoreNotifications = globalThis.__medcoreNotifications.map(n => ({ ...n, read: true }));
      }
      return NextResponse.json({ success: true, notifications: globalThis.__medcoreNotifications });
    }

    const newNotification: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: type || "INFO",
      title: title || "Nova Notificação",
      message: message || "",
      timestamp: new Date().toISOString(),
      read: false,
      link: link || undefined
    };

    globalThis.__medcoreNotifications = [newNotification, ...globalThis.__medcoreNotifications];

    return NextResponse.json({
      success: true,
      notification: newNotification,
      unreadCount: globalThis.__medcoreNotifications.filter(n => !n.read).length
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar notificação" }, { status: 500 });
  }
}
