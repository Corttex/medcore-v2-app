import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService } from "@/lib/services/saasWarRoomService";
import { authService } from "@/features/authentication/authService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, confirmText } = body;

    // Gatekeeper duplo de segurança
    if (confirmText !== "ZERAR MEDCORE PRODUCAO") {
      return NextResponse.json(
        { error: "Confirmação textual inválida. Digite exatamente 'ZERAR MEDCORE PRODUCAO'" },
        { status: 400 }
      );
    }

    try {
      await authService.verifyPin(pin);
    } catch (e: any) {
      return NextResponse.json(
        { error: "PIN Master de Segurança incorreto. Ação abortada." },
        { status: 403 }
      );
    }

    const result = saasWarRoomService.resetToProduction();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao executar reset de produção" },
      { status: 500 }
    );
  }
}
