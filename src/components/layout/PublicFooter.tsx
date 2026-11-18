"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import {
  MotionReveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/animations/MotionReveal";
import {
  FOOTER_RECURSOS_PAGES,
  FOOTER_ADICIONAIS_PAGES,
  FOOTER_INSTITUCIONAL_PAGES,
} from "@/lib/data/footerPagesData";

const EXPERT_WORDS = ["potencializar", "crescer", "organizar", "automatizar", "cuidar"];

export function PublicFooter() {
  const [expertWordIndex, setExpertWordIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpertWordIndex((prev) => (prev + 1) % EXPERT_WORDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const prevExpertWord =
    EXPERT_WORDS[(expertWordIndex - 1 + EXPERT_WORDS.length) % EXPERT_WORDS.length];
  const activeExpertWord = EXPERT_WORDS[expertWordIndex];
  const nextExpertWord = EXPERT_WORDS[(expertWordIndex + 1) % EXPERT_WORDS.length];

  return (
    <footer className="relative bg-white dark:bg-[#070B14] border-t border-zinc-200/80 dark:border-white/10 pt-20">
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Bloco Esquerdo: 3 Colunas de Navegação */}
          <StaggerGroup stagger={0.14} delay={0.05} className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Coluna 1: Recursos */}
            <StaggerItem y={18}>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">
                Recursos
              </h4>
              <ul className="space-y-2.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                {FOOTER_RECURSOS_PAGES.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/recursos/${item.slug}`}
                      className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {item.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Coluna 2: Adicionais */}
            <StaggerItem y={18}>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">
                Adicionais
              </h4>
              <ul className="space-y-2.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                {FOOTER_ADICIONAIS_PAGES.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/adicionais/${item.slug}`}
                      className="inline-flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors group"
                    >
                      <span>{item.navLabel}</span>
                      {item.aiOrb && (
                        <span
                          aria-hidden="true"
                          className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 via-[#00D4FF] to-purple-300 shadow-[0_0_8px_rgba(0,212,255,0.45)] ring-1 ring-white/40 shrink-0 group-hover:scale-110 transition-transform"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Coluna 3: Institucional */}
            <StaggerItem y={18} className="col-span-2 sm:col-span-1">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-5">
                Institucional
              </h4>
              <ul className="space-y-2.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                {FOOTER_INSTITUCIONAL_PAGES.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/institucional/${item.slug}`}
                      className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {item.navLabel}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </StaggerGroup>

          {/* Bloco Direito: Canais de Contato + Tipografia Animada */}
          <MotionReveal delay={0.3} y={20} className="lg:col-span-5 flex flex-col justify-between gap-12">
            <div className="divide-y divide-zinc-200/80 dark:divide-white/10 border-b border-zinc-200/80 dark:border-white/10">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Fale conosco
                </span>
                <a
                  href="mailto:contato@medcore.app.br"
                  className="text-xs font-semibold text-zinc-900 dark:text-white hover:text-[var(--color-rd-cyan)] transition-colors"
                >
                  contato@medcore.app.br
                </a>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Suporte
                </span>
                <a
                  href="https://wa.me/5511989272833"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-zinc-900 dark:text-white hover:text-[var(--color-rd-cyan)] transition-colors tabular-nums"
                >
                  +55 11 98927 2833
                </a>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Vendas
                </span>
                <a
                  href="https://wa.me/5511992956003"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-zinc-900 dark:text-white hover:text-[var(--color-rd-cyan)] transition-colors tabular-nums"
                >
                  +55 11 99295 6003
                </a>
              </div>
            </div>

            <div className="flex items-center justify-start lg:justify-end gap-2.5 select-none pt-2">
              <span className="text-xl md:text-2xl font-normal text-zinc-500 dark:text-zinc-400 tracking-tight">
                Somos experts em
              </span>
              <div className="flex flex-col leading-[1.2] text-xl md:text-2xl tracking-tight min-w-[140px]">
                <span className="text-zinc-300/75 dark:text-zinc-700 font-normal transition-all duration-500">
                  {prevExpertWord}
                </span>
                <span className="text-zinc-900 dark:text-white font-semibold transition-all duration-500">
                  {activeExpertWord}
                </span>
                <span className="text-zinc-300/75 dark:text-zinc-700 font-normal transition-all duration-500">
                  {nextExpertWord}
                </span>
              </div>
            </div>
          </MotionReveal>
        </div>

        {/* Barra Inferior */}
        <MotionReveal delay={0.42} y={14} className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            2026. Todos os direitos reservados a{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              MedCore Systems
            </span>
            .
          </p>

          <div className="flex items-center gap-2.5">
            <a
              href="/#plataforma"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="/#plataforma"
              aria-label="Facebook"
              className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
              </svg>
            </a>

            <a
              href="/#plataforma"
              aria-label="X"
              className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="/#plataforma"
              aria-label="YouTube"
              className="w-9 h-9 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Voltar ao topo"
              title="Voltar ao topo"
              className="w-9 h-9 ml-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        </MotionReveal>
      </div>

      {/* Faixa de acabamento em gradiente */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00D4FF] via-indigo-500 to-purple-500" />
    </footer>
  );
}
