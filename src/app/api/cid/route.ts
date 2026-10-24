import { NextResponse } from "next/server";
import { DIAGNOSTICOS_CID10_BASE } from "@/lib/data/tussCidSeed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query) {
      return NextResponse.json({ success: true, data: DIAGNOSTICOS_CID10_BASE });
    }

    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedQuery = normalize(query);

    const filtered = DIAGNOSTICOS_CID10_BASE.filter(
      (c) =>
        normalize(c.codigo).includes(normalizedQuery) ||
        normalize(c.descricao).includes(normalizedQuery) ||
        normalize(c.capitulo).includes(normalizedQuery)
    );

    return NextResponse.json({ success: true, data: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
