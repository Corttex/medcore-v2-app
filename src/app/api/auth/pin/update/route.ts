import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSanitizedBody } from "@/lib/sanitize";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sessão expirada ou acesso negado" }, { status: 401 });
    }

    const { pin } = await getSanitizedBody<{ pin?: string }>(request);

    if (!pin || pin.length < 4) {
      return NextResponse.json({ error: "PIN deve conter pelo menos 4 dígitos" }, { status: 400 });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pin: pinHash }
    });

    return NextResponse.json({ success: true, message: "PIN atualizado com sucesso" });

  } catch (error) {
    console.error("PIN Update API Error:", error);
    return NextResponse.json({ error: "Erro interno no processamento do PIN" }, { status: 500 });
  }
}
