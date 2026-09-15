import { useEffect } from "react";
import { acquireScrollLock } from "../services/ASScrollLock";

/**
 * Holds a scroll lock for as long as `active` is true.
 *
 * Every overlay should lock through this rather than touching
 * `document.body.style` directly — see ASScrollLock for why overlays cannot
 * own those styles individually.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const lock = acquireScrollLock();
    return () => lock.release();
  }, [active]);
}
