import React from 'react';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  return (
    <div className={cn("flex items-center justify-center w-full group", className)}>
      <div className="relative group-hover:drop-shadow-[0_0_20px_rgba(58,223,250,0.3)] transition-all duration-500">
        <Image 
          src="/Logos/MedCore -logo (4).svg" 
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
