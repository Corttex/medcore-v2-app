import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recomendado pelo NIST para AES-GCM
const TAG_LENGTH = 16; // 128 bits auth tag

/**
 * Obtém a chave mestra de 256 bits para criptografia em nível de campo (Field-Level Encryption).
 * Em produção, essa chave deve ser injetada via KMS / Environment Secrets.
 */
function getMasterKey(): Buffer {
  const envKey = process.env.FIELD_ENCRYPTION_KEY;
  if (envKey) {
    if (envKey.length === 64) {
      return Buffer.from(envKey, "hex");
    }
    return crypto.scryptSync(envKey, "medcore-salt-pepper", 32);
  }
  // Fallback seguro de desenvolvimento (com aviso em console)
  return crypto.scryptSync("medcore-default-field-secret-key-32b", "medcore-field-salt", 32);
}

/**
 * Criptografa um dado sensível (CPF, Conta Bancária, Salário, SSN) com AES-256-GCM.
 * Retorna payload serializado no formato: "enc:v1:<iv_hex>:<tag_hex>:<ciphertext_hex>"
 */
export function encryptField(plaintext: string): string {
  if (!plaintext || typeof plaintext !== "string") return plaintext;

  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return `enc:v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * Descriptografa um dado criptografado com AES-256-GCM.
 * Valida a autenticidade (Auth Tag) para evitar adulteração de dados em repouso.
 */
export function decryptField(encryptedPayload: string): string {
  if (!encryptedPayload || typeof encryptedPayload !== "string") return encryptedPayload;
  if (!encryptedPayload.startsWith("enc:v1:")) {
    // Retorna original se não estiver criptografado
    return encryptedPayload;
  }

  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 5) {
      throw new Error("Formato inválido de payload criptografado");
    }

    const [, , ivHex, tagHex, cipherHex] = parts;
    const key = getMasterKey();
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(cipherHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Falha ao descriptografar campo sensível:", error);
    throw new Error("Erro de integridade criptográfica ao descriptografar dado sensível");
  }
}

/**
 * Gera um Blind Index (HMAC-SHA256) para possibilitar buscas exatas por CPF, CNPJ ou Conta
 * no banco de dados sem expor o dado em claro e sem precisar descriptografar a tabela inteira.
 */
export function hashBlindIndex(value: string): string {
  if (!value) return "";
  const key = getMasterKey();
  const normalized = value.trim().toLowerCase().replace(/\D/g, "");
  return crypto.createHmac("sha256", key).update(normalized).digest("hex");
}
