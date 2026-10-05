/**
 * When a deferred media element may start loading. A strategy watches an
 * element and calls `onReady` once; the returned function cancels it.
 */
export interface MediaLoadStrategy {
  observe(element: Element, onReady: () => void): () => void;
}

/** Load as soon as the component has mounted (above-the-fold media). */
export class ImmediateStrategy implements MediaLoadStrategy {
  observe(_element: Element, onReady: () => void): () => void {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) onReady();
    });
    return () => {
      cancelled = true;
    };
  }
}

/** Load once the element comes within `rootMargin` of the viewport. */
export class ViewportStrategy implements MediaLoadStrategy {
  private readonly rootMargin: string;

  constructor(rootMargin = "300px 0px") {
    this.rootMargin = rootMargin;
  }

  observe(element: Element, onReady: () => void): () => void {
    if (typeof IntersectionObserver === "undefined") {
      onReady();
      return () => undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          onReady();
        }
      },
      { rootMargin: this.rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }
}

export const immediateStrategy: MediaLoadStrategy = new ImmediateStrategy();
export const nearViewportStrategy: MediaLoadStrategy = new ViewportStrategy();
