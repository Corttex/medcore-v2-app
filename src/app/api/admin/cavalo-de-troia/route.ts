import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService } from "@/lib/services/saasWarRoomService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") === "true";
    const trojans = saasWarRoomService.getTrojanHorseLeads(isDemo);

    return NextResponse.json({ trojans });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar leads Cavalo de Troia" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trojanId, tenantId, commissionCents = 15000 } = body;

    if (!trojanId || !tenantId) {
      return NextResponse.json(
        { error: "trojanId e tenantId são obrigatórios" },
        { status: 400 }
      );
    }

    const converted = saasWarRoomService.markTrojanConverted(trojanId, tenantId, commissionCents);
    return NextResponse.json({ success: true, item: converted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao processar conversão Cavalo de Troia" },
      { status: 500 }
    );
  }
}
