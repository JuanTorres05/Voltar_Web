/**
 * Reference: Global Lenis smooth scroll setup
 * Place this inside your root layout component (e.g. __root.tsx / App.tsx)
 */

import Lenis from "lenis";
import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
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
}

/**
 * Usage in root component:
 *
 * function RootComponent() {
 *   useLenis();
 *   return <Outlet />;
 * }
 *
 * Also add to global CSS:
 *   @import "lenis/dist/lenis.css";
 */
