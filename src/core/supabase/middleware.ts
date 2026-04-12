import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Bypass Total do Middleware para Fase Mock / Testes do Simulador
  // Evita erro 500 na Vercel caso variáveis de ambiente não estejam logadas
  return supabaseResponse;
}
