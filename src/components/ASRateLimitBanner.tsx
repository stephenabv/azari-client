import { useEffect, useRef, useState } from "react";
import { subscribeRateLimit, type RateLimitInfo } from "../services/ASContent";

export default function ASRateLimitBanner() {
  const [info, setInfo]           = useState<RateLimitInfo | null>(null);
  const [remaining, setRemaining] = useState(0);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to rate-limit events from any API call
  useEffect(() => {
    return subscribeRateLimit((incoming) => {
      setInfo(incoming);
      setRemaining(incoming.retryAfterSec);
    });
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!info) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const left = Math.ceil((info.resetAt - Date.now()) / 1000);
      if (left <= 0) {
        clearInterval(timerRef.current!);
        setInfo(null);
        setRemaining(0);
      } else {
        setRemaining(left);
      }
    }, 500);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [info]);

  if (!info) return null;

  const pct = Math.min(100, Math.round((remaining / info.retryAfterSec) * 100));

  return (
    <div className="as-rl-banner" role="alert" aria-live="polite">
      <span className="as-rl-icon" aria-hidden="true">⚠</span>

      <div className="as-rl-body">
        <p className="as-rl-title">Too many requests</p>
        <p className="as-rl-sub">
          You've sent too many requests. Please wait{" "}
          <strong className="as-rl-countdown">{remaining}s</strong> before
          trying again.
        </p>
        <div className="as-rl-track" aria-hidden="true">
          <div className="as-rl-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <button
        className="as-rl-close"
        onClick={() => { setInfo(null); setRemaining(0); }}
        aria-label="Dismiss rate limit notice"
      >
        ×
      </button>
    </div>
  );
}
