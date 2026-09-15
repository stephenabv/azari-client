import { useEffect } from "react";
import { createPortal } from "react-dom";
import logoAnimated from "../assets/animations/logo-animated.svg";

const SCROLL_LOCK_CLASS = "as-page-loader-open";

/**
 * Full-screen branded overlay shown while a route transition is in flight.
 *
 * Portalled into <body> so it sits outside the page's stacking contexts and
 * can cover the fixed navbar. Nothing is rendered on the server: a transition
 * can only start once the router is live, so the client is the only place this
 * ever mounts and there is no markup to hydrate.
 */
export default function ASPageLoader() {
  useEffect(() => {
    // Freeze the outgoing page so it cannot scroll behind the overlay.
    document.body.classList.add(SCROLL_LOCK_CLASS);

    return () => {
      document.body.classList.remove(SCROLL_LOCK_CLASS);
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="as-page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <img src={logoAnimated} alt="" className="as-page-loader-logo" aria-hidden="true" />
    </div>,
    document.body,
  );
}
