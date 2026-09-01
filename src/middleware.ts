import { NextRequest, NextResponse } from "next/server";
import { updateSession, getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Ignora rotas públicas e recursos estáticos
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Atualiza a expiração da sessão e pega o token
  const session = await getSession();

  // Se for uma rota protegida e não tiver sessão, manda pro login
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Proteção rigorosa para rota Admin / SuperAdmin
    if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
      const role = session.user?.role;
      if (role !== "super_admin") {
        // Redireciona usuários normais para o dashboard principal
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.searchParams.set("error", "forbidden");
        return NextResponse.redirect(url);
      }
    }
  }

  // Renova a sessão do usuário ativo
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
