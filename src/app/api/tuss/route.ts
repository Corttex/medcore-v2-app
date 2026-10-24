import { NextResponse } from "next/server";
import { PROCEDIMENTOS_TUSS_BASE } from "@/lib/data/tussCidSeed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query) {
      return NextResponse.json({ success: true, data: PROCEDIMENTOS_TUSS_BASE });
    }

    const filtered = PROCEDIMENTOS_TUSS_BASE.filter(
      (p) =>
        p.codigo.toLowerCase().includes(query) ||
        p.descricao.toLowerCase().includes(query) ||
        p.grupo.toLowerCase().includes(query)
    );

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
