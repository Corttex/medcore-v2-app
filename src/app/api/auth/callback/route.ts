import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { setSession } from "@/lib/auth";
import { sanitize } from "@/lib/sanitize";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // Sanitização do parâmetro 'next' para evitar Open Redirect
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/dashboard";
  }
  next = sanitize(next);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Cria a sessão Orion baseada no usuário do Supabase
      await setSession({
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "viewer",
        full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
      });
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se houver erro, redireciona para login com erro
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
