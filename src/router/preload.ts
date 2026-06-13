export interface RoutePreloadStrategy {
  register(routes: PreloadableRoute[]): void;
  destroy(): void;
}

export interface PreloadableRoute {
  path: string;
  preload: () => Promise<unknown>;
}

// ─── Noop ────────────────────────────────────────────────────────────────────

export class NoopPreloadStrategy implements RoutePreloadStrategy {
  register(_routes: PreloadableRoute[]) {}
  destroy() {}
}

// ─── Idle ────────────────────────────────────────────────────────────────────

export class IdlePreloadStrategy implements RoutePreloadStrategy {
  private handles: number[] = [];

  register(routes: PreloadableRoute[]) {
    if (!("requestIdleCallback" in window)) {
      routes.forEach(r => r.preload().catch(() => null));
      return;
    }
    this.handles = routes.map(route =>
      requestIdleCallback(() => route.preload().catch(() => null), { timeout: 3000 })
    );
  }

  destroy() {
    if ("cancelIdleCallback" in window) {
      this.handles.forEach(h => cancelIdleCallback(h));
    }
    this.handles = [];
  }
}

// ─── Hover ───────────────────────────────────────────────────────────────────

export class HoverPreloadStrategy implements RoutePreloadStrategy {
  private listeners = new Map<Element, () => void>();

  register(routes: PreloadableRoute[]) {
    const routeMap = new Map(routes.map(r => [r.path, r]));

    const attach = () => {
      document.querySelectorAll<HTMLElement>("[data-preload]").forEach(el => {
        if (this.listeners.has(el)) return;
        const path = el.getAttribute("data-preload");
        if (!path) return;
        const route = routeMap.get(path);
        if (!route) return;

        let fired = false;
        const handler = () => {
          if (fired) return;
          fired = true;
          route.preload().catch(() => null);
        };

        el.addEventListener("mouseenter", handler, { passive: true });
        el.addEventListener("focusin", handler, { passive: true });
        this.listeners.set(el, handler);
      });
    };

    // Initial attach + re-attach when nav renders
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    this._mo = mo;
  }

  private _mo?: MutationObserver;

  destroy() {
    this._mo?.disconnect();
    this.listeners.forEach((handler, el) => {
      el.removeEventListener("mouseenter", handler);
      el.removeEventListener("focusin", handler);
    });
    this.listeners.clear();
  }
}
