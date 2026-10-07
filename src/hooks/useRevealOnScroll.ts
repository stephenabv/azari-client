import { useEffect, useRef, useState } from "react";

/**
 * - `static`: render as-is (server HTML, no IntersectionObserver, or the
 *   visitor prefers reduced motion). Content is never hidden in this state.
 * - `pending`: hydrated and waiting off-screen; CSS may hide it to animate in.
 * - `revealed`: scrolled into view; CSS plays the entrance.
 */
export type RevealState = "static" | "pending" | "revealed";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Entrance-on-scroll for one element. It starts `static` so the server HTML
 * (and visitors without JavaScript) always shows the content; only after
 * hydration, and only when motion is allowed, does it switch to `pending`
 * and then `revealed` once a fraction of the element is visible.
 */
export function useRevealOnScroll<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.(REDUCED_MOTION).matches) return;

    // Already on screen at hydration: leave it static instead of flashing it out and back in.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setState("pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("revealed");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, state } as const;
}
