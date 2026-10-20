import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_EXPIRATION, encrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Subdomain routing: if host starts with "ponto.", rewrite to /ponto
  if (hostname.startsWith("ponto.")) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/ponto";
      return NextResponse.rewrite(url);
    }
  }

  // Ignora rotas estáticas, públicas e APIs se não for admin
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname === "/sw.js" ||
    pathname === "/login" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("orion_session")?.value;

  // Se tentar acessar o dashboard sem cookie de sessão
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    const payload = await decrypt(sessionToken);
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    // Proteção para rota Admin / SuperAdmin
    if (pathname.startsWith("/dashboard/admin")) {
      const role = payload.user?.role;
      if (role !== "super_admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.searchParams.set("error", "forbidden");
        return NextResponse.redirect(url);
      }
    }
  }

  const response = NextResponse.next();

  // Cabeçalhos de Segurança Estritos (HSTS, Anti-Sniffing, Anti-Clickjacking)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(self), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};


