// =========================================================
// SAAS WAR ROOM - SERVIÇO DE DADOS & REGRAS DE NEGÓCIO
// Suporte a Produção Real (isDemo = false) e Apresentação (isDemo = true)
// =========================================================

export type PlanTier =
  | "ASSISTENTE"
  | "PROFISSIONAL"
  | "CLINICA"
  | "MEDICAL_AI"
  | "BUSINESS"
  | "CLINICA_INTELIGENTE";

export type BillingCycle = "MONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "ANNUAL";

export type SubscriptionStatus = "TRIAL_LOCKIN" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export type RejectionReason =
  | "GATEKEEPER_BLOCKED"
  | "ALREADY_HAS_LEGACY"
  | "PRICE_OBJECTION"
  | "NO_PERCEIVED_VALUE"
  | "FOLLOW_UP_SCHEDULED";

export interface SaaSPlan {
  id: string;
  tier: PlanTier;
  name: string;
  monthlyPriceCents: number;
  setupFeeCents: number;
  includedUsers: number;
  aiTokenQuotaMonth: number;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  planTier: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  mrrCents: number;
  totalContractCents: number;
  cashCollectedCents: number;
  hasFirstMonthFree: boolean;
  trialStartsAt: string;
  trialEndsAt: string;
  firstChargeDate: string;
  fidelityMonths: number;
  acquisitionChannel: string;
  salesRepId?: string;
  referredByAuxiliaryId?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface TenantLockInChecklist {
  id: string;
  tenantId: string;
  tenantName: string;
  whatsappConnected: boolean; // +20
  patientsImportedCount: number; // >= 50: +20
  kanbanAndTvConfigured: boolean; // +15
  inventoryAndAssetsCount: number; // >= 10: +15
  aiScribeConsultationsUsed: number; // >= 15: +30
  lockInScore: number; // 0 a 100
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  daysSinceStart: number;
  doctorName?: string;
  doctorPhone?: string;
  onboardingNotes?: string;
  isDemo: boolean;
  lastEvaluatedAt: string;
}

export interface FieldSalesVisit {
  id: string;
  salesRepName: string;
  clinicName: string;
  doctorOrManagerName?: string;
  secretaryName?: string;
  secretaryPhone?: string;
  regionOrSector: string;
  approachedGatekeeper: boolean;
  plantedTrojanHorse: boolean;
  did3MinLiveDemo: boolean;
  closedContractOnSpot: boolean;
  contractTierClosed?: PlanTier;
  rejectionReason?: RejectionReason;
  objectionDetails?: string;
  followUpAt?: string;
  isDemo: boolean;
  visitedAt: string;
}

export interface TrojanHorseLead {
  id: string;
  auxiliaryUserId: string;
  auxiliaryName: string;
  auxiliaryPhone: string;
  currentPlan: PlanTier;
  workplaceClinicName: string;
  workplaceDoctorName?: string;
  workplaceDoctorPhone?: string;
  estimatedDoctorsCount: number;
  weeklyTasksCompleted: number;
  weeklyMessagesTriaged: number;
  generatedFinancialReport: boolean;
  estimatedMoneySavedCents: number;
  upsellTemperature: "HOT" | "WARM" | "CONVERTED";
  convertedToTenantId?: string;
  commissionPaidCents: number;
  isDemo: boolean;
  createdAt: string;
}

export interface CampaignBudgetLog {
  id: string;
  monthReference: number; // 1, 2, 3...
  sourceType: "POCKET_CAPITAL" | "REINVESTED_CASHFLOW";
  channel: string;
  amountSpentCents: number;
  clicksGenerated: number;
  leadsGenerated: number;
  spentDate: string;
  isDemo: boolean;
}

export interface AiTelemetryUsage {
  id: string;
  tenantId: string;
  clinicName: string;
  doctorName: string;
  featureType: string;
  audioSeconds: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostBrlCents: number;
  planMonthlyBrlCents: number;
  createdAt: string;
}

// =========================================================
// PLANOS OFICIAIS MEDCORE
// =========================================================
export const OFFICIAL_MEDCORE_PLANS: SaaSPlan[] = [
  {
    id: "plan_assistente",
    tier: "ASSISTENTE",
    name: "Plano Assistente (Auxiliares & Recepção)",
    monthlyPriceCents: 2990,
    setupFeeCents: 0,
    includedUsers: 1,
    aiTokenQuotaMonth: 100000,
    isActive: true,
  },
  {
    id: "plan_profissional",
    tier: "PROFISSIONAL",
    name: "Plano Profissional (Acelerador de Carreira)",
    monthlyPriceCents: 5990,
    setupFeeCents: 0,
    includedUsers: 1,
    aiTokenQuotaMonth: 250000,
    isActive: true,
  },
  {
    id: "plan_clinica",
    tier: "CLINICA",
    name: "Plano Clínica (Até 5 Usuários)",
    monthlyPriceCents: 49700,
    setupFeeCents: 150000,
    includedUsers: 5,
    aiTokenQuotaMonth: 1000000,
    isActive: true,
  },
  {
    id: "plan_medical_ai",
    tier: "MEDICAL_AI",
    name: "Dra. Conte Medical AI (Scribe por Médico)",
    monthlyPriceCents: 69700,
    setupFeeCents: 150000,
    includedUsers: 1,
    aiTokenQuotaMonth: 2500000,
    isActive: true,
  },
  {
    id: "plan_business",
    tier: "BUSINESS",
    name: "Dra. Conte Business (Completo + TISS + RH)",
    monthlyPriceCents: 99700,
    setupFeeCents: 250000,
    includedUsers: 999,
    aiTokenQuotaMonth: 5000000,
    isActive: true,
  },
  {
    id: "plan_redes",
    tier: "CLINICA_INTELIGENTE",
    name: "Clínica Inteligente (Redes & Franquias)",
    monthlyPriceCents: 149700,
    setupFeeCents: 500000,
    includedUsers: 999,
    aiTokenQuotaMonth: 10000000,
    isActive: true,
  },
];

// =========================================================
// BANCO DE DADOS EM MEMÓRIA COM PERSISTÊNCIA COMPLETA
// =========================================================
class SaasWarRoomStore {
  private subscriptions: Subscription[] = [];
  private lockInChecklists: TenantLockInChecklist[] = [];
  private fieldSalesVisits: FieldSalesVisit[] = [];
  private trojanHorseLeads: TrojanHorseLead[] = [];
  private campaignBudgets: CampaignBudgetLog[] = [];
  private aiTelemetry: AiTelemetryUsage[] = [];

  constructor() {
    this.seedDemoData();
  }

  // Seed de dados demonstração (para apresentações a investidores)
  private seedDemoData() {
    // 1. Subscriptions Demo
    this.subscriptions = [
      {
        id: "sub_demo_1",
        tenantId: "tenant_demo_1",
        tenantName: "CardioVida Prime Brasília",
        planTier: "MEDICAL_AI",
        billingCycle: "SEMIANNUAL",
        status: "TRIAL_LOCKIN",
        mrrCents: 69700,
        totalContractCents: 418200,
        cashCollectedCents: 0,
        hasFirstMonthFree: true,
        trialStartsAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        trialEndsAt: new Date(Date.now() + 27 * 86400000).toISOString(),
        firstChargeDate: new Date(Date.now() + 27 * 86400000).toISOString(),
        fidelityMonths: 6,
        acquisitionChannel: "PAP_PRESENCIAL",
        isDemo: true,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: "sub_demo_2",
        tenantId: "tenant_demo_2",
        tenantName: "Instituto de Olhos Taguatinga",
        planTier: "CLINICA",
        billingCycle: "ANNUAL",
        status: "ACTIVE",
        mrrCents: 49700,
        totalContractCents: 596400,
        cashCollectedCents: 596400,
        hasFirstMonthFree: false,
        trialStartsAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        trialEndsAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        firstChargeDate: new Date(Date.now() - 45 * 86400000).toISOString(),
        fidelityMonths: 12,
        acquisitionChannel: "CAVALO_DE_TROIA_UPSELL",
        isDemo: true,
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: "sub_demo_3",
        tenantId: "tenant_demo_3",
        tenantName: "Clínica Pediátrica Crescer & Brilhar",
        planTier: "BUSINESS",
        billingCycle: "SEMIANNUAL",
        status: "ACTIVE",
        mrrCents: 99700,
        totalContractCents: 598200,
        cashCollectedCents: 598200,
        hasFirstMonthFree: true,
        trialStartsAt: new Date(Date.now() - 60 * 86400000).toISOString(),
        trialEndsAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        firstChargeDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        fidelityMonths: 6,
        acquisitionChannel: "META_ADS",
        isDemo: true,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: "sub_demo_4",
        tenantId: "tenant_demo_4",
        tenantName: "DermatoLaser Asa Sul",
        planTier: "MEDICAL_AI",
        billingCycle: "SEMIANNUAL",
        status: "TRIAL_LOCKIN",
        mrrCents: 69700,
        totalContractCents: 418200,
        cashCollectedCents: 0,
        hasFirstMonthFree: true,
        trialStartsAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        trialEndsAt: new Date(Date.now() + 25 * 86400000).toISOString(),
        firstChargeDate: new Date(Date.now() + 25 * 86400000).toISOString(),
        fidelityMonths: 6,
        acquisitionChannel: "PAP_PRESENCIAL",
        isDemo: true,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];

    // 2. Lock-in Checklists Demo
    this.lockInChecklists = [
      {
        id: "lock_demo_1",
        tenantId: "tenant_demo_1",
        tenantName: "CardioVida Prime Brasília",
        whatsappConnected: true,
        patientsImportedCount: 120,
        kanbanAndTvConfigured: true,
        inventoryAndAssetsCount: 14,
        aiScribeConsultationsUsed: 22,
        lockInScore: 100,
        riskLevel: "LOW",
        daysSinceStart: 3,
        doctorName: "Dr. Marcelo Arantes",
        doctorPhone: "(61) 98111-2020",
        onboardingNotes: "Médico encantado com o resumo SOAP automático.",
        isDemo: true,
        lastEvaluatedAt: new Date().toISOString(),
      },
      {
        id: "lock_demo_4",
        tenantId: "tenant_demo_4",
        tenantName: "DermatoLaser Asa Sul",
        whatsappConnected: true,
        patientsImportedCount: 15, // abaixo de 50
        kanbanAndTvConfigured: false,
        inventoryAndAssetsCount: 2, // abaixo de 10
        aiScribeConsultationsUsed: 3, // abaixo de 15
        lockInScore: 20, // CRÍTICO no dia 5!
        riskLevel: "HIGH",
        daysSinceStart: 5,
        doctorName: "Dra. Renata Vasconcelos",
        doctorPhone: "(61) 99222-4455",
        onboardingNotes: "Secretária com dúvidas no pareamento de pacientes. Requer intervenção presencial.",
        isDemo: true,
        lastEvaluatedAt: new Date().toISOString(),
      },
    ];

    // 3. Field Sales Visits Demo (A Matemática do NÃO)
    const baseDate = Date.now();
    this.fieldSalesVisits = [
      {
        id: "visit_1",
        salesRepName: "Fellipe / SDR",
        clinicName: "Centro Médico Lúcio Costa",
        doctorOrManagerName: "Dr. Paulo Sampaio",
        secretaryName: "Tatiane",
        secretaryPhone: "(61) 98765-4321",
        regionOrSector: "Asa Sul - Ed. Pacini",
        approachedGatekeeper: true,
        plantedTrojanHorse: true,
        did3MinLiveDemo: true,
        closedContractOnSpot: true,
        contractTierClosed: "CLINICA",
        isDemo: true,
        visitedAt: new Date(baseDate - 1000 * 3600 * 2).toISOString(),
      },
      {
        id: "visit_2",
        salesRepName: "Fellipe / SDR",
        clinicName: "Clínica São Geraldo",
        doctorOrManagerName: "Dra. Camila",
        secretaryName: "Joana",
        regionOrSector: "Asa Sul - SGAS 915",
        approachedGatekeeper: true,
        plantedTrojanHorse: true,
        did3MinLiveDemo: false,
        closedContractOnSpot: false,
        rejectionReason: "GATEKEEPER_BLOCKED",
        objectionDetails: "Médica estava em procedimento, secretária ativou teste R$ 29,90",
        isDemo: true,
        visitedAt: new Date(baseDate - 1000 * 3600 * 4).toISOString(),
      },
      {
        id: "visit_3",
        salesRepName: "Fellipe / SDR",
        clinicName: "Ortopedia Planalto",
        doctorOrManagerName: "Dr. Henrique Lima",
        secretaryName: "Beatriz",
        regionOrSector: "Taguatinga Norte",
        approachedGatekeeper: true,
        plantedTrojanHorse: false,
        did3MinLiveDemo: true,
        closedContractOnSpot: false,
        rejectionReason: "ALREADY_HAS_LEGACY",
        objectionDetails: "Preso em contrato de 2 anos com o Totvs Saúde, retorno em 60 dias",
        isDemo: true,
        visitedAt: new Date(baseDate - 1000 * 3600 * 6).toISOString(),
      },
    ];

    // 4. Trojan Horse Leads Demo (Secretárias que viram vendedoras)
    this.trojanHorseLeads = [
      {
        id: "trojan_1",
        auxiliaryUserId: "aux_101",
        auxiliaryName: "Camila Rodrigues",
        auxiliaryPhone: "(61) 98455-1234",
        currentPlan: "ASSISTENTE",
        workplaceClinicName: "Clínica Oftalmológica Visão Plena",
        workplaceDoctorName: "Dr. Roberto Guimarães",
        workplaceDoctorPhone: "(61) 99888-7766",
        estimatedDoctorsCount: 3,
        weeklyTasksCompleted: 78,
        weeklyMessagesTriaged: 142,
        generatedFinancialReport: true,
        estimatedMoneySavedCents: 850000, // R$ 8.500 economizados evitando faltas
        upsellTemperature: "HOT",
        commissionPaidCents: 0,
        isDemo: true,
        createdAt: new Date(baseDate - 86400000 * 12).toISOString(),
      },
      {
        id: "trojan_2",
        auxiliaryUserId: "aux_102",
        auxiliaryName: "Juliana Mendes",
        auxiliaryPhone: "(61) 99122-3344",
        currentPlan: "PROFISSIONAL",
        workplaceClinicName: "Espaço Integrado Pediatria & Saúde",
        workplaceDoctorName: "Dra. Eliana Prado",
        workplaceDoctorPhone: "(61) 98123-9988",
        estimatedDoctorsCount: 4,
        weeklyTasksCompleted: 110,
        weeklyMessagesTriaged: 230,
        generatedFinancialReport: true,
        estimatedMoneySavedCents: 1420000,
        upsellTemperature: "CONVERTED",
        convertedToTenantId: "tenant_demo_2",
        commissionPaidCents: 15000, // R$ 150,00 Pix pago com sucesso
        isDemo: true,
        createdAt: new Date(baseDate - 86400000 * 25).toISOString(),
      },
    ];

    // 5. Campaign Budget Log Demo (Do Bolso vs Caixa)
    this.campaignBudgets = [
      {
        id: "budget_1",
        monthReference: 1,
        sourceType: "POCKET_CAPITAL",
        channel: "META_ADS_AUXILIARES",
        amountSpentCents: 350000, // R$ 3.500
        clicksGenerated: 1840,
        leadsGenerated: 142,
        spentDate: new Date(baseDate - 86400000 * 10).toISOString(),
        isDemo: true,
      },
      {
        id: "budget_2",
        monthReference: 1,
        sourceType: "POCKET_CAPITAL",
        channel: "AJUDA_CUSTO_PAP",
        amountSpentCents: 150000, // R$ 1.500 gasolina / alimentação
        clicksGenerated: 0,
        leadsGenerated: 45,
        spentDate: new Date(baseDate - 86400000 * 8).toISOString(),
        isDemo: true,
      },
    ];

    // 6. Ai Telemetry Usage Demo (Margem por Médico)
    this.aiTelemetry = [
      {
        id: "ai_1",
        tenantId: "tenant_demo_1",
        clinicName: "CardioVida Prime Brasília",
        doctorName: "Dr. Marcelo Arantes",
        featureType: "MEDICAL_SCRIBE_SOAP",
        audioSeconds: 4200, // 70 minutos
        inputTokens: 145000,
        outputTokens: 48000,
        estimatedCostBrlCents: 3840, // R$ 38,40 de custo total de API
        planMonthlyBrlCents: 69700, // R$ 697,00 cobrado
        createdAt: new Date().toISOString(),
      },
    ];
  }

  // =========================================================
  // MÉTODOS PÚBLICOS COM SUPORTE A FILTRO IS_DEMO
  // =========================================================

  public getOverview(isDemo: boolean = false) {
    const subs = this.subscriptions.filter((s) => s.isDemo === isDemo);
    const visits = this.fieldSalesVisits.filter((v) => v.isDemo === isDemo);
    const lockIns = this.lockInChecklists.filter((l) => l.isDemo === isDemo);
    const trojans = this.trojanHorseLeads.filter((t) => t.isDemo === isDemo);
    const budgets = this.campaignBudgets.filter((b) => b.isDemo === isDemo);

    // Cálculos Financeiros
    const totalContractedCents = subs.reduce((acc, s) => acc + s.totalContractCents, 0);
    const cashCollectedCents = subs.reduce((acc, s) => acc + s.cashCollectedCents, 0);
    const currentMrrCents = subs
      .filter((s) => s.status === "ACTIVE" || s.status === "TRIAL_LOCKIN")
      .reduce((acc, s) => acc + s.mrrCents, 0);

    // Metas de Guerra
    const goal90DaysCents = 50000000; // R$ 500.000,00
    const goal180DaysCents = 100000000; // R$ 1.000.000,00
    const progress90Percent = Math.min(100, Math.round((totalContractedCents / goal90DaysCents) * 1000) / 10);
    const progress180Percent = Math.min(100, Math.round((totalContractedCents / goal180DaysCents) * 1000) / 10);

    // Algoritmo de Pacing Diário (65 dias úteis)
    const remainingDaysInQuarter = 65; // Dias úteis de guerra
    const deficitCents = Math.max(0, goal90DaysCents - totalContractedCents);
    const dailyTargetNeededCents = Math.round(deficitCents / remainingDaysInQuarter);

    // Portas batidas vs Conversão
    const totalDoorsApproached = visits.length;
    const totalNoCount = visits.filter((v) => !v.closedContractOnSpot).length;
    const liveDemoCount = visits.filter((v) => v.did3MinLiveDemo).length;
    const contractsClosedPAP = visits.filter((v) => v.closedContractOnSpot).length;

    // Valor estatístico da sola de sapato
    const valuePerDoorCents =
      totalDoorsApproached > 0 ? Math.round(totalContractedCents / totalDoorsApproached) : 43000; // R$ 430,00 meta

    // Capital do Bolso Utilizado
    const pocketSpentCents = budgets
      .filter((b) => b.sourceType === "POCKET_CAPITAL")
      .reduce((acc, b) => acc + b.amountSpentCents, 0);
    const pocketMaxMonth1Cents = 1000000; // R$ 10.000,00 teto

    // Lock-in Críticos (D+4 com Score < 40%)
    const highRiskTenants = lockIns.filter((l) => l.daysSinceStart >= 4 && l.lockInScore < 40);

    return {
      isDemo,
      financials: {
        totalContractedCents,
        totalContractedBrl: totalContractedCents / 100,
        cashCollectedCents,
        cashCollectedBrl: cashCollectedCents / 100,
        currentMrrCents,
        currentMrrBrl: currentMrrCents / 100,
        activeSubscriptionsCount: subs.filter((s) => s.status === "ACTIVE").length,
        trialSubscriptionsCount: subs.filter((s) => s.status === "TRIAL_LOCKIN").length,
      },
      goals: {
        goal90DaysBrl: 500000,
        goal180DaysBrl: 1000000,
        progress90Percent,
        progress180Percent,
        dailyTargetNeededBrl: dailyTargetNeededCents / 100,
        packageEquivalents: {
          clinicaSemiannual: Math.ceil((dailyTargetNeededCents / 100) / (497 * 6)),
          medicalAiSemiannual: Math.ceil((dailyTargetNeededCents / 100) / (697 * 6)),
          auxiliaryMonthly: Math.ceil((dailyTargetNeededCents / 100) / 29.9),
        },
      },
      papWarfare: {
        totalDoorsApproached,
        totalNoCount,
        liveDemoCount,
        contractsClosedPAP,
        valuePerDoorBrl: valuePerDoorCents / 100,
        dailyPacingTarget: {
          doorsPerDay: 18,
          nosPerDay: 16,
          demosPerDay: 7,
          closesPerDay: 2.1,
        },
      },
      pocketBudget: {
        pocketSpentBrl: pocketSpentCents / 100,
        pocketMaxBrl: pocketMaxMonth1Cents / 100,
        pocketUsedPercent: Math.min(100, Math.round((pocketSpentCents / pocketMaxMonth1Cents) * 100)),
      },
      lockIn: {
        totalTenantsInTrial: lockIns.length,
        highRiskCount: highRiskTenants.length,
        highRiskTenants,
      },
      trojanHorse: {
        totalLeads: trojans.length,
        hotLeadsCount: trojans.filter((t) => t.upsellTemperature === "HOT").length,
        convertedCount: trojans.filter((t) => t.upsellTemperature === "CONVERTED").length,
      },
    };
  }

  // =========================================================
  // MÉTODOS DE AÇÕES
  // =========================================================

  public addFieldSalesVisit(visit: Omit<FieldSalesVisit, "id" | "visitedAt">) {
    const newVisit: FieldSalesVisit = {
      ...visit,
      id: "visit_" + Date.now(),
      visitedAt: new Date().toISOString(),
    };
    this.fieldSalesVisits.unshift(newVisit);

    // Se fechou contrato na hora, cria automaticamente a Subscription
    if (newVisit.closedContractOnSpot && newVisit.contractTierClosed) {
      const plan = OFFICIAL_MEDCORE_PLANS.find((p) => p.tier === newVisit.contractTierClosed) || OFFICIAL_MEDCORE_PLANS[2];
      const mrr = plan.monthlyPriceCents;
      const contractCents = mrr * 6; // Semestral

      this.subscriptions.unshift({
        id: "sub_" + Date.now(),
        tenantId: "tenant_" + Date.now(),
        tenantName: newVisit.clinicName,
        planTier: newVisit.contractTierClosed,
        billingCycle: "SEMIANNUAL",
        status: "TRIAL_LOCKIN",
        mrrCents: mrr,
        totalContractCents: contractCents,
        cashCollectedCents: 0,
        hasFirstMonthFree: true,
        trialStartsAt: new Date().toISOString(),
        trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        firstChargeDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        fidelityMonths: 6,
        acquisitionChannel: "PAP_PRESENCIAL",
        salesRepId: newVisit.salesRepName,
        isDemo: newVisit.isDemo,
        createdAt: new Date().toISOString(),
      });

      // Cria checklist de Lock-in de 7 dias
      this.lockInChecklists.unshift({
        id: "lock_" + Date.now(),
        tenantId: "tenant_" + Date.now(),
        tenantName: newVisit.clinicName,
        whatsappConnected: false,
        patientsImportedCount: 0,
        kanbanAndTvConfigured: false,
        inventoryAndAssetsCount: 0,
        aiScribeConsultationsUsed: 0,
        lockInScore: 0,
        riskLevel: "HIGH",
        daysSinceStart: 0,
        doctorName: newVisit.doctorOrManagerName,
        doctorPhone: newVisit.secretaryPhone,
        isDemo: newVisit.isDemo,
        lastEvaluatedAt: new Date().toISOString(),
      });
    }

    return newVisit;
  }

  public getFieldSalesVisits(isDemo: boolean = false) {
    return this.fieldSalesVisits.filter((v) => v.isDemo === isDemo);
  }

  public getLockInChecklists(isDemo: boolean = false) {
    return this.lockInChecklists.filter((l) => l.isDemo === isDemo);
  }

  public updateLockInChecklist(tenantId: string, updates: Partial<TenantLockInChecklist>) {
    const item = this.lockInChecklists.find((l) => l.tenantId === tenantId);
    if (!item) return null;

    Object.assign(item, updates);

    // Recalcula Score
    let score = 0;
    if (item.whatsappConnected) score += 20;
    if (item.patientsImportedCount >= 50) score += 20;
    if (item.kanbanAndTvConfigured) score += 15;
    if (item.inventoryAndAssetsCount >= 10) score += 15;
    if (item.aiScribeConsultationsUsed >= 15) score += 30;

    item.lockInScore = score;
    item.riskLevel = score >= 75 ? "LOW" : score >= 40 ? "MEDIUM" : "HIGH";
    item.lastEvaluatedAt = new Date().toISOString();

    return item;
  }

  public getTrojanHorseLeads(isDemo: boolean = false) {
    return this.trojanHorseLeads.filter((t) => t.isDemo === isDemo);
  }

  public markTrojanConverted(id: string, tenantId: string, commissionCents: number = 15000) {
    const item = this.trojanHorseLeads.find((t) => t.id === id);
    if (!item) return null;
    item.upsellTemperature = "CONVERTED";
    item.convertedToTenantId = tenantId;
    item.commissionPaidCents = commissionCents;
    return item;
  }

  public getCampaignBudgets(isDemo: boolean = false) {
    return this.campaignBudgets.filter((b) => b.isDemo === isDemo);
  }

  public getAiTelemetry(isDemo: boolean = false) {
    return this.aiTelemetry;
  }

  // Reset seguro para produção (limpa dados de teste mantendo super admin e planos)
  public resetToProduction() {
    this.subscriptions = [];
    this.lockInChecklists = [];
    this.fieldSalesVisits = [];
    this.trojanHorseLeads = [];
    this.campaignBudgets = [];
    this.aiTelemetry = [];
    return { success: true, message: "War Room zerado com sucesso para início de produção real." };
  }
}

// Instância Singleton Global
export const saasWarRoomService = new SaasWarRoomStore();
