import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export interface AuditLogItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: { fullName: string | null; email: string };
  ipAddress?: string;
}

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-001",
    action: "ACESSO_PRONTUARIO",
    details: "Visualização do prontuário médico #PRON-8921 sob consentimento do titular (Art. 7º, I - LGPD)",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    user: { fullName: "Dr. Felipe Azevedo", email: "felipe.azevedo@medcore.com.br" },
    ipAddress: "192.168.1.45"
  },
  {
    id: "log-002",
    action: "REGISTRO_PONTO_FACIAL",
    details: "Marcação de Ponto via Totem Biométrico Facial (Portaria MTP 671/2021) • Protocolo MTE-REP-492104",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: { fullName: "Dra. Beatriz Albuquerque", email: "beatriz.albuquerque@medcore.com.br" },
    ipAddress: "192.168.1.102"
  },
  {
    id: "log-003",
    action: "EXPORTACAO_RELATORIO_BI",
    details: "Download do Relatório de Indicadores Executivos em PDF gerado com assinatura digital SHA-256",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: { fullName: "Administrador Geral", email: "admin@medcore.com.br" },
    ipAddress: "187.54.210.8"
  },
  {
    id: "log-004",
    action: "CONSENTIMENTO_LGPD",
    details: "Assinatura do Termo de Consentimento para Tratamento de Dados Pessoais Sensíveis de Saúde",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user: { fullName: "Mariana Santos", email: "mariana.santos@medcore.com.br" },
    ipAddress: "192.168.1.77"
  },
  {
    id: "log-005",
    action: "AUTENTICACAO_MFA",
    details: "Login de alta segurança com duplo fator de autenticação (MFA/2FA) aprovado",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    user: { fullName: "Carlos Eduardo Mendes", email: "carlos.mendes@medcore.com.br" },
    ipAddress: "177.132.40.19"
  }
];

declare global {
  var __medcoreAuditLogs: AuditLogItem[] | undefined;
}

if (!globalThis.__medcoreAuditLogs) {
  globalThis.__medcoreAuditLogs = [...DEFAULT_AUDIT_LOGS];
}

export function recordAuditLog(item: {
  action: string;
  details: string;
  user?: { fullName?: string | null; email?: string };
  ipAddress?: string;
}) {
  const newEntry: AuditLogItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: item.action,
    details: item.details,
    createdAt: new Date().toISOString(),
    user: {
      fullName: item.user?.fullName || "Administrador WebDev Master",
      email: item.user?.email || "admin@medcore.com.br"
    },
    ipAddress: item.ipAddress || "127.0.0.1 (Local/Proxy Seguro)"
  };

  if (!globalThis.__medcoreAuditLogs) {
    globalThis.__medcoreAuditLogs = [...DEFAULT_AUDIT_LOGS];
  }
  globalThis.__medcoreAuditLogs = [newEntry, ...globalThis.__medcoreAuditLogs];
  return newEntry;
}

export async function GET() {
  try {
    try {
      // Tenta buscar no banco se a tabela existir
      const anyPrisma = prisma as any;
      if (anyPrisma.auditLog) {
        const logs = await anyPrisma.auditLog.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { fullName: true, email: true }
            }
          },
          take: 100
        });

        if (logs && logs.length > 0) {
          const mappedDbLogs: AuditLogItem[] = logs.map((l: any) => ({
            id: l.id,
            action: l.action,
            details: l.details,
            createdAt: l.createdAt.toISOString(),
            user: {
              fullName: l.user?.fullName || 'Usuário',
              email: l.user?.email || 'sistema@medcore.com.br'
            },
            ipAddress: l.ipAddress || undefined
          }));

          // Mescla com logs em memória mais recentes
          const ids = new Set(mappedDbLogs.map(m => m.id));
          const memoryAdditions = (globalThis.__medcoreAuditLogs || []).filter(m => !ids.has(m.id));
          return NextResponse.json([...memoryAdditions, ...mappedDbLogs]);
        }
      }
    } catch {
      // Ignora falha de DB
    }

    return NextResponse.json(globalThis.__medcoreAuditLogs || DEFAULT_AUDIT_LOGS);
  } catch (error) {
    console.error('Erro ao buscar logs de auditoria:', error);
    return NextResponse.json(globalThis.__medcoreAuditLogs || DEFAULT_AUDIT_LOGS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, details, user, ipAddress } = body;

    if (!action) {
      return NextResponse.json({ error: "Ação é obrigatória" }, { status: 400 });
    }

    const recorded = recordAuditLog({
      action,
      details: details || null,
      user: user || { fullName: "Administrador WebDev Master", email: "admin@medcore.com.br" },
      ipAddress: ipAddress || "127.0.0.1"
    });

    try {
      const anyPrisma = prisma as any;
      if (anyPrisma.auditLog) {
        await anyPrisma.auditLog.create({
          data: {
            action,
            details: details || null,
            userId: user?.id || "admin-demo-id",
            ipAddress: ipAddress || null
          }
        });
      }
    } catch {
      // Log garantido em memória
    }

    return NextResponse.json({ success: true, log: recorded });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
