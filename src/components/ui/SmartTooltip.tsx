"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Lock, Sparkles, Lightbulb, Play, UserCheck } from "lucide-react";
import {
  ModuleTooltipConfig,
  resolveTooltipRole,
  getRoleProfileLabel,
} from "@/lib/data/moduleTooltips";
import { useUser } from "@/context/UserContext";

export type TooltipPlacement = "top" | "right" | "left" | "bottom";

interface SmartTooltipProps {
  config: ModuleTooltipConfig;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  isLocked?: boolean;
  lockedPlanLabel?: string;
  preferredOrder?: TooltipPlacement[];
  children: React.ReactNode;
  className?: string;
  onUpgradeClick?: () => void;
}

const DELAY_LEVEL_1 = 500;
const DELAY_LEVEL_2 = 1200;
const DELAY_LEVEL_3 = 2000;

export function triggerDraContePrompt(prompt: string, autoSend = true) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("medcore:open-copilot", {
      detail: { prompt, autoSend },
    })
  );
}

export function SmartTooltip({
  config,
  icon: Icon,
  isLocked = false,
  lockedPlanLabel,
  preferredOrder = ["top", "right", "left", "bottom"],
  children,
  className,
  onUpgradeClick,
}: SmartTooltipProps) {
  const { user } = useUser();
  const roleProfile = resolveTooltipRole(user?.role);
  const roleLabel = getRoleProfileLabel(roleProfile);
  const roleTip = config.roleTips[roleProfile];

  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [coords, setCoords] = useState<{ top: number; left: number; placement: TooltipPlacement }>({
    top: 0,
    left: 0,
    placement: preferredOrder[0] || "right",
  });
  const [promptIndex, setPromptIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const computePosition = useCallback(
    (activeLevel: number) => {
      if (!triggerRef.current || typeof window === "undefined") return;
      const rect = triggerRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 12;

      const estimatedWidth = activeLevel === 1 ? 250 : 320;
      const estimatedHeight = activeLevel === 1 ? 95 : activeLevel === 2 ? 230 : 330;

      const fits: Record<TooltipPlacement, boolean> = {
        top: rect.top - estimatedHeight - margin >= 8,
        right: rect.right + estimatedWidth + margin <= vw - 8,
        left: rect.left - estimatedWidth - margin >= 8,
        bottom: rect.bottom + estimatedHeight + margin <= vh - 8,
      };

      const chosen = preferredOrder.find((p) => fits[p]) || preferredOrder[0] || "right";

      let top = rect.top;
      let left = rect.right + margin;

      if (chosen === "right") {
        left = rect.right + margin;
        top = rect.top + rect.height / 2 - estimatedHeight / 2;
      } else if (chosen === "left") {
        left = rect.left - estimatedWidth - margin;
        top = rect.top + rect.height / 2 - estimatedHeight / 2;
      } else if (chosen === "top") {
        left = rect.left + rect.width / 2 - estimatedWidth / 2;
        top = rect.top - estimatedHeight - margin;
      } else {
        left = rect.left + rect.width / 2 - estimatedWidth / 2;
        top = rect.bottom + margin;
      }

      // Clamp strict inside viewport so nothing overflows
      const clampedLeft = Math.max(10, Math.min(left, vw - estimatedWidth - 10));
      const clampedTop = Math.max(10, Math.min(top, vh - estimatedHeight - 10));

      setCoords({ top: clampedTop, left: clampedLeft, placement: chosen });
    },
    [preferredOrder]
  );

  // Recalcula posição sempre que o nível expandir para evitar corte por viewport
  useEffect(() => {
    if (level > 0) {
      computePosition(level);
    }
  }, [level, computePosition]);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (level > 0) return;

    clearAllTimers();
    setPromptIndex(0);

    const t1 = setTimeout(() => {
      computePosition(1);
      setLevel(1);
    }, DELAY_LEVEL_1);

    const t2 = setTimeout(() => {
      computePosition(2);
      setLevel(2);
    }, DELAY_LEVEL_2);

    const t3 = setTimeout(() => {
      computePosition(3);
      setLevel(3);
    }, DELAY_LEVEL_3);

    timersRef.current = [t1, t2, t3];
  };

  const handleMouseLeave = () => {
    clearAllTimers();
    closeTimerRef.current = setTimeout(() => {
      setLevel(0);
    }, 180);
  };

  const handleTooltipEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleTooltipLeave = () => {
    clearAllTimers();
    closeTimerRef.current = setTimeout(() => {
      setLevel(0);
    }, 150);
  };

  const activePrompt = config.aiPrompts[promptIndex % Math.max(1, config.aiPrompts.length)] || "";
  const effectivePlan = lockedPlanLabel || config.commercialPlanLabel;
  const quickText =
    config.quickDesc.length > 80 ? `${config.quickDesc.slice(0, 77)}...` : config.quickDesc;

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}

      {isMounted &&
        level > 0 &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: level === 1 ? "250px" : "320px",
              maxWidth: "calc(100vw - 20px)",
              background: "#0B0F19",
              borderRadius: "12px",
              border: "1px solid rgba(0, 255, 255, 0.15)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
              zIndex: 9999,
            }}
            className="p-3.5 text-left transition-all duration-200 animate-in fade-in zoom-in-95 pointer-events-auto"
          >
            {/* Indicador sutil do Nível Progressivo */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {level >= 2 && Icon && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "rgba(0, 212, 255, 0.12)",
                      border: "1px solid rgba(0, 212, 255, 0.25)",
                      color: "#00D4FF",
                    }}
                  >
                    <Icon size={15} />
                  </div>
                )}
                <span
                  className="text-[13px] leading-tight truncate"
                  style={{ color: "#FFFFFF", fontWeight: 600 }}
                >
                  {config.title}
                </span>
              </div>

              {isLocked ? (
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] shrink-0 uppercase tracking-wider"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    color: "#FBBF24",
                    fontWeight: 600,
                  }}
                >
                  <Lock size={9} />
                  {effectivePlan}
                </span>
              ) : (
                <span
                  className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
                    color: "#00D4FF",
                    fontWeight: 500,
                  }}
                >
                  {level === 1 ? "Rápido" : level === 2 ? "Funcional" : "Dra. Conte"}
                </span>
              )}
            </div>

            {/* Nível 1 — Quick Label (<= 80 caracteres) */}
            {level === 1 && (
              <p
                className="text-xs leading-snug"
                style={{ color: "#B8C0CC", fontWeight: 400 }}
              >
                {quickText}
              </p>
            )}

            {/* Nível 2 — Functional Tooltip + Nível 4 (Adaptação por Perfil) */}
            {level >= 2 && (
              <div className="space-y-2.5">
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#B8C0CC", fontWeight: 400 }}
                >
                  {config.fullDesc}
                </p>

                {config.features.length > 0 && (
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {config.features.slice(0, 4).map((feat) => (
                      <li
                        key={feat}
                        className="text-[11px] flex items-center gap-1.5 truncate"
                        style={{ color: "#B8C0CC", fontWeight: 400 }}
                      >
                        <span style={{ color: "#00D4FF" }}>•</span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Nível 4 — Tooltip Baseado no Perfil Ativo */}
                <div
                  className="rounded-lg px-2.5 py-2 flex items-start gap-2"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <UserCheck size={13} className="shrink-0 mt-0.5" style={{ color: "#00D4FF" }} />
                  <div className="min-w-0">
                    <p
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "#00D4FF", fontWeight: 500 }}
                    >
                      Perfil: {roleLabel}
                    </p>
                    <p
                      className="text-[11px] leading-snug mt-0.5"
                      style={{ color: "#B8C0CC", fontWeight: 400 }}
                    >
                      {roleTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nível 3 — AI Context Tooltip (Dra. Conte transversal) */}
            {level >= 3 && activePrompt && (
              <div
                className="mt-2.5 pt-2.5 space-y-2 animate-in fade-in duration-200"
                style={{ borderTop: "1px solid rgba(0, 255, 255, 0.15)" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[11px] flex items-center gap-1.5"
                    style={{ color: "#00D4FF", fontWeight: 500 }}
                  >
                    <Lightbulb size={12} />
                    Dica da Dra. Conte
                  </span>
                  {config.aiPrompts.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPromptIndex((prev) => prev + 1);
                      }}
                      className="text-[10px] hover:underline cursor-pointer"
                      style={{ color: "#B8C0CC" }}
                    >
                      Outro exemplo →
                    </button>
                  )}
                </div>

                <p
                  className="text-xs italic leading-snug rounded-lg p-2"
                  style={{
                    backgroundColor: "rgba(0, 212, 255, 0.07)",
                    border: "1px solid rgba(0, 212, 255, 0.2)",
                    color: "#FFFFFF",
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{activePrompt}&rdquo;
                </p>

                <div className="flex items-center gap-2">
                  {isLocked && onUpgradeClick ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLevel(0);
                        onUpgradeClick();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.18)",
                        border: "1px solid rgba(245, 158, 11, 0.45)",
                        color: "#FBBF24",
                        fontWeight: 600,
                      }}
                    >
                      <Lock size={11} />
                      Desbloquear no {effectivePlan}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLevel(0);
                        triggerDraContePrompt(activePrompt, true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] cursor-pointer transition-all hover:brightness-110"
                      style={{
                        backgroundColor: "rgba(0, 212, 255, 0.16)",
                        border: "1px solid rgba(0, 212, 255, 0.4)",
                        color: "#00D4FF",
                        fontWeight: 500,
                      }}
                    >
                      <Sparkles size={11} />
                      <span>Executar com Dra. Conte</span>
                      <Play size={10} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Barra de progresso discreta indicando profundidade do hover (Nível 1 -> 3) */}
            <div className="mt-2.5 flex items-center gap-1">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className="h-0.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      level >= step ? "#00D4FF" : "rgba(184, 192, 204, 0.2)",
                  }}
                />
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
