---
name: premium-web-animations
description: >
  A complete guide to implementing premium, production-grade web animations
  for React + TanStack Start / Vite projects using three industry-leading
  libraries: Lenis (smooth scroll), Motion/Framer Motion (React spring
  animations), and GSAP + ScrollTrigger (scroll-driven effects). Activate
  this skill when the user asks to enhance, add, or improve animations on a
  React web app, or when building a landing page / marketing site that needs
  premium motion design.
---

# Premium Web Animation Skill

This skill teaches you how to apply a **three-library animation stack** used
by top Awwwards-winning studios. All techniques shown here were built and
verified in a production React + Vite + TailwindCSS v4 project.

---

## Stack Overview

| Library | Role | Import |
|---|---|---|
| **Lenis** | Buttery smooth scroll | `import Lenis from "lenis"` |
| **Motion** (Framer Motion v11) | React spring-physics animations | `import { motion, … } from "motion/react"` |
| **GSAP + ScrollTrigger** | Scroll-scrubbed & timeline animations | `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger"` |

---

## 1. Installation

```bash
npm install lenis motion gsap
```

> `gsap` is a peer dep if already present. `motion` is the Framer Motion v11
> standalone package — its React exports live at `motion/react`.

---

## 2. Lenis Smooth Scroll (Global Setup)

Add Lenis **once** in the root layout/component so every page inherits it.

```tsx
// __root.tsx or App.tsx
import Lenis from "lenis";
import "lenis/dist/lenis.css";   // ← required for scroll container styles
import { useEffect } from "react";

function RootComponent() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <Outlet />;
}
```

Also import the Lenis CSS in your global stylesheet:
```css
@import "lenis/dist/lenis.css";
```

---

## 3. Motion / Framer Motion (React Animations)

Always import from `motion/react` (not `motion` or `framer-motion`):

```tsx
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
```

### 3a. Shared Reusable Variants

Define variants at module level and re-use across components.

> **Important**: Motion's TypeScript types do NOT accept raw `number[]` for
> `ease` inside variants. Use string keywords (`"easeOut"`, `"easeInOut"`) or
> the `cubicBezier()` helper. Raw `number[]` arrays **only** work in inline
> `transition` props on `motion.*` elements.

```tsx
const EASE_OUT = "easeOut" as const;

// Fade up with blur — works with whileInView
const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

// Stagger wrapper — wrap a list to auto-stagger children
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

// Directional slides
const slideInLeft = {
  hidden: { opacity: 0, x: -80, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE_OUT } },
};
const slideInRight = {
  hidden: { opacity: 0, x: 80, filter: "blur(4px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE_OUT } },
};
```

### 3b. Scroll-Triggered Entrance (whileInView)

```tsx
<motion.div
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-80px" }}
  variants={fadeUp}
>
  Content revealed when it enters viewport
</motion.div>

// Stagger a grid of cards:
<motion.div
  className="grid md:grid-cols-3 gap-4"
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-80px" }}
  variants={staggerContainer}
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeUp}>
      {/* each child auto-staggers */}
    </motion.div>
  ))}
</motion.div>
```

### 3c. Spring-Physics Hover Effects

```tsx
// Card lift with glow border
<motion.div
  whileHover={{
    y: -8,
    borderColor: "rgba(163,255,63,0.4)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  }}
  transition={{ type: "spring", stiffness: 280, damping: 22 }}
/>

// Button press feedback
<motion.a
  href="#"
  whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(163,255,63,0.45)" }}
  whileTap={{ scale: 0.97 }}
/>

// Text/icon hover with spring
<motion.h4
  whileHover={{ x: 10, color: "var(--accent)" }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
/>
```

### 3d. Scroll-Driven Parallax (useScroll + useTransform)

```tsx
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scale hero down as user scrolls
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const scale = useSpring(scaleRaw, { stiffness: 80, damping: 20 }); // smooth it out
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]); // parallax offset

  return (
    <section ref={ref}>
      <motion.div style={{ scale, opacity, y }}>
        Hero content
      </motion.div>
    </section>
  );
}

// Horizontal drift on text as page scrolls past:
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
const x = useTransform(scrollYProgress, [0, 1], [-80, 80]);
<motion.h3 style={{ x }}>Every pixel has a purpose.</motion.h3>
```

### 3e. AnimatePresence for Accordion / Conditional Content

```tsx
const [open, setOpen] = useState<number | null>(null);

{faqs.map((faq, i) => (
  <div key={faq.q}>
    <button onClick={() => setOpen(open === i ? null : i)}>
      {faq.q}
    </button>
    <AnimatePresence initial={false}>
      {open === i && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p>{faq.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
))}
```

### 3f. Scroll-Driven Scale + BorderRadius Reveal (Card zoom-in)

```tsx
function CaseStudy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [40, 24]);

  return (
    <section ref={ref}>
      <motion.div style={{ scale, borderRadius }}>
        {/* card zooms in and sharpens corners as it scrolls into view */}
      </motion.div>
    </section>
  );
}
```

### 3g. Nav Entrance Animation

```tsx
<motion.header
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
  {navLinks.map((link, i) => (
    <motion.a
      key={link}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      {link}
    </motion.a>
  ))}
</motion.header>
```

---

## 4. GSAP + ScrollTrigger

Register the plugin **once** at the module level:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

### 4a. Hero Text — Blur-Fade Stagger on Load

```tsx
useEffect(() => {
  const blocks = document.querySelectorAll(".animate-line");
  gsap.set(blocks, { opacity: 0, y: 60, filter: "blur(8px)" });
  gsap.to(blocks, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1.3,
    stagger: 0.2,
    ease: "expo.out",
    delay: 0.4,
  });
}, []);
```

### 4b. Text Lines — Skew Wipe on Scroll

```tsx
useEffect(() => {
  if (!ref.current) return;
  const spans = ref.current.querySelectorAll(".story-line");
  gsap.fromTo(
    spans,
    { opacity: 0, y: 80, skewY: 4 },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
}, []);
```

### 4c. Timeline Line — Scrubbed Draw Effect

```tsx
const lineRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!lineRef.current) return;
  gsap.fromTo(
    lineRef.current,
    { scaleY: 0, transformOrigin: "top center" },
    {
      scaleY: 1,
      ease: "none",               // linear = perfect scrub sync
      scrollTrigger: {
        trigger: lineRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,                 // lag in seconds (smoother = higher value)
      },
    }
  );
}, []);
```

---

## 5. Background Orb Animations (Motion keyframes)

Replacing CSS `@keyframes` with Motion's `animate` prop gives more control:

```tsx
// Breathing glow on CTA section
<motion.div
  className="absolute rounded-full bg-accent/15 blur-[160px]"
  animate={{ scale: [1, 1.15, 1] }}
  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
/>

// Floating orb drift
<motion.div
  className="absolute rounded-full bg-accent/10 blur-[140px]"
  animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
  transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
/>
```

---

## 6. Common Pitfalls & Rules

| Issue | Fix |
|---|---|
| `Module '"motion"' has no exported member 'motion'` | Use `"motion/react"` not `"motion"` |
| `Type 'number[]' is not assignable to type 'Easing'` | Only use `number[]` ease in inline `transition={}` props, not inside variant objects. Use `"easeOut"` etc. in variants. |
| GSAP ScrollTrigger not firing | Make sure `gsap.registerPlugin(ScrollTrigger)` is called at module level |
| Lenis & GSAP scroll position out of sync | Pass `lenis.raf(time)` inside the same rAF loop and don't use GSAP's own ticker |
| Lenis not working | Make sure `lenis/dist/lenis.css` is imported in your global CSS |
| `AnimatePresence` content jump | Set `className="overflow-hidden"` on the `motion.div` and animate `height: "auto"` |

---

## 7. Full File References

See the reference files for the complete, copy-pasteable implementations:

- [`references/root-lenis-setup.tsx`](references/root-lenis-setup.tsx) — Global Lenis + rAF setup
- [`references/animation-variants.ts`](references/animation-variants.ts) — All shared Motion variants
- [`references/gsap-effects.tsx`](references/gsap-effects.tsx) — GSAP ScrollTrigger examples
- [`references/motion-patterns.tsx`](references/motion-patterns.tsx) — Motion component patterns
