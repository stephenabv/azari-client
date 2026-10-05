/**
 * Blocks user-initiated scrolling while a full-screen overlay is up, without
 * touching the page's scroll position.
 *
 * `overflow: hidden` on <body> alone is not enough on mobile: Android Chrome
 * and iOS Safari keep scrolling the root on a fast swipe, the URL bar
 * collapses, and the page shows beneath the overlay. Moving the body to
 * `position: fixed` (what ASScrollLock does for modals) would stop that, but
 * restoring the old offset on release fights the router's scroll restoration
 * on a page transition. So this guard cancels the scroll inputs themselves
 * (wheel, touch drag, scroll keys) and leaves the position alone.
 */
const SCROLL_KEYS = new Set([
  "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar",
]);

const ROOT_CLASS = "as-scroll-guarded";

export class ScrollInputGuard {
  private active = false;

  private readonly cancel = (event: Event): void => {
    if (event.cancelable) event.preventDefault();
  };

  private readonly cancelKey = (event: KeyboardEvent): void => {
    if (SCROLL_KEYS.has(event.key)) this.cancel(event);
  };

  engage(): void {
    if (this.active || typeof document === "undefined") return;
    this.active = true;

    document.documentElement.classList.add(ROOT_CLASS);
    document.body.classList.add(ROOT_CLASS);
    // passive: false is what allows preventDefault on wheel and touchmove.
    window.addEventListener("wheel", this.cancel, { passive: false });
    window.addEventListener("touchmove", this.cancel, { passive: false });
    window.addEventListener("keydown", this.cancelKey);
  }

  release(): void {
    if (!this.active) return;
    this.active = false;

    document.documentElement.classList.remove(ROOT_CLASS);
    document.body.classList.remove(ROOT_CLASS);
    window.removeEventListener("wheel", this.cancel);
    window.removeEventListener("touchmove", this.cancel);
    window.removeEventListener("keydown", this.cancelKey);
  }
}
