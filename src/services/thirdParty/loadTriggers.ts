/**
 * Conditions that release a deferred third-party script. Each trigger
 * resolves once; `cancel` stops it from firing.
 */
export interface LoadTrigger {
  wait(): { ready: Promise<void>; cancel: () => void };
}

/** Fires when the main thread is idle, or after `timeoutMs` at the latest. */
export class IdleTrigger implements LoadTrigger {
  private readonly timeoutMs: number;

  constructor(timeoutMs = 4000) {
    this.timeoutMs = timeoutMs;
  }

  wait() {
    let cancel: () => void = () => undefined;
    const ready = new Promise<void>((resolve) => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(() => resolve(), { timeout: this.timeoutMs });
        cancel = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(resolve, this.timeoutMs);
        cancel = () => window.clearTimeout(id);
      }
    });
    return { ready, cancel };
  }
}

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll", "wheel"] as const;

/** Fires on the visitor's first interaction with the page. */
export class InteractionTrigger implements LoadTrigger {
  wait() {
    let cancel: () => void = () => undefined;
    const ready = new Promise<void>((resolve) => {
      const fire = () => {
        cancel();
        resolve();
      };
      const options: AddEventListenerOptions = { once: true, passive: true, capture: true };
      for (const type of INTERACTION_EVENTS) window.addEventListener(type, fire, options);
      cancel = () => {
        for (const type of INTERACTION_EVENTS) window.removeEventListener(type, fire, options);
      };
    });
    return { ready, cancel };
  }
}

/** Fires as soon as any of its triggers does. */
export class FirstOfTrigger implements LoadTrigger {
  private readonly triggers: readonly LoadTrigger[];

  constructor(...triggers: LoadTrigger[]) {
    this.triggers = triggers;
  }

  wait() {
    const waits = this.triggers.map((t) => t.wait());
    const cancel = () => waits.forEach((w) => w.cancel());
    const ready = Promise.race(waits.map((w) => w.ready)).then(cancel);
    return { ready, cancel };
  }
}
