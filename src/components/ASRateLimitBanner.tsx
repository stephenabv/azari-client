import { useEffect, useRef, useState } from "react";
import { splitAtSlot, useSecondsLabel } from "../hooks/useSecondsLabel";
import { useT } from "../i18n";
import { subscribeRateLimit, type RateLimitInfo } from "../services/ASContent";

const RADIUS       = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ASRateLimitWall() {
  const [info, setInfo]           = useState<RateLimitInfo | null>(null);
  const [remaining, setRemaining] = useState(0);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const t                         = useT();
  const seconds                   = useSecondsLabel();

  useEffect(() => {
    return subscribeRateLimit((incoming) => {
      setInfo(incoming);
      setRemaining(incoming.retryAfterSec);
    });
  }, []);

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

  const pct    = Math.min(100, (remaining / info.retryAfterSec) * 100);
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  const [resumeBefore, resumeAfter] = splitAtSlot(t("system.rateLimit.resume"), "time");

  return (
    <div className="as-rl-wall" role="alertdialog" aria-modal="true" aria-label={t("system.rateLimit.ariaLabel")}>
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
            <span className="as-rl-ring-unit">{seconds.unit(remaining)}</span>
          </div>
        </div>

        <h2 className="as-rl-heading">{t("system.rateLimit.title")}</h2>
        <p className="as-rl-desc">
          {t("system.rateLimit.body")}{" "}
          {resumeBefore}
          <strong>{seconds.count(remaining)}</strong>
          {resumeAfter}
        </p>

        <div className="as-rl-bar-track" aria-hidden="true">
          <div className="as-rl-bar-fill" style={{ width: `${pct}%` }} />
        </div>

      </div>
    </div>
  );
}
