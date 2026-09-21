/**
 * Reference-counted lock on the document's scroll position.
 *
 * Overlays do not open and close in a clean stack: a package's detail modal
 * starts its close animation and hands off to the inquiry modal in the same
 * click, so for a few hundred milliseconds both are mounted. When each overlay
 * manages `document.body.style` itself, that overlap corrupts the restore —
 * the second to mount snapshots the first one's lock as the page's resting
 * state and puts it back on the way out, freezing the page with nothing open.
 *
 * So the body styles get exactly one owner. The first acquire records the real
 * resting state and applies the lock, later acquires only raise the count, and
 * the last release restores what was recorded and returns the viewport to
 * where the user left it. Overlapping lifetimes then compose correctly no
 * matter what order they start and end in.
 */

interface BodyStyleSnapshot {
  overflow: string;
  position: string;
  top: string;
  width: string;
  paddingRight: string;
}

export interface ScrollLockHandle {
  /** Idempotent: releasing a handle more than once is a no-op. */
  release(): void;
}

const NOOP_HANDLE: ScrollLockHandle = { release: () => {} };

let lockCount = 0;
let restingState: BodyStyleSnapshot | null = null;
let lockedScrollY = 0;

function read(style: CSSStyleDeclaration): BodyStyleSnapshot {
  return {
    overflow: style.overflow,
    position: style.position,
    top: style.top,
    width: style.width,
    paddingRight: style.paddingRight,
  };
}

function write(style: CSSStyleDeclaration, next: BodyStyleSnapshot): void {
  style.overflow = next.overflow;
  style.position = next.position;
  style.top = next.top;
  style.width = next.width;
  style.paddingRight = next.paddingRight;
}

/**
 * Freezes the page behind an overlay. `position: fixed` rather than plain
 * `overflow: hidden` because iOS Safari scrolls the body regardless of the
 * latter; the negative offset keeps the frozen page visually in place.
 */
export function acquireScrollLock(): ScrollLockHandle {
  if (typeof document === "undefined") return NOOP_HANDLE;

  const style = document.body.style;

  if (lockCount === 0) {
    lockedScrollY = window.scrollY;
    restingState = read(style);

    // Taking the page out of flow also takes away its scrollbar, and on a
    // platform with classic (space-consuming) scrollbars the viewport then
    // widens by that much and everything behind the overlay jumps sideways.
    // Standing the width back up as padding holds the page still. Overlay
    // scrollbars measure 0 here, so this is a no-op on those platforms.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const existingPad = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    write(style, {
      overflow: "hidden",
      position: "fixed",
      top: `-${lockedScrollY}px`,
      width: "100%",
      paddingRight: scrollbarWidth > 0 ? `${existingPad + scrollbarWidth}px` : restingState.paddingRight,
    });
  }

  lockCount += 1;

  let released = false;

  return {
    release() {
      if (released) return;
      released = true;

      lockCount = Math.max(0, lockCount - 1);
      if (lockCount > 0) return;

      if (restingState) write(style, restingState);
      restingState = null;
      window.scrollTo(0, lockedScrollY);
    },
  };
}
