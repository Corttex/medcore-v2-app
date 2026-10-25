import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService } from "@/lib/services/saasWarRoomService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") === "true";
    const lockIns = saasWarRoomService.getLockInChecklists(isDemo);

    return NextResponse.json({ lockIns });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar checklists de Lock-in" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, ...updates } = body;

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId é obrigatório" }, { status: 400 });
    }

    const updated = saasWarRoomService.updateLockInChecklist(tenantId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Checklist não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao atualizar checklist de Lock-in" },
      { status: 500 }
    );
  }
}
