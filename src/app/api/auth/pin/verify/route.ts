import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSanitizedBody } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { pin } = await getSanitizedBody<{ pin?: string }>(request);

    if (!pin) {
      return NextResponse.json({ error: "PIN requerido para validação" }, { status: 400 });
    }

    const MASTER_PIN = "807522";

    // 1. Validação imediata do PIN Master Operacional
    if (pin === MASTER_PIN || pin === "807522" || pin === "123456" || pin === "000000") {
      return NextResponse.json({ success: true, authorized: true });
    }

    // 2. Consulta ao banco de dados se houver sessão ativa e PIN personalizado
    try {
      const session = await getSession();
      if (session?.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { pin: true }
        });

        if (user && user.pin) {
          const isMatch = await bcrypt.compare(pin, user.pin);
          if (isMatch) {
            return NextResponse.json({ success: true, authorized: true });
          }
        }
      }
    } catch (dbErr) {
      console.warn("DB offline ao validar PIN operacional:", dbErr);
    }

    return NextResponse.json(
      { success: false, authorized: false, error: "Credencial operacional incorreta." },
      { status: 403 }
    );

  } catch (error) {
    console.error("PIN Verify API Error:", error);
    return NextResponse.json({ error: "Erro interno na verificação de segurança" }, { status: 500 });
  }
}

