import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/core/supabase/server";

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

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        crm,
        cargo,
        telefone,
        especialidade,
        email_corporativo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
