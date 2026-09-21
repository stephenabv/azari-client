import { useCallback, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";
import logoAnimated from "../assets/animations/logo-animated.svg";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  wrapClassName?: string;
}

/**
 * Image with a branded placeholder held until the image itself is ready.
 *
 * The readiness flag is keyed on the src rather than being a bare boolean set
 * by onLoad. A boolean is wrong in two ways: `load` fires exactly once, and
 * only if React is listening when it happens. Markup rendered on the server
 * starts fetching as soon as the browser parses it, so an image already in
 * cache — every image after a reload — finishes before hydration attaches the
 * handler, and the event React is waiting for has already been and gone. The
 * placeholder then covers a picture that is sitting right there, forever.
 *
 * So readiness is instead recorded as "this src is done", set from whichever
 * of the two signals arrives: the load/error event, or the element already
 * reporting `complete` when React first gets hold of it. Keying on src also
 * brings the placeholder back if the src is later pointed somewhere else.
 */
export default function ASImgLoader({ wrapClassName, onLoad, onError, ...imgProps }: Props) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const { src } = imgProps;
  // With no src there is nothing to wait for; showing a placeholder for an
  // image that will never arrive is worse than showing the empty frame.
  const ready = src == null || loadedSrc === src;

  // Ref callbacks run on commit — after hydration has adopted the server's
  // markup — which is the first moment React can ask whether the browser
  // already finished. `complete` covers a decoded image and a failed one
  // alike, matching the onError branch below: either way the wait is over.
  const captureImg = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setLoadedSrc(img.getAttribute("src"));
  }, []);

  const settle = (e: SyntheticEvent<HTMLImageElement>) => {
    setLoadedSrc(e.currentTarget.getAttribute("src"));
  };

  return (
    <div className={`as-img-loader${wrapClassName ? ` ${wrapClassName}` : ""}`}>
      <img
        {...imgProps}
        ref={captureImg}
        onLoad={(e) => { settle(e); onLoad?.(e); }}
        onError={(e) => { settle(e); onError?.(e); }}
      />
      {!ready && (
        <div className="as-img-loader-overlay" aria-hidden="true">
          <img src={logoAnimated} alt="" className="as-img-loader-logo" />
        </div>
      )}
    </div>
  );
}
