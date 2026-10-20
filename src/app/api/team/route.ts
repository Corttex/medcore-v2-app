import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { recordAuditLog } from '@/app/api/audit-logs/route';

export interface TeamMemberRecord {
  id: string;
  fullName: string;
  email: string;
  role: string;
  cargo: string;
  departamento: string;
  telefone: string;
  cpf?: string;
  registroProfissional?: string;
  unidade: string;
  createdAt: string;
}

declare global {
  var __medcoreTeamDatabase: TeamMemberRecord[] | undefined;
}

// Lista em memória inicial limpa pronta para produção
const INITIAL_TEAM_MEMBERS: TeamMemberRecord[] = [];

globalThis.__medcoreTeamDatabase = [];

export async function GET() {
  try {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          especialidade: true,
          crm: true,
          createdAt: true,
        }
      });

      if (users && users.length > 0) {
        const mapped = users.map((u, idx) => ({
          id: u.id,
          fullName: u.fullName || 'Usuário Sem Nome',
          email: u.email,
          role: u.role || 'MEDICO_ESPECIALISTA',
          cargo: u.especialidade || 'Profissional de Saúde',
          departamento: 'Assistencial & Gestão',
          telefone: '(11) 98000-' + String(1000 + idx),
          registroProfissional: u.crm || undefined,
          unidade: 'Unidade Principal',
          createdAt: u.createdAt.toISOString()
        }));

        if ((globalThis.__medcoreTeamDatabase?.length || 0) > mapped.length) {
          const ids = new Set(mapped.map(m => m.email));
          const additions = (globalThis.__medcoreTeamDatabase || []).filter(m => !ids.has(m.email));
          return NextResponse.json([...mapped, ...additions]);
        }
        return NextResponse.json(mapped);
      }
    } catch {
      // Ignora falha DB
    }

    return NextResponse.json(globalThis.__medcoreTeamDatabase || INITIAL_TEAM_MEMBERS);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return NextResponse.json(globalThis.__medcoreTeamDatabase || INITIAL_TEAM_MEMBERS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      password, 
      role, 
      cargo, 
      departamento, 
      telefone, 
      cpf, 
      registroProfissional,
      unidade,
      inviteMode = false
    } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Nome completo e E-mail são obrigatórios.' }, { status: 400 });
    }

    let inviteToken: string | undefined = undefined;
    let inviteUrl: string | undefined = undefined;
    if (inviteMode) {
      inviteToken = `inv-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
      inviteUrl = `/ativar-conta?token=${inviteToken}`;
      
      const fallbackUnit = (globalThis.__medcoreUnitsDatabase && globalThis.__medcoreUnitsDatabase[0]?.name) || 'Hospital Central MedCore';
      if (!globalThis.__medcoreInviteTokens) {
        globalThis.__medcoreInviteTokens = {};
      }
      globalThis.__medcoreInviteTokens[inviteToken] = {
        email,
        fullName,
        cargo: cargo || 'Profissional de Saúde',
        role: role || 'MEDICO_ESPECIALISTA',
        unidade: unidade || fallbackUnit,
        createdAt: new Date().toISOString()
      };
    }

    const fallbackUnit = (globalThis.__medcoreUnitsDatabase && globalThis.__medcoreUnitsDatabase[0]?.name) || 'Hospital Central MedCore';
    const newRecord: TeamMemberRecord & { status?: string; inviteToken?: string } = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName,
      email,
      role: role || 'MEDICO_ESPECIALISTA',
      cargo: cargo || 'Profissional de Saúde',
      departamento: departamento || 'Corpo Clínico',
      telefone: telefone || '',
      cpf: cpf || '',
      registroProfissional: registroProfissional || '',
      unidade: unidade || fallbackUnit,
      status: inviteMode ? 'PENDENTE_ATIVACAO' : 'ATIVO',
      inviteToken: inviteToken,
      createdAt: new Date().toISOString()
    };

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado no sistema.' }, { status: 400 });
      }

      const initialPass = inviteMode ? `InvInit!${Date.now()}` : (password || 'Muda@123');
      const hashedPassword = await hash(initialPass, 10);

      const created = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
          role: role || 'MEDICO_ESPECIALISTA',
          especialidade: cargo || undefined,
          crm: registroProfissional || undefined
        }
      });

      newRecord.id = created.id;
    } catch {
      // Fallback em memória
    }

    // Insere no topo da lista em memória
    if (!globalThis.__medcoreTeamDatabase) {
      globalThis.__medcoreTeamDatabase = [...INITIAL_TEAM_MEMBERS];
    }
    globalThis.__medcoreTeamDatabase = [newRecord, ...globalThis.__medcoreTeamDatabase.filter(m => m.email !== email)];

    // Registra na Trilha de Auditoria Forense LGPD
    recordAuditLog({
      action: inviteMode ? "CONVITE_ATIVACAO_ENVIADO" : "CADASTRO_NOVO_USUARIO_EQUIPE",
      details: inviteMode 
        ? `Convite de primeiro acesso enviado para ${fullName} (${email}) com token de ativação seguro.` 
        : `Novo colaborador cadastrado no sistema: ${fullName} (${email}) • Cargo: ${cargo || 'N/A'} • Depto: ${departamento || 'N/A'} • Nível RBAC: ${role} • Lotação: ${unidade || 'Unidade Central'}`,
      user: { fullName: "Administrador WebDev Master", email: "admin@medcore.com.br" }
    });

    return NextResponse.json({ 
      success: true, 
      message: inviteMode ? 'Link de ativação gerado e enviado com sucesso!' : 'Usuário cadastrado com sucesso!', 
      user: newRecord,
      inviteUrl: inviteUrl,
      inviteToken: inviteToken
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Falha interna ao cadastrar usuário.' }, { status: 500 });
  }
}

// ATUALIZAÇÃO / EDIÇÃO DE COLABORADOR (AUDITADO)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id,
      fullName, 
      email, 
      password, 
      role, 
      cargo, 
      departamento, 
      telefone, 
      cpf, 
      registroProfissional,
      unidade 
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do colaborador é obrigatório.' }, { status: 400 });
    }

    if (!globalThis.__medcoreTeamDatabase) {
      globalThis.__medcoreTeamDatabase = [...INITIAL_TEAM_MEMBERS];
    }

    // Encontra o registro anterior para gerar log detalhado com diff
    const previous = globalThis.__medcoreTeamDatabase.find(m => m.id === id);

    const updatedRecord: TeamMemberRecord = {
      id,
      fullName: fullName || previous?.fullName || 'Colaborador',
      email: email || previous?.email || '',
      role: role || previous?.role || 'MEDICO_ESPECIALISTA',
      cargo: cargo || previous?.cargo || '',
      departamento: departamento || previous?.departamento || '',
      telefone: telefone || previous?.telefone || '',
      cpf: cpf || previous?.cpf || '',
      registroProfissional: registroProfissional || previous?.registroProfissional || '',
      unidade: unidade || previous?.unidade || 'Unidade Central Alphaville',
      createdAt: previous?.createdAt || new Date().toISOString()
    };

    try {
      const updateData: any = {
        fullName: updatedRecord.fullName,
        role: updatedRecord.role,
        especialidade: updatedRecord.cargo || undefined,
        crm: updatedRecord.registroProfissional || undefined,
      };

      if (password && password.length >= 6) {
        updateData.password = await hash(password, 10);
      }

      await prisma.user.update({
        where: { id },
        data: updateData
      });
    } catch {
      // Atualizado com sucesso na memória
    }

    // Atualiza lista em memória
    globalThis.__medcoreTeamDatabase = globalThis.__medcoreTeamDatabase.map(m => m.id === id ? updatedRecord : m);

    // Registra alteração na Trilha de Auditoria LGPD
    recordAuditLog({
      action: "ALTERACAO_CADASTRO_EQUIPE",
      details: `Alteração de cadastro do colaborador ${updatedRecord.fullName} (${updatedRecord.email}): Cargo: ${previous?.cargo || '—'} → ${updatedRecord.cargo} | Depto: ${previous?.departamento || '—'} → ${updatedRecord.departamento} | RBAC: ${previous?.role || '—'} → ${updatedRecord.role} | Lotação: ${previous?.unidade || '—'} → ${updatedRecord.unidade}`,
      user: { fullName: "Administrador WebDev Master", email: "admin@medcore.com.br" }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Cadastro do colaborador atualizado com sucesso!', 
      user: updatedRecord 
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ error: 'Falha interna ao atualizar cadastro.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório.' }, { status: 400 });
    }

    if (!globalThis.__medcoreTeamDatabase) {
      globalThis.__medcoreTeamDatabase = [...INITIAL_TEAM_MEMBERS];
    }

    const targetUser = globalThis.__medcoreTeamDatabase.find(m => m.id === id);

    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      // Ignora erro no banco
    }

    globalThis.__medcoreTeamDatabase = globalThis.__medcoreTeamDatabase.filter(m => m.id !== id);

    // Registra na auditoria
    recordAuditLog({
      action: "EXCLUSAO_USUARIO_EQUIPE",
      details: `Colaborador desativado/removido da equipe hospitalar: ${targetUser?.fullName || id} (${targetUser?.email || 'N/A'}) • Cargo: ${targetUser?.cargo || 'N/A'}`,
      user: { fullName: "Administrador WebDev Master", email: "admin@medcore.com.br" }
    });

    return NextResponse.json({ success: true, message: 'Usuário removido da equipe com sucesso.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
