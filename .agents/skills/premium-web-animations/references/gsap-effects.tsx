/**
 * Reference: GSAP + ScrollTrigger animation patterns
 * Always call gsap.registerPlugin(ScrollTrigger) at module level.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Pattern 1: Hero text blur-fade stagger on page load ───────────────────
//
// Mark each text line with className="animate-line" in your JSX.
// Call this inside the Hero component's useEffect.
export function useHeroTextEntrance(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const blocks = ref.current.querySelectorAll(".animate-line");
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
}

// ── Pattern 2: Section text lines — skew-wipe on scroll enter ────────────
//
// Mark each line with className="story-line" in your JSX.
export function useSkewWipeOnScroll(ref: React.RefObject<HTMLElement | null>) {
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
}

// ── Pattern 3: Timeline / vertical line — scrubbed draw effect ───────────
//
// Apply to a div with height === full section, width === 1px (the line).
// The line draws from top to bottom as the user scrolls through the section.
export function useScrollDrawLine(lineRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1, // smoother with higher value; 1 = 1 second lag
        },
      }
    );
  }, []);
}

// ── Example component using Pattern 2 ────────────────────────────────────

export function StorySection() {
  const ref = useRef<HTMLDivElement>(null);
  useSkewWipeOnScroll(ref);

  return (
    <section>
      <div ref={ref}>
        <h2>
          <span className="block story-line">Every business has</span>
          <span className="block story-line" style={{ opacity: 0.4 }}>a story.</span>
          <span className="block story-line">Most websites</span>
          <span className="block story-line" style={{ color: "var(--accent)" }}>fail to tell it.</span>
        </h2>
      </div>
    </section>
  );
}

// ── Example component using Pattern 3 ────────────────────────────────────

export function TimelineSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  useScrollDrawLine(lineRef);

  const steps = [
    { n: "01", t: "Discover" },
    { n: "02", t: "Design" },
    { n: "03", t: "Develop" },
  ];

  return (
    <section style={{ position: "relative" }}>
      {/* The scrubbed line */}
      <div
        ref={lineRef}
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.08)",
        }}
      />
      {steps.map((s) => (
        <div key={s.n}>{s.t}</div>
      ))}
    </section>
  );
}
