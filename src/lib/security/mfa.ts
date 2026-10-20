import crypto from "crypto";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Codifica bytes para string Base32
 */
function toBase32(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Decodifica Base32 para Buffer de bytes
 */
function fromBase32(base32: string): Buffer {
  const cleanStr = base32.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const idx = BASE32_CHARS.indexOf(cleanStr[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Gera um segredo TOTP aleatório em formato Base32 (20 bytes = 160 bits)
 */
export function generateMfaSecret(): string {
  const bytes = crypto.randomBytes(20);
  return toBase32(bytes);
}

/**
 * Monta o URI otpauth:// para renderização do QR Code no Google Authenticator / Authy
 */
export function generateTotpUri(label: string, issuer: string, secret: string): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedLabel = encodeURIComponent(label);
  return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Calcula o token TOTP para um step de tempo específico (padrão RFC 6238)
 */
function calculateTotp(secret: string, timeStep: number): string {
  const key = fromBase32(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeStep), 0);

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code = (
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)
  ) % 1_000_000;

  return code.toString().padStart(6, "0");
}

/**
 * Valida o token de 6 dígitos enviado pelo usuário com tolerância de ±1 time step (30s)
 */
export function verifyTotpToken(token: string, secret: string): boolean {
  if (!token || !secret || token.length !== 6) return false;

  const stepSeconds = 30;
  const currentStep = Math.floor(Date.now() / 1000 / stepSeconds);

  // Janela de tolerância: step anterior (-1), step atual (0) e próximo step (+1)
  for (let delta = -1; delta <= 1; delta++) {
    const expected = calculateTotp(secret, currentStep + delta);
    if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}
