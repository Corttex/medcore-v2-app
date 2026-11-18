"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
