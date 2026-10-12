import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { recordAuditLog } from "@/app/api/audit-logs/route";

declare global {
  var __medcoreInviteTokens: Record<string, {
    email: string;
    fullName: string;
    cargo: string;
    role: string;
    unidade: string;
    createdAt: string;
  }> | undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token de convite não fornecido." }, { status: 400 });
  }

  const invites = globalThis.__medcoreInviteTokens || {};
  const invite = invites[token];

  if (!invite) {
    // Procura na base de equipe se tem alguém pendente com esse token
    const team = globalThis.__medcoreTeamDatabase || [];
    const member = team.find((m: any) => m.inviteToken === token);
    if (member) {
      return NextResponse.json({
        success: true,
        member: {
          fullName: member.fullName,
          email: member.email,
          cargo: member.cargo,
          role: member.role,
          unidade: member.unidade
        }
      });
    }

    return NextResponse.json({ error: "Convite inválido ou expirado." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    member: invite
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Token e senha são obrigatórios." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres." }, { status: 400 });
    }

    const invites = globalThis.__medcoreInviteTokens || {};
    let invite = invites[token];

    let memberEmail = invite?.email;
    let memberName = invite?.fullName || "Colaborador";
    let memberCargo = invite?.cargo || "Profissional de Saúde";

    if (!invite) {
      const team = globalThis.__medcoreTeamDatabase || [];
      const member = team.find((m: any) => m.inviteToken === token);
      if (member) {
        memberEmail = member.email;
        memberName = member.fullName;
        memberCargo = member.cargo;
      } else {
        return NextResponse.json({ error: "Token de ativação inválido ou expirado." }, { status: 404 });
      }
    }

    // Atualiza usuário no Prisma se existir
    try {
      if (memberEmail) {
        const hashedPassword = await hash(password, 10);
        await prisma.user.updateMany({
          where: { email: memberEmail },
          data: { password: hashedPassword }
        });
      }
    } catch (e) {
      // Ignora falha de DB remoto em dev
    }

    // Atualiza status na base em memória
    if (globalThis.__medcoreTeamDatabase) {
      globalThis.__medcoreTeamDatabase = globalThis.__medcoreTeamDatabase.map((m: any) => {
        if (m.email === memberEmail || m.inviteToken === token) {
          return {
            ...m,
            status: "ATIVO",
            activatedAt: new Date().toISOString(),
            inviteToken: undefined
          };
        }
        return m;
      });
    }

    // Remove token usado
    if (globalThis.__medcoreInviteTokens) {
      delete globalThis.__medcoreInviteTokens[token];
    }

    // Dispara Notificação em tempo real no Sino do Gestor / Diretor
    if (!globalThis.__medcoreNotifications) {
      globalThis.__medcoreNotifications = [];
    }
    globalThis.__medcoreNotifications.unshift({
      id: `notif-${Date.now()}`,
      type: "SUCESSO",
      title: "🎉 Primeiro Acesso Concluído",
      message: `${memberName} (${memberCargo}) ativou sua conta e realizou o primeiro acesso com sucesso!`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/dashboard/equipe"
    });

    // Registra trilha de auditoria LGPD
    recordAuditLog({
      action: "PRIMEIRO_ACESSO_COLABORADOR",
      details: `Conta ativada com sucesso pelo colaborador ${memberName} (${memberEmail}) com definição de senha pessoal definitiva.`,
      user: { fullName: memberName, email: memberEmail || "sistema" }
    });

    return NextResponse.json({
      success: true,
      message: "Conta ativada com sucesso! Você já pode realizar login no MedCore."
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno ao ativar conta." }, { status: 500 });
  }
}
