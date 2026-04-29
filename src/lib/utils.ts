import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sanitize as robustSanitize, sanitizeObject as robustSanitizeObject } from "./sanitize";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitiza uma string removendo tags HTML para prevenir XSS.
 * Utiliza DOMPurify via lib/sanitize.
 */
export function sanitize(input: string): string {
  return robustSanitize(input);
}

/**
 * Sanitiza recursivamente todas as strings dentro de um objeto ou array.
 * Utiliza lib/sanitize.
 */
export function sanitizeObject<T>(obj: T): T {
  return robustSanitizeObject(obj);
}
