import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../hooks/useScrollLock";
import logoAnimated from "../assets/animations/logo-animated.svg";

/** Pointer travel, in px, that commits a swipe instead of snapping back. */
const SWIPE_COMMIT_PX = 70;
/** Below this ratio of horizontal to vertical travel the gesture is a scroll, not a swipe. */
const SWIPE_AXIS_RATIO = 1.2;

export interface ASLightboxProps {
  images: string[];
  /** Index of the image on show. The parent unmounts this component to close. */
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  /** Used to build each image's alt text, e.g. "Gallery photo 3 of 12". */
  label?: string;
}

const wrap = (i: number, length: number) => ((i % length) + length) % length;

/**
 * Full-screen image viewer for the project galleries.
 *
 * Navigation wraps in both directions so the arrows are never dead ends, and
 * is driven by three inputs that share one handler: the on-screen buttons,
 * the arrow keys, and a horizontal drag. Dragging tracks the pointer so the
 * gesture reads as direct manipulation, then either commits past
 * SWIPE_COMMIT_PX or springs back.
 *
 * The viewer is portalled to <body> and holds a scroll lock for its lifetime,
 * which both keeps the page behind it still and returns the reader to the
 * same scroll offset on close.
 */
export default function ASLightbox({ images, index, onIndexChange, onClose, label = "Gallery photo" }: ASLightboxProps) {
  const total = images.length;

  // Tracking which src has decoded, rather than a boolean reset on every
  // index change, keeps the spinner correct without an effect: going back to
  // an image already in cache shows it immediately.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);
  const gestureRef = useRef<{ id: number; x: number; y: number; axis: "undecided" | "x" | "y" } | null>(null);

  useScrollLock(true);

  const goTo = useCallback((next: number) => {
    onIndexChange(wrap(next, total));
  }, [onIndexChange, total]);

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  // Warm the neighbours so a swipe or arrow press lands on a decoded image.
  useEffect(() => {
    if (total < 2) return;
    [index - 1, index + 1].forEach((i) => {
      const img = new Image();
      img.src = images[wrap(i, total)];
    });
  }, [images, index, total]);

  // Focus moves to the dialog itself rather than the close button: a
  // programmatic focus on a button reads as :focus-visible and would paint a
  // keyboard focus ring for someone who just clicked a photo.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement;
    dialogRef.current?.focus();

    return () => {
      const target = restoreFocusRef.current;
      if (target instanceof HTMLElement) target.focus();
    };
  }, []);

  useEffect(() => {
    // `nearest` on the block axis so this only ever scrolls the strip itself,
    // never the frozen page behind it.
    activeThumbRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape": onClose(); break;
        case "ArrowLeft": e.preventDefault(); goPrev(); break;
        case "ArrowRight": e.preventDefault(); goNext(); break;
        case "Home": e.preventDefault(); goTo(0); break;
        case "End": e.preventDefault(); goTo(total - 1); break;
        default: return;
      }
      // Escape is handled by other overlays on the page too; this viewer is
      // on top, so it consumes the key rather than closing them as well.
      e.stopPropagation();
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [goNext, goPrev, goTo, onClose, total]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (total < 2 || !e.isPrimary) return;
    gestureRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: "undecided" };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.id !== e.pointerId) return;

    const dx = e.clientX - gesture.x;
    const dy = e.clientY - gesture.y;

    if (gesture.axis === "undecided") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      gesture.axis = Math.abs(dx) > Math.abs(dy) * SWIPE_AXIS_RATIO ? "x" : "y";
    }
    if (gesture.axis !== "x") return;

    setDragX(dx);
  };

  const endGesture = (e: React.PointerEvent) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.id !== e.pointerId) return;
    gestureRef.current = null;
    setIsDragging(false);

    const dx = e.clientX - gesture.x;
    setDragX(0);

    if (gesture.axis !== "x" || Math.abs(dx) < SWIPE_COMMIT_PX) return;
    if (dx > 0) goPrev(); else goNext();
  };

  const src = images[index];
  const loaded = loadedSrc === src;
  const position = `${index + 1} / ${total}`;

  return createPortal(
    <div
      ref={dialogRef}
      className="as-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} viewer`}
      tabIndex={-1}
      onClick={onClose}
    >
      <div className="as-lightbox-bar" onClick={(e) => e.stopPropagation()}>
        <span className="as-lightbox-counter" aria-live="polite">
          {position}
        </span>
        <button
          type="button"
          className="as-lightbox-btn as-lightbox-close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="20" height="20" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div
        className="as-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        {total > 1 && (
          <button
            type="button"
            className="as-lightbox-btn as-lightbox-nav as-lightbox-nav--prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <figure className="as-lightbox-figure">
          {!loaded && (
            <img src={logoAnimated} alt="" className="as-lightbox-spinner" aria-hidden="true" />
          )}
          <img
            key={src}
            src={src}
            alt={`${label} ${position}`}
            className={`as-lightbox-img${loaded ? " is-loaded" : ""}${isDragging ? " is-dragging" : ""}`}
            style={dragX ? { transform: `translateX(${dragX}px)` } : undefined}
            draggable={false}
            onLoad={() => setLoadedSrc(src)}
            onError={() => setLoadedSrc(src)}
          />
        </figure>

        {total > 1 && (
          <button
            type="button"
            className="as-lightbox-btn as-lightbox-nav as-lightbox-nav--next"
            onClick={goNext}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="as-lightbox-thumbs" onClick={(e) => e.stopPropagation()}>
          <div className="as-lightbox-thumbs-track">
            {images.map((thumb, i) => (
              <button
                key={i}
                type="button"
                className={`as-lightbox-thumb${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Show ${label.toLowerCase()} ${i + 1} of ${total}`}
                aria-current={i === index}
                ref={i === index ? activeThumbRef : undefined}
              >
                <img src={thumb} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
