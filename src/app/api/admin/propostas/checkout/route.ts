import { NextRequest, NextResponse } from "next/server";
import { saasWarRoomService, OFFICIAL_MEDCORE_PLANS, PlanTier, BillingCycle } from "@/lib/services/saasWarRoomService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tier = "CLINICA" as PlanTier,
      billingCycle = "SEMIANNUAL" as BillingCycle,
      clinicName,
      doctorName,
      doctorPhone,
      doctorEmail,
      hasFirstMonthFree = true,
      waiveSetupFee = true,
      referredByAuxiliaryId,
      salesRepName = "Fellipe / Medcore Executivo",
      isDemo = false,
    } = body;

    const plan = OFFICIAL_MEDCORE_PLANS.find((p) => p.tier === tier) || OFFICIAL_MEDCORE_PLANS[2];
    const months = billingCycle === "ANNUAL" ? 12 : billingCycle === "SEMIANNUAL" ? 6 : billingCycle === "QUARTERLY" ? 3 : 1;
    const monthlyPrice = plan.monthlyPriceCents;
    const totalContractCents = monthlyPrice * months;

    const proposalId = "prop_" + Math.random().toString(36).substring(2, 9);
    const checkoutUrl = `/checkout/saas?prop=${proposalId}`;

    return NextResponse.json({
      success: true,
      proposal: {
        proposalId,
        checkoutUrl,
        plan,
        tier,
        billingCycle,
        months,
        monthlyPriceBrl: monthlyPrice / 100,
        totalContractBrl: totalContractCents / 100,
        setupFeeBrl: waiveSetupFee ? 0 : plan.setupFeeCents / 100,
        originalSetupFeeBrl: plan.setupFeeCents / 100,
        hasFirstMonthFree,
        firstChargeInDays: hasFirstMonthFree ? 30 : 0,
        clinicName,
        doctorName,
        doctorPhone,
        doctorEmail,
        referredByAuxiliaryId,
        salesRepName,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro ao gerar proposta de checkout" },
      { status: 500 }
    );
  }
}
