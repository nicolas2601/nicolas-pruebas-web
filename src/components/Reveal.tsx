"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

export function revealVariants(reduce: boolean, y = 14): Variants {
  return {
    hidden: { opacity: 0, transform: reduce ? "none" : `translateY(${y}px)` },
    show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.45, ease: EASE } },
  };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article";
};

export function Reveal({ children, className, delay = 0, y = 14, as = "div" }: RevealProps) {
  const reduce = useReducedMotion() ?? false;
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants(reduce, y)}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = { children: ReactNode; className?: string; gap?: number };

export function Stagger({ children, className, gap = 0.05 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = 12 }: { children: ReactNode; className?: string; y?: number }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div className={className} variants={revealVariants(reduce, y)}>
      {children}
    </motion.div>
  );
}
