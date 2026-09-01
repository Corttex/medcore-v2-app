import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSanitizedBody } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sessão não identificada ou acesso negado" }, { status: 401 });
    }

    const { pin } = await getSanitizedBody<{ pin?: string }>(request);

    if (!pin) {
      return NextResponse.json({ error: "PIN requerido para validação" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pin: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Erro ao consultar registro operacional" }, { status: 500 });
    }

    const isMatch = await bcrypt.compare(pin, user.pin || "");

    if (isMatch) {
      return NextResponse.json({ success: true, authorized: true });
    }

    return NextResponse.json({ success: false, authorized: false, error: "Credencial operacional incorreta" }, { status: 403 });

  } catch (error) {
    console.error("PIN Verify API Error:", error);
    return NextResponse.json({ error: "Erro interno na verificação de segurança" }, { status: 500 });
  }
}
