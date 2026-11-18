---
name: frontend-design-brain
description: Frontend Design Brain focused on purposeful motion, micro-interactions, visual hierarchy, performance-first animations, accessibility, and premium SaaS aesthetics.
---

# Frontend Design Brain (Inspired by Emil Kowalski's UI Motion Principles)

This skill provides advanced design guidelines, micro-interactions, motion principles, and component checklists to create premium, performant, and accessible user interfaces.

## 1. UI Principles
- **Predictability & Delight**: A predictable and delightful experience makes a product stand out. Use animations strategically to improve cognitive understanding, not just for aesthetic spectacle.
- **Natural Transitions**: Instantly appearing/disappearing items feel artificial. Everything in the real world has transition timing and physical state changes.
- **Hierarchy & Spacing**: Use clean grids and dead zones to guide attention.
- **Visual Pace**: Avoid animating every element on the screen. Pace transitions throughout the experience to enrich context.

## 2. Timing & Easing (Speed)
- **Duration**: Interaction animations must be fast, generally shorter than **300ms** (typically 100–300ms) to feel snappy and connected.
- **Perceived Performance**: Snappy transitions make users feel the app is working hard and responding immediately.
- **Snappy Easing**: Prefer `ease-out` for snappy interactions. It starts fast and slows down at the end, giving the impression of immediate responsiveness while maintaining a smooth landing.
- **Elegant Easing**: Use `ease` (slower, symmetric curve) instead of `ease-out` for highly refined, elegant feedback elements (e.g., floating toasts, slide-in notifications).
- **Physical Springs**: Play with spring parameters (stiffness, damping, mass) to mimic organic motion (like iOS Dynamic Island).

## 3. Interaction Constraints
- **CRITICAL RULE**: **Never animate keyboard-initiated actions** (e.g., opening a command menu like Raycast, triggering key shortcuts, typing search inputs). These actions are executed hundreds of times daily; animations will feel sluggish and disconnected from the user's immediate input.
- **State Changes**: Limit enter/exit animations to state transitions, such as modal overlays, dropdowns, list changes, or tab changes.

## 4. Performance & Hardware Acceleration
- **Composite-Only Properties**: Stick to animating **`transform`** (scale, rotate, translate) and **`opacity`**. 
  - *Why*: These properties only trigger the **Composite** rendering step. Properties like `width`, `height`, `margin`, `padding`, `top`, or `left` trigger **Layout** and **Paint**, causing browser recalculations and dropping frames below 60fps.
- **Hardware Acceleration**: If the browser's main thread is busy loading content, Framer Motion or JS-based animations (which rely on `requestAnimationFrame` on the main thread) will stutter. Prevent this by using hardware-accelerated animations (CSS transitions or WAAPI) to offload the animation processing to the GPU.
- **Avoid JS layout animations** during page navigation or high-load states (e.g., Vercel dashboard tabs shared layout animations were refactored to CSS transitions to prevent frame drops).

## 5. Interruptibility
- **Organic Interruptions**: User actions must feel immediate. If an expand transition is triggered and a user instantly closes it (or presses `Escape`), the animation must interrupt and smoothly transition reverse-state without completing the initial entry phase.
- **Transitions over Keyframes**: CSS `transition` is naturally interruptible and shifts to new values smoothly, whereas CSS `@keyframes` can feel jarring when interrupted mid-animation. Prefer transitions.

## 6. Accessibility & Reduced Motion
- **Vestibular Safety**: High-motion or scaling animations can cause motion sickness or distraction. Always design with reduced motion alternatives.
- **CSS Media Queries**: Use the `prefers-reduced-motion` media query to simplify layouts on demand:
  ```css
  .element {
    animation: slideUp 0.3s ease-out;
  }
  @media (prefers-reduced-motion: reduce) {
    .element {
      animation: fade 0.2s ease-out; /* Replace slide with a simple opacity fade */
    }
  }
  ```
- **React / Framer Motion**: Use the `useReducedMotion()` hook to conditionally clamp translations or scale animations to 0:
  ```tsx
  import { useReducedMotion, motion } from "framer-motion";
  
  export function Sidebar({ isOpen }) {
    const shouldReduceMotion = useReducedMotion();
    const closedX = shouldReduceMotion ? 0 : "-100%";
    
    return (
      <motion.div
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : closedX
        }}
      />
    );
  }
  ```

## 7. Component Checklist
### Cards:
- Generous padding and clean typography.
- Soft ambient shadows (large blur, very low opacity).
- Hover micro-interactions: Gentle elevation using `translateY(-4px)` (transform) and shadow strength increase.
- Fully interactive and focusable with clear contrast outlines.

### Hero Sections:
- Clean, oversized headers.
- Supporting copy/description paragraph.
- One primary CTA and one secondary CTA.
- Performant entrance animations (e.g., transition opacity and translation).
