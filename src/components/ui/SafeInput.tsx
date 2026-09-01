"use client";

import React from "react";
import { sanitize } from "@/lib/sanitize";

interface SafeInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /** Define se renderiza um input ou uma textarea */
  as?: "input" | "textarea";
  /** Callback opcional que retorna o valor já sanitizado (XSS Safe) */
  onSafeChange?: (value: string) => void;
  /** Classes extras para o componente */
  className?: string;
}

/**
 * SafeInput Component
 * Automatiza a sanitização de entradas do usuário para prevenir XSS.
 * Pode ser usado como um input padrão ou textarea.
 */
export const SafeInput: React.FC<SafeInputProps> = ({ 
  as = "input", 
  onSafeChange, 
  onChange, 
  className = "",
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // 1. Executa o onChange padrão do React
    if (onChange) {
      onChange(e);
    }
    
    // 2. Executa a sanitização e notifica o parent via onSafeChange
    if (onSafeChange) {
      const sanitized = sanitize(e.target.value);
      onSafeChange(sanitized);
    }
  };

  // Estilos base para manter a consistência visual do MedCore
  const baseStyles = "w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-all";
  const combinedClassName = `${baseStyles} ${className}`;

  if (as === "textarea") {
    return (
      <textarea
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        className={combinedClassName}
        onChange={handleChange}
      />
    );
  }

  return (
    <input
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      className={combinedClassName}
      onChange={handleChange}
    />
  );
};
