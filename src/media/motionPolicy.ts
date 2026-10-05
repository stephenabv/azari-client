/**
 * Decides whether decorative motion (autoplaying background video) should
 * play for this visitor. When it should not, LazyVideo keeps showing the
 * poster instead of downloading the video.
 */
export interface MotionPolicy {
  allowsAutoplayVideo(): boolean;
}

type NetworkInformationLike = {
  readonly saveData?: boolean;
  readonly effectiveType?: string;
};

const SLOW_CONNECTIONS: ReadonlySet<string> = new Set(["slow-2g", "2g", "3g"]);

/** Reads the visitor's motion preference and connection hints. */
export class BrowserMotionPolicy implements MotionPolicy {
  allowsAutoplayVideo(): boolean {
    if (typeof window === "undefined") return false;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    if (connection?.saveData) return false;
    if (connection?.effectiveType && SLOW_CONNECTIONS.has(connection.effectiveType)) return false;
    return true;
  }
}

export const defaultMotionPolicy: MotionPolicy = new BrowserMotionPolicy();
