import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/core/supabase/server";

/**
 * Retorna os dados da sessão atual (JWT Orion) enriquecidos com dados do banco
 */
export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Busca dados frescos do perfil no banco de dados
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return NextResponse.json({
    user: {
      ...session.user,
      ...profile
    },
    expires: session.expires
  });
}
