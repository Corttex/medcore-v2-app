import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-replace-in-prod"
);

export const SESSION_EXPIRATION = 3 * 60 * 1000; // 3 minutos em ms

/**
 * Cria um novo token de sessão JWT.
 */
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("3m")
    .sign(secret);
}

/**
 * Verifica e decodifica um token JWT.
 */
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Cria um cookie de sessão seguro.
 */
export async function setSession(user: any) {
  const expires = new Date(Date.now() + SESSION_EXPIRATION);
  const session = await encrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set("orion_session", session, { 
    expires, 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

/**
 * Remove o cookie de sessão.
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("orion_session", "", { expires: new Date(0) });
}

/**
 * Obtém a sessão atual a partir dos cookies.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("orion_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

/**
 * Atualiza a expiração da sessão (Refresh).
 */
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("orion_session")?.value;
  if (!session) return null;

  // Verifica se o token é válido
  const parsed = await decrypt(session);
  if (!parsed) return null;

  // Atualiza o tempo de expiração
  parsed.expires = new Date(Date.now() + SESSION_EXPIRATION);
  const res = NextResponse.next();
  res.cookies.set({
    name: "orion_session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  return res;
}
