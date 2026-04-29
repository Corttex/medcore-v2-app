import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

// Whitelist de rotas públicas
const publicRoutes = ["/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/callback", "/favicon.ico", "/images"];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = request.cookies.get("orion_session")?.value;

  const isPublicRoute = nextUrl.pathname === "/" || publicRoutes.some(route => nextUrl.pathname.startsWith(route));
  const isStaticAsset = nextUrl.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  // Se estiver logado e tentar acessar a Home, manda para o Dashboard
  if (nextUrl.pathname === "/" && session && (await decrypt(session))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute || isStaticAsset) {
    return NextResponse.next();
  }

  // Se não houver sessão ou for inválida
  if (!session || !(await decrypt(session))) {
    // Para chamadas de API, retorna 401 Unauthorized em vez de redirecionar
    if (nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Sessão expirada ou acesso não autorizado" },
        { status: 401 }
      );
    }
    
    // Para rotas de página, redireciona para login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
