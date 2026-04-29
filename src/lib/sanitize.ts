import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza strings para prevenir ataques XSS.
 * Remove tags script e atributos perigosos mantendo a estrutura segura.
 */
export function sanitize(content: string): string {
  if (!content) return "";
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // Remove todas as tags por padrão para campos de texto simples
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitiza recursivamente um objeto ou array.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    if (typeof obj === "string") {
      return sanitize(obj) as unknown as T;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const sanitizedObj = {} as any;
  for (const [key, value] of Object.entries(obj)) {
    sanitizedObj[key] = sanitizeObject(value);
  }
  return sanitizedObj;
}

/**
 * Helper para extrair e sanitizar o corpo de uma Request JSON.
 */
export async function getSanitizedBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return sanitizeObject(body) as T;
  } catch (error) {
    return {} as T;
  }
}
