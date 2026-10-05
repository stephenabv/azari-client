import { useEffect, useState, type RefObject } from "react";

export type CountUpOptions = {
  /** Animation length in milliseconds. */
  duration?: number;
  /** Fraction of the element that must be visible before counting starts. */
  threshold?: number;
};

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

/**
 * A number that counts up from 0 to `target` when its element scrolls into
 * view, without ever hiding the real value from the server-rendered HTML.
 *
 * The first render (server and hydration) returns `target`, so crawlers and
 * no-JS visitors see the final figure. After hydration:
 *   - reduced motion, or the element already on screen: the value stays put;
 *   - otherwise it is reset to 0 while still off screen and counts up once
 *     the element becomes visible.
 */
export function useCountUp(
  ref: RefObject<Element | null>,
  target: number,
  { duration = 1500, threshold = 0.25 }: CountUpOptions = {},
): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || isInViewport(el) || typeof IntersectionObserver === "undefined") {
      setValue(target);
      return;
    }

    setValue(0);
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(progress < 1 ? target * easeOutCubic(progress) : target);
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, target, duration, threshold]);

  return value;
}
