import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService } from "@/lib/services/saasWarRoomService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") === "true";
    const data = saasWarRoomService.getOverview(isDemo);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar dados do War Room" },
      { status: 500 }
    );
  }
}
