"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GsapAnimatedProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "fade" | "scale";
  duration?: number;
}

export function GsapAnimated({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.4
}: GsapAnimatedProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    let fromVars: gsap.TweenVars = { opacity: 0 };
    if (direction === "up") fromVars.y = 15;
    if (direction === "down") fromVars.y = -15;
    if (direction === "scale") fromVars.scale = 0.96;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elRef.current,
        fromVars,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [delay, direction, duration]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
