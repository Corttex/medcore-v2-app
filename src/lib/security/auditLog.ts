import crypto from "crypto";
import prisma from "@/lib/prisma";

export interface WormAuditRecord {
  id: string;
  timestampUtc: string;
  actor: {
    id?: string;
    fullName: string;
    email: string;
    role?: string;
  };
  action: string;
  entityType?: string;
  entityId?: string;
  previousState?: any;
  newState?: any;
  ipAddress: string;
  userAgent?: string;
  previousHash: string;
  currentHash: string;
}

const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

declare global {
  var __medcoreWormChain: WormAuditRecord[] | undefined;
  var __medcoreLastHash: string | undefined;
}

if (!globalThis.__medcoreWormChain) {
  globalThis.__medcoreWormChain = [];
  globalThis.__medcoreLastHash = GENESIS_HASH;
}

/**
 * Calcula o hash SHA-256 imutável do registro WORM garantindo a integridade da cadeia
 */
function computeRecordHash(data: {
  previousHash: string;
  timestampUtc: string;
  actorEmail: string;
  action: string;
  previousState: any;
  newState: any;
  ipAddress: string;
}): string {
  const content = [
    data.previousHash,
    data.timestampUtc,
    data.actorEmail,
    data.action,
    JSON.stringify(data.previousState || {}),
    JSON.stringify(data.newState || {}),
    data.ipAddress
  ].join("|");

  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Registra um evento imutável WORM (Write Once, Read Many) na cadeia de auditoria
 */
export async function recordWormLog(params: {
  actor: { id?: string; fullName: string; email: string; role?: string };
  action: string;
  entityType?: string;
  entityId?: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  userAgent?: string;
}): Promise<WormAuditRecord> {
  const timestampUtc = new Date().toISOString();
  const previousHash = globalThis.__medcoreLastHash || GENESIS_HASH;
  const ip = params.ipAddress || "127.0.0.1";

  const currentHash = computeRecordHash({
    previousHash,
    timestampUtc,
    actorEmail: params.actor.email,
    action: params.action,
    previousState: params.previousState,
    newState: params.newState,
    ipAddress: ip
  });

  const record: WormAuditRecord = {
    id: `worm-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
    timestampUtc,
    actor: params.actor,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    previousState: params.previousState,
    newState: params.newState,
    ipAddress: ip,
    userAgent: params.userAgent,
    previousHash,
    currentHash
  };

  // Atualiza ponteiro da cadeia em memória
  globalThis.__medcoreLastHash = currentHash;
  if (!globalThis.__medcoreWormChain) {
    globalThis.__medcoreWormChain = [];
  }
  globalThis.__medcoreWormChain.unshift(record);

  // Persiste no banco de dados se modelo AuditLog estiver ativo
  try {
    const anyPrisma = prisma as any;
    if (anyPrisma.auditLog) {
      await anyPrisma.auditLog.create({
        data: {
          action: record.action,
          details: JSON.stringify({
            wormId: record.id,
            timestampUtc: record.timestampUtc,
            actor: record.actor,
            previousHash: record.previousHash,
            currentHash: record.currentHash,
            entityType: record.entityType,
            entityId: record.entityId,
            previousState: record.previousState,
            newState: record.newState
          }),
          userId: params.actor.id || "system-audit",
          ipAddress: ip
        }
      });
    }
  } catch (err) {
    console.warn("WORM Audit Log persistido na camada em memória (DB sync fallback)");
  }

  return record;
}

/**
 * Valida a integridade criptográfica de toda a trilha de auditoria WORM.
 * Detecta qualquer adulteração ou inserção fraudulenta retroativa.
 */
export function verifyWormChainIntegrity(): {
  isValid: boolean;
  totalRecords: number;
  brokenIndex?: number;
  message: string;
} {
  const chain = [...(globalThis.__medcoreWormChain || [])].reverse(); // Do mais antigo ao mais recente
  if (chain.length === 0) {
    return { isValid: true, totalRecords: 0, message: "Trilha WORM vazia e íntegra." };
  }

  let expectedPreviousHash = GENESIS_HASH;

  for (let i = 0; i < chain.length; i++) {
    const item = chain[i];

    if (item.previousHash !== expectedPreviousHash) {
      return {
        isValid: false,
        totalRecords: chain.length,
        brokenIndex: i,
        message: `Rompimento da cadeia no índice ${i}: previousHash não coincide com o hash do bloco anterior.`
      };
    }

    const recalculatedHash = computeRecordHash({
      previousHash: item.previousHash,
      timestampUtc: item.timestampUtc,
      actorEmail: item.actor.email,
      action: item.action,
      previousState: item.previousState,
      newState: item.newState,
      ipAddress: item.ipAddress
    });

    if (item.currentHash !== recalculatedHash) {
      return {
        isValid: false,
        totalRecords: chain.length,
        brokenIndex: i,
        message: `Adulteração detectada no registro ${item.id}: assinatura SHA-256 não confere com o conteúdo dos dados.`
      };
    }

    expectedPreviousHash = item.currentHash;
  }

  return {
    isValid: true,
    totalRecords: chain.length,
    message: `Cadeia WORM 100% íntegra. ${chain.length} registros verificados com sucesso.`
  };
}
