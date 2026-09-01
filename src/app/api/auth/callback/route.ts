import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { encrypt, SESSION_EXPIRATION } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      console.error("[callback] OAuth error param:", errorParam);
      return NextResponse.redirect(`${origin}/login?error=oauth_denied`);
    }

    if (!code) {
      console.error("[callback] No code received");
      return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    let next = searchParams.get("next") ?? "/dashboard";
    if (!next.startsWith("/") || next.startsWith("//")) {
      next = "/dashboard";
    }

    // Cria a response de redirect primeiro
    const response = NextResponse.redirect(`${origin}${next}`);

    // Cria o client Supabase usando request/response (PKCE flow correto)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[callback] exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    if (!data?.user) {
      console.error("[callback] No user in session data");
      return NextResponse.redirect(`${origin}/login?error=no_user`);
    }

    // Cria o cookie de sessão Orion diretamente na response
    const expires = new Date(Date.now() + SESSION_EXPIRATION);
    const sessionToken = await encrypt({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "viewer",
        full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
        avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || "",
      },
      expires,
    });

    response.cookies.set("orion_session", sessionToken, {
      expires,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return response;

  } catch (err: any) {
    console.error("[callback] Unexpected error:", err?.message || err);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=server_error`);
  }
}
