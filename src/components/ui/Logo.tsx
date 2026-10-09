"use client";
import React from 'react';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '@/context/ThemeContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  width?: number;
  height?: number;
}

export function Logo({ 
  className, 
  width = 200,
  height = 60
}: LogoProps) {
  // Tentamos ler o tema, mas como o Logo pode ser renderizado em lugares sem o Context
  // (ex: fora do onBoarding), fazemos fallback suave.
  let theme = "dark";
  try {
    const context = useTheme();
    if (context) theme = context.theme;
  } catch (e) {
    // silently fallback to dark
  }

  // MedCore Branco (Dark backgrounds), MedCore Escuro (Light backgrounds).
  const logoSrc = theme === "dark" ? "/Logos/medcore-white.svg" : "/Logos/medcore-black.svg";

  return (
    <div className={cn("inline-flex items-center group", className)}>
      <div className="relative group-hover:drop-shadow-[0_0_20px_rgba(58,223,250,0.3)] transition-all duration-500">
        <Image 
          src={logoSrc} 
          alt="MedCore Logo" 
          width={width} 
          height={height}
          priority
          className="opacity-95 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
