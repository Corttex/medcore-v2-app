import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { getSession } from "@/lib/auth";
import { getSanitizedBody } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

/**
 * Endpoint para verificar o PIN operacional do usuário.
 * Usado para auditoria e ações críticas.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sessão não identificada ou acesso negado" }, { status: 401 });
    }

    const { pin } = await getSanitizedBody<{ pin?: string }>(request);

    if (!pin) {
      return NextResponse.json({ error: "PIN requerido para validação" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("pin_hash")
      .eq("id", session.user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Erro ao consultar registro operacional" }, { status: 500 });
    }

    // Verificação segura do Hash do PIN
    const isMatch = await bcrypt.compare(pin, data.pin_hash || "");

    if (isMatch) {
      return NextResponse.json({ success: true, authorized: true });
    }

    return NextResponse.json({ success: false, authorized: false, error: "Credencial operacional incorreta" }, { status: 403 });

  } catch (error) {
    console.error("PIN Verify API Error:", error);
    return NextResponse.json({ error: "Erro interno na verificação de segurança" }, { status: 500 });
  }
}
