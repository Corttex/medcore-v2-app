import prisma from "@/lib/prisma";

export interface SecurityUserContext {
  id: string;
  email: string;
  role: string;
  primaryUnitId?: string | null;
  allowedUnits?: string[];
}

/**
 * Valida se um usuário possui autorização para operar em determinada unidade hospitalar.
 * Caso não possua permissão, lança exceção com status 403 (Forbidden).
 */
export async function enforceUnitScope(
  user: SecurityUserContext,
  targetUnitId: string
): Promise<boolean> {
  // Super admin e gestores master possuem escopo global
  if (user.role === "super_admin" || user.role === "DIRETOR_GERAL") {
    return true;
  }

  // Verifica se é a unidade primária do usuário
  if (user.primaryUnitId && user.primaryUnitId === targetUnitId) {
    return true;
  }

  // Se já tiver a lista de unidades permitidas em cache
  if (user.allowedUnits && user.allowedUnits.includes(targetUnitId)) {
    return true;
  }

  // Consulta tabela UserUnit no banco
  try {
    const userUnit = await prisma.userUnit.findUnique({
      where: {
        userId_unitId: {
          userId: user.id,
          unitId: targetUnitId
        }
      }
    });

    if (userUnit) {
      return true;
    }
  } catch (error) {
    console.error("Erro ao validar escopo de unidade:", error);
  }

  const forbiddenError: any = new Error(
    `Acesso negado: Você não possui permissão para visualizar ou operar na unidade [${targetUnitId}].`
  );
  forbiddenError.statusCode = 403;
  throw forbiddenError;
}

/**
 * Valida se a ação exige MFA e se a confirmação do token foi provida
 */
export function enforceMfaForAction(
  actionName: string,
  mfaVerified: boolean
): void {
  const CRITICAL_ACTIONS = [
    "APROVAR_FOLHA_PAGAMENTO",
    "LIQUIDAR_LOTE_PIX",
    "CONFIGURAR_CHAVE_API_BANCARIA",
    "EXPORTAR_CNAB_240",
    "ALTERAR_SALARIO_COLABORADOR"
  ];

  if (CRITICAL_ACTIONS.includes(actionName) && !mfaVerified) {
    const mfaRequiredError: any = new Error(
      `Ação crítica [${actionName}] exige autenticação multifator (MFA/TOTP) ativa.`
    );
    mfaRequiredError.statusCode = 401;
    mfaRequiredError.code = "MFA_REQUIRED";
    throw mfaRequiredError;
  }
}
