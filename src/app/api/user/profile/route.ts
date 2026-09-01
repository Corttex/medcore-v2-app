import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Atualiza os dados do perfil do usuário logado
 */
export async function POST(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { full_name, crm, cargo, telefone, especialidade, email_corporativo } = body;

    const data = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: full_name,
        // crm, cargo, telefone, especialidade, email_corporativo podem ser adicionados ao modelo futuramente
      },
      select: {
        id: true,
        fullName: true,
        email: true
      }
    });

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
