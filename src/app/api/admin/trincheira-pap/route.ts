import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService } from "@/lib/services/saasWarRoomService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDemo = searchParams.get("demo") === "true";
    const visits = saasWarRoomService.getFieldSalesVisits(isDemo);
    const overview = saasWarRoomService.getOverview(isDemo);

    return NextResponse.json({
      visits,
      stats: overview.papWarfare,
      financials: overview.financials,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao consultar dados da trincheira PAP" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      salesRepName,
      clinicName,
      doctorOrManagerName,
      secretaryName,
      secretaryPhone,
      regionOrSector,
      approachedGatekeeper = true,
      plantedTrojanHorse = false,
      did3MinLiveDemo = false,
      closedContractOnSpot = false,
      contractTierClosed,
      rejectionReason,
      objectionDetails,
      followUpAt,
      isDemo = false,
    } = body;

    if (!clinicName || !regionOrSector) {
      return NextResponse.json(
        { error: "Nome da clínica e Região/Setor são obrigatórios" },
        { status: 400 }
      );
    }

    const newVisit = saasWarRoomService.addFieldSalesVisit({
      salesRepName: salesRepName || "Fellipe / Consultor PAP",
      clinicName,
      doctorOrManagerName,
      secretaryName,
      secretaryPhone,
      regionOrSector,
      approachedGatekeeper,
      plantedTrojanHorse,
      did3MinLiveDemo,
      closedContractOnSpot,
      contractTierClosed,
      rejectionReason,
      objectionDetails,
      followUpAt,
      isDemo: Boolean(isDemo),
    });

    return NextResponse.json({ success: true, visit: newVisit });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao registrar visita PAP" },
      { status: 500 }
    );
  }
}
