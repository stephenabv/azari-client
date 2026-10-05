import { useEffect, useRef, useState } from "react";
import { defaultMotionPolicy, type MotionPolicy } from "../../media/motionPolicy";
import { nearViewportStrategy, type MediaLoadStrategy } from "../../media/loadStrategies";

export type VideoSource = {
  src: string;
  type: "video/webm" | "video/mp4";
};

type LazyVideoProps = {
  /** In order of preference; the browser plays the first it supports. */
  sources: readonly VideoSource[];
  /**
   * Shown until the video mounts, and instead of it when motion is off.
   * Omit it when the container already paints a poster (the hero does this in
   * CSS so the right theme's image is in the server HTML and is the LCP).
   */
  poster?: string;
  strategy?: MediaLoadStrategy;
  policy?: MotionPolicy;
  /** Hold the video back until the caller knows which sources are right. */
  enabled?: boolean;
  className?: string;
};

/**
 * A muted, looping background video that is not part of the server HTML and
 * does not download until its strategy says so. Until then — and for good
 * when the visitor prefers reduced motion, has Save-Data on, or is on a 2G/3G
 * connection — only the poster (if any) is rendered. Decorative: hidden from
 * assistive technology.
 */
export function LazyVideo({
  sources,
  poster,
  strategy = nearViewportStrategy,
  policy = defaultMotionPolicy,
  enabled = true,
  className,
}: LazyVideoProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!enabled || !anchor || !policy.allowsAutoplayVideo()) return;
    return strategy.observe(anchor, () => setMounted(true));
  }, [enabled, strategy, policy]);

  return (
    <div ref={anchorRef} className={className} aria-hidden="true">
      {poster && !mounted && (
<img src={poster} alt="" decoding="async" loading="lazy" />
      )}
      {mounted && (
        <video key={sources[0]?.src} autoPlay muted loop playsInline preload="auto" poster={poster}>
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
    </div>
  );
}
