/**
 * Reference: Motion/Framer Motion component patterns
 * All patterns use "motion/react" (not "motion" or "framer-motion")
 */

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";

// ── Pattern 1: Parallax hero with scale + fade-out on scroll ─────────────

export function ParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 20 }); // smoothed spring
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={heroRef} style={{ minHeight: "100vh" }}>
      <motion.div style={{ scale, opacity, y }}>
        <h1>Your hero content</h1>
      </motion.div>
    </section>
  );
}

// ── Pattern 2: Horizontal drift text (parallax scroll) ───────────────────

export function DriftText() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref}>
      <motion.h2 style={{ x }}>
        Every pixel has a <span style={{ color: "var(--accent)" }}>purpose.</span>
      </motion.h2>
    </section>
  );
}

// ── Pattern 3: Card zoom-in + corner-sharpen on scroll ───────────────────

export function ZoomCard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [40, 24]);

  return (
    <section ref={ref}>
      <motion.div
        style={{ scale, borderRadius }}
        className="border border-border overflow-hidden"
      >
        Case study card content
      </motion.div>
    </section>
  );
}

// ── Pattern 4: Spring hover card ─────────────────────────────────────────

export function HoverCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="rounded-2xl border border-border bg-surface/40 p-8"
      whileHover={{
        y: -8,
        borderColor: "rgba(163,255,63,0.4)",
        backgroundColor: "rgba(163,255,63,0.03)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(163,255,63,0.15)",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

// ── Pattern 5: AnimatePresence accordion ─────────────────────────────────

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = [0, () => {}]; // replace with useState

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.q} className="border-t border-border last:border-b">
          <button
            className="flex w-full items-center justify-between py-6"
            // onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <motion.span
              animate={{
                rotate: open === i ? 180 : 0,
                borderColor: open === i ? "var(--accent)" : "var(--border)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-full border p-2"
            >
              {open === i ? "−" : "+"}
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden" // required!
              >
                <p className="pb-6 text-muted-foreground">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Pattern 6: Floating orb background with Motion keyframes ─────────────

export function FloatingOrbs() {
  return (
    <>
      {/* Breathing glow — great for CTA sections */}
      <motion.div
        className="absolute rounded-full bg-accent/15 blur-[160px] h-[800px] w-[800px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Slow drift — great for hero sections */}
      <motion.div
        className="absolute rounded-full bg-accent/10 blur-[140px] h-[600px] w-[600px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ── Pattern 7: Staggered nav entrance ────────────────────────────────────

export function AnimatedNav({ links }: { links: string[] }) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {links.map((link, i) => (
        <motion.a
          key={link}
          href={`#${link.toLowerCase()}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          whileHover={{ y: -2 }}
        >
          {link}
        </motion.a>
      ))}
    </motion.header>
  );
}

// ── Pattern 8: Star rating animate-in ────────────────────────────────────

export function AnimatedStars({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 400 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}
