import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { setSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    // Supabase retornou erro direto na URL
    if (errorParam) {
      console.error("[callback] OAuth error param:", errorParam);
      return NextResponse.redirect(`${origin}/login?error=oauth_denied`);
    }

    if (!code) {
      console.error("[callback] No code received");
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    // Sanitizar o parâmetro 'next'
    let next = searchParams.get("next") ?? "/dashboard";
    if (!next.startsWith("/") || next.startsWith("//")) {
      next = "/dashboard";
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[callback] exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    if (!data?.user) {
      console.error("[callback] No user in session data");
      return NextResponse.redirect(`${origin}/login?error=no_user`);
    }

    // Cria a sessão Orion
    await setSession({
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || "viewer",
      full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
      avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
    });

    return NextResponse.redirect(`${origin}${next}`);

  } catch (err: any) {
    console.error("[callback] Unexpected error:", err?.message || err);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=server_error`);
  }
}
