"use client";

import React from "react";
import { motion } from "framer-motion";

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  immediate?: boolean;
}

/**
 * Entrada suave com fade-in disparada ao descer o scroll (ou imediata no Hero).
 */
export function MotionReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  y = 24,
  x = 0,
  immediate = false,
}: MotionRevealProps) {
  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y, x }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration, delay, ease: SMOOTH_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
      transition={{ duration, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HeroCascadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
}

/**
 * Sequenciador escalonado para a dobra inicial (Hero & Navbar),
 * evitando que todos os elementos apareçam ao mesmo tempo.
 */
export function HeroCascade({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  y = 20,
  x = 0,
}: HeroCascadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
}

/**
 * Container que anima seus StaggerItem filhos em sequência espaçada no tempo.
 */
export function StaggerGroup({
  children,
  className = "",
  stagger = 0.14,
  delay = 0.08,
  immediate = false,
}: StaggerGroupProps) {
  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  if (immediate) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
  duration?: number;
}

/**
 * Item filho de StaggerGroup com entrada fade-in e deslocamento suave.
 */
export function StaggerItem({
  children,
  className = "",
  y = 24,
  x = 0,
  duration = 0.6,
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, x },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration, ease: SMOOTH_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
