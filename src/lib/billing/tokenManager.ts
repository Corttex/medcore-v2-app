import prisma from "@/lib/prisma";

/**
 * Erro lançado quando a cota do usuário excede o limite do plano.
 */
export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExceededError";
  }
}

/**
 * Verifica se o usuário tem tokens suficientes (diários/semanais/mensais) para realizar a requisição.
 * Opcionalmente, informa a quantidade de tokens estimados. Se não souber a quantidade, passamos um mínimo (ex: 100).
 */
export async function checkTokenAvailability(userId: string, estimatedTokens: number = 100): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // Se o usuário não tem subscription ainda, ou assumimos um default ou negamos.
  // Por enquanto, vamos permitir um plano trial grátis para não bloquear MVP.
  if (!subscription) {
    console.warn(`[TokenManager] Usuário ${userId} sem assinatura. Considerando trial default.`);
    return true; 
  }

  const {
    dailyLimit,
    weeklyLimit,
    monthlyLimit,
    tokensUsedDaily,
    tokensUsedWeekly,
    tokensUsedMonthly
  } = subscription;

  if (tokensUsedDaily + estimatedTokens > dailyLimit) {
    throw new QuotaExceededError(`Limite diário de tokens excedido (${dailyLimit}). Faça upgrade do plano.`);
  }

  if (tokensUsedWeekly + estimatedTokens > weeklyLimit) {
    throw new QuotaExceededError(`Limite semanal de tokens excedido (${weeklyLimit}).`);
  }

  if (tokensUsedMonthly + estimatedTokens > monthlyLimit) {
    throw new QuotaExceededError(`Limite mensal de tokens excedido (${monthlyLimit}).`);
  }

  return true;
}

/**
 * Consome efetivamente os tokens após a requisição, atualizando a Subscription e salvando um log de auditoria.
 */
export async function consumeTokens(userId: string, service: string, tokens: number): Promise<void> {
  if (tokens <= 0) return;

  // Busca ou ignora se não tiver subscription (trial infinito no MVP)
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription) {
    // Atualiza contadores
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        tokensUsedDaily: { increment: tokens },
        tokensUsedWeekly: { increment: tokens },
        tokensUsedMonthly: { increment: tokens },
      },
    });
  }

  // Cria log independente da subscription existir (para manter registro de consumo futuro)
  await prisma.tokenLog.create({
    data: {
      userId,
      service,
      tokensConsumed: Math.ceil(tokens),
    },
  });
}
