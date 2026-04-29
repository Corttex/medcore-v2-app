import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { getSession } from "@/lib/auth";
import { getSanitizedBody } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

/**
 * Endpoint para atualizar o PIN operacional do usuário.
 * Requer sessão JWT Orion válida.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sessão expirada ou acesso negado" }, { status: 401 });
    }

    const { pin } = await getSanitizedBody<{ pin?: string }>(request);

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: "PIN deve conter pelo menos 4 dígitos" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Hash do PIN para armazenamento seguro
    const pinHash = await bcrypt.hash(pin, 10);

    const { error } = await supabase
      .from("profiles")
      .update({ pin_hash: pinHash })
      .eq("id", session.user.id);

    if (error) {
      console.error("Database Update Error:", error);
      return NextResponse.json({ error: "Erro ao atualizar registro operacional" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "PIN atualizado com sucesso" });

  } catch (error) {
    console.error("PIN Update API Error:", error);
    return NextResponse.json({ error: "Erro interno no processamento do PIN" }, { status: 500 });
  }
}
