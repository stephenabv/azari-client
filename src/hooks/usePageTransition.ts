import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigation } from "react-router";

export interface PageTransitionOptions {
  /** Grace period before the overlay appears, so quick routes never flash it. */
  delayMs?: number;
  /** Minimum on-screen time once shown, so the overlay cannot flicker. */
  minVisibleMs?: number;
}

const DEFAULT_DELAY_MS = 120;
const DEFAULT_MIN_VISIBLE_MS = 420;

/**
 * Tracks whether a full page navigation is in flight.
 *
 * Only document navigations count: form submissions and in-page hash changes
 * keep the current page mounted, so showing a full-screen overlay for them
 * would hide content the user is still looking at.
 */
export function usePageTransition({
  delayMs = DEFAULT_DELAY_MS,
  minVisibleMs = DEFAULT_MIN_VISIBLE_MS,
}: PageTransitionOptions = {}): boolean {
  const navigation = useNavigation();
  const location = useLocation();

  const isNavigating =
    navigation.state === "loading" &&
    navigation.formData == null &&
    navigation.location != null &&
    navigation.location.pathname !== location.pathname;

  const [visible, setVisible] = useState(false);
  // Mirrors `visible` so the timing effect can read it without re-running
  // (and restarting its timers) on every visibility flip.
  const visibleRef = useRef(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    const show = (next: boolean) => {
      visibleRef.current = next;
      setVisible(next);
    };

    if (isNavigating) {
      const showTimer = setTimeout(() => {
        shownAtRef.current = Date.now();
        show(true);
      }, delayMs);

      return () => clearTimeout(showTimer);
    }

    if (!visibleRef.current) return;

    const remaining = minVisibleMs - (Date.now() - shownAtRef.current);
    if (remaining <= 0) {
      show(false);
      return;
    }

    const hideTimer = setTimeout(() => show(false), remaining);
    return () => clearTimeout(hideTimer);
  }, [isNavigating, delayMs, minVisibleMs]);

  return visible;
}
