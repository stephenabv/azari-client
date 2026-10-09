import { useEffect, useState, useSyncExternalStore } from "react";
import { rateLimitStore } from "../services/rateLimit/RateLimitStore";

const RADIUS       = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICK_MS      = 500;

export default function ASRateLimitWall() {
  const info = useSyncExternalStore(
    rateLimitStore.subscribe,
    rateLimitStore.getSnapshot,
    rateLimitStore.getServerSnapshot,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!info) return;
    const tick = () => {
      const current = Date.now();
      if (current >= info.resetAt) rateLimitStore.clear();
      else setNow(current);
    };
    tick();
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, [info]);

  if (!info) return null;

  const remaining = Math.max(1, Math.ceil((info.resetAt - now) / 1000));

  const pct    = Math.min(100, (remaining / info.retryAfterSec) * 100);
  const offset = CIRCUMFERENCE * (1 - pct / 100);

  return (
    <div className="as-rl-wall" role="alertdialog" aria-modal="true" aria-label="Rate limit exceeded">
      <div className="as-rl-card">

        <p className="as-rl-logo">azari<span>.solar</span></p>

        {}
        <div className="as-rl-ring-wrap">
          <svg
            className="as-rl-ring-svg"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle className="as-rl-ring-track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="as-rl-ring-fill"
              cx="60" cy="60" r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="as-rl-ring-center" aria-live="polite">
            <span className="as-rl-ring-count">{remaining}</span>
            <span className="as-rl-ring-unit">seconds</span>
          </div>
        </div>

        <h2 className="as-rl-heading">Too Many Requests</h2>
        <p className="as-rl-desc">
          You've been temporarily throttled due to too many requests.
          Access will automatically resume in{" "}
          <strong>{remaining} second{remaining !== 1 ? "s" : ""}</strong>.
        </p>

        <div className="as-rl-bar-track" aria-hidden="true">
          <div className="as-rl-bar-fill" style={{ width: `${pct}%` }} />
        </div>

      </div>
    </div>
  );
}
