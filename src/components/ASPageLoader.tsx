import { createPortal } from "react-dom";
import logoAnimated from "../assets/animations/logo-animated.svg";

export default function ASPageLoader() {
  return createPortal(
    <div className="as-page-loader" aria-label="Loading…" role="status">
      <img src={logoAnimated} alt="" className="as-page-loader-logo" aria-hidden="true" />
    </div>,
    document.body,
  );
}
