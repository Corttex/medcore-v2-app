"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animação de entrada suave da página
      gsap.from(container.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}
