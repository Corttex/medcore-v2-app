import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateMfaSecret, generateTotpUri } from "@/lib/security/mfa";

// Cache em memória de segredos MFA provisórios para o usuário
declare global {
  var __medcoreMfaSecrets: Record<string, string> | undefined;
}

if (!globalThis.__medcoreMfaSecrets) {
  globalThis.__medcoreMfaSecrets = {};
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sessão não identificada" }, { status: 401 });
    }

    const userId = session.user.id;
    let secret = globalThis.__medcoreMfaSecrets![userId];

    if (!secret) {
      secret = generateMfaSecret();
      globalThis.__medcoreMfaSecrets![userId] = secret;
    }

    const email = session.user.email || "admin@medcore.com.br";
    const otpauthUri = generateTotpUri(email, "MedCore Health Security", secret);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;

    return NextResponse.json({
      success: true,
      enabled: false,
      secret,
      otpauthUri,
      qrCodeUrl
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
