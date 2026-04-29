import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { setSession } from "@/lib/auth";
import { sanitize } from "@/lib/sanitize";

/**
 * Endpoint de Login com Hardening de Segurança.
 * Realiza autenticação via Supabase e emite um token JWT Orion de curta duração.
 */
export async function POST(request: Request) {
  try {
    // 1. Verificação de Variáveis de Ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("ERRO: Variáveis do Supabase não configuradas corretamente.");
      return NextResponse.json(
        { 
          error: "Configuração de servidor incompleta (Env Vars)",
          details: `Missing: ${!supabaseUrl ? "URL " : ""}${!supabaseKey ? "KEY" : ""}`
        },
        { status: 500 }
      );
    }

    if (!process.env.JWT_SECRET) {
       console.warn("AVISO: JWT_SECRET não definida. Usando fallback inseguro.");
    }

    // 2. Sanitização Global de Input
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const email = sanitize(body.email);
    const password = body.password; // NÃO sanitizar senha

    if (!email || !password) {
      return NextResponse.json(
        { error: "Credenciais incompletas" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 2. Autenticação via Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      console.error("Auth Error details:", authError);
      return NextResponse.json(
        { error: "Credenciais inválidas ou erro de autenticação", details: authError?.message },
        { status: 401 }
      );
    }

    // 3. Emissão de Token de Sessão Orion (JWT 3min)
    try {
      await setSession({
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || "viewer",
      });
    } catch (sessionError: any) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json(
        { error: "Erro ao criar sessão de acesso", details: sessionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error: any) {
    console.error("Global Login Route Error:", error);
    return NextResponse.json(
      { 
        error: "Erro crítico no servidor de autenticação",
        details: error.message || "Erro desconhecido",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
