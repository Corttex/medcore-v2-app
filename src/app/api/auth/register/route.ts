import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";
import { setSession } from "@/lib/auth";
import { sanitize } from "@/lib/sanitize";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Configuração de servidor incompleta" },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
    }

    const email = sanitize(body.email);
    const fullName = sanitize(body.fullName);
    const password = body.password;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Dados incompletos para registro" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "viewer",
        },
      },
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Erro ao criar conta" },
        { status: 400 }
      );
    }

    await setSession({
      id: data.user.id,
      email: data.user.email,
      role: "viewer",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

  } catch (error: any) {
    console.error("Global Register Route Error:", error);
    return NextResponse.json(
      {
        error: "Erro crítico no servidor de registro",
        details: error.message || "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
