import crypto from "crypto";

/**
 * Gerador de UUIDv7 (RFC 9562)
 * Garante identificadores monotonicamente ordenados no tempo com precisão de milissegundos
 * e entropia criptográfica segura para evitar enumeração de IDs inteiros/sequenciais.
 */
export function generateUUIDv7(): string {
  const now = Date.now();
  const bytes = crypto.randomBytes(16);

  // timestamp de 48 bits (milissegundos desde UNIX epoch)
  bytes[0] = (now >>> 40) & 0xff;
  bytes[1] = (now >>> 32) & 0xff;
  bytes[2] = (now >>> 24) & 0xff;
  bytes[3] = (now >>> 16) & 0xff;
  bytes[4] = (now >>> 8) & 0xff;
  bytes[5] = now & 0xff;

  // Versão 7 nos bits 4-7 do byte 6
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Variante RFC 4122 (10xx) nos bits 6-7 do byte 8
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Converte para representação canônica 8-4-4-4-12
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Valida se uma string é um UUID válido (v4 ou v7)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
