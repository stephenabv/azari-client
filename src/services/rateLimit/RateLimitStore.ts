/** A throttle the API reported: how long it asked us to wait, and until when. */
export type RateLimitInfo = { retryAfterSec: number; resetAt: number };

const STORAGE_KEY = "azari-rate-limit";
const DEFAULT_RETRY_AFTER_SEC = 60;

function isRateLimitInfo(value: unknown): value is RateLimitInfo {
  if (typeof value !== "object" || value === null) return false;
  const { retryAfterSec, resetAt } = value as Record<string, unknown>;
  return (
    typeof retryAfterSec === "number" && Number.isFinite(retryAfterSec) && retryAfterSec > 0 &&
    typeof resetAt === "number" && Number.isFinite(resetAt)
  );
}

/**
 * The active API throttle, shared by every tab of this browser. The service
 * keys its limit to the browser's session cookie, so the deadline is persisted
 * too: a tab opened while the throttle is in force shows the real time left
 * instead of a page that looks usable until its next API call fails.
 *
 * An external store for useSyncExternalStore: the server renders `null` and the
 * client picks up a persisted deadline right after hydration.
 */
class RateLimitStore {
  private readonly listeners = new Set<() => void>();
  /** `undefined` until the persisted value has been read on the client. */
  private current: RateLimitInfo | null | undefined;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    if (this.listeners.size === 1) window.addEventListener("storage", this.onStorage);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) window.removeEventListener("storage", this.onStorage);
    };
  };

  getSnapshot = (): RateLimitInfo | null => {
    if (this.current === undefined) this.current = this.read();
    // Expiry is resolved here rather than via update(): getSnapshot runs during
    // render, where notifying subscribers is not allowed.
    if (this.current && this.current.resetAt <= Date.now()) {
      this.current = null;
      this.write(null);
    }
    return this.current;
  };

  getServerSnapshot = (): RateLimitInfo | null => null;

  /** Records a 429 from the API, using its Retry-After header for the wait. */
  reportResponse(res: Response): RateLimitInfo {
    const header = Number.parseInt(res.headers.get("Retry-After") ?? "", 10);
    const retryAfterSec = Number.isFinite(header) && header > 0 ? header : DEFAULT_RETRY_AFTER_SEC;
    const info: RateLimitInfo = { retryAfterSec, resetAt: Date.now() + retryAfterSec * 1000 };
    this.update(info);
    return info;
  }

  /** Ends the throttle once its deadline has passed. */
  clear(): void {
    this.update(null);
  }

  private update(info: RateLimitInfo | null): void {
    this.current = info;
    this.write(info);
    this.listeners.forEach((listener) => listener());
  }

  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) return;
    this.current = this.read();
    this.listeners.forEach((listener) => listener());
  };

  private read(): RateLimitInfo | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      return isRateLimitInfo(parsed) && parsed.resetAt > Date.now() ? parsed : null;
    } catch {
      return null;
    }
  }

  private write(info: RateLimitInfo | null): void {
    try {
      if (info) localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage blocked: the throttle still shows for this page view.
    }
  }
}

export const rateLimitStore = new RateLimitStore();
