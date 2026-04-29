import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { setSession } from "@/lib/auth";
import { sanitize } from "@/lib/sanitize";

/**
 * Endpoint de Registro com Hardening de Segurança.
 * Cria o usuário no Supabase e emite o token JWT Orion.
 */
export async function POST(request: Request) {
    // 1. Verificação de Variáveis de Ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("ERRO: Variáveis do Supabase não configuradas corretamente no Registro.");
      return NextResponse.json(
        { 
          error: "Configuração de servidor incompleta (Env Vars)",
          details: `Missing: ${!supabaseUrl ? "URL " : ""}${!supabaseKey ? "KEY" : ""}`
        },
        { status: 500 }
      );
    }

    // 2. Sanitização Global de Input
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const email = sanitize(body.email);
    const fullName = sanitize(body.fullName);
    const password = body.password; // NÃO sanitizar senha

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Dados incompletos para registro" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 2. Registro via Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "viewer", // Default role
        },
      },
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Erro ao criar conta" },
        { status: 400 }
      );
    }

    // 3. Emissão de Token de Sessão Orion (JWT 3min)
    await setSession({
      id: data.user.id,
      email: data.user.email,
      role: "viewer",
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error: any) {
    console.error("Global Register Route Error:", error);
    return NextResponse.json(
      { 
        error: "Erro crítico no servidor de registro",
        details: error.message || "Erro desconhecido",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
