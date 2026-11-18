/**
 * Reference: Shared Motion/Framer Motion animation variants
 *
 * IMPORTANT: Motion's TypeScript types require string easing keywords
 * ("easeOut", "easeInOut", etc.) inside variant transition objects.
 * Raw number[] arrays (e.g. [0.16, 1, 0.3, 1]) only work in inline
 * transition props on motion.* elements.
 */

import type { Variants } from "motion/react";

const EASE_OUT = "easeOut" as const;

// ── Fade + rise with blur ──────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

// ── Stagger wrapper: wrap around a list to auto-stagger children ───────
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

// ── Directional slides ─────────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -80, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_OUT },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 80, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_OUT },
  },
};

// ── Scale pop (for dots, badges, icons) ───────────────────────────────
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

/**
 * Usage:
 *
 * // Single element
 * <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
 *   ...
 * </motion.div>
 *
 * // Staggered list
 * <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer}>
 *   {items.map(i => <motion.div key={i} variants={fadeUp}>...</motion.div>)}
 * </motion.div>
 */
