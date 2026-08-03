import { useState, type ImgHTMLAttributes } from "react";
import logoAnimated from "../assets/animations/logo-animated.svg";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  wrapClassName?: string;
}

export default function ASImgLoader({ wrapClassName, onLoad, onError, ...imgProps }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`as-img-loader${wrapClassName ? ` ${wrapClassName}` : ""}`}>
      <img
        {...imgProps}
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        onError={(e) => { setLoaded(true); onError?.(e); }}
      />
      {!loaded && (
        <div className="as-img-loader-overlay" aria-hidden="true">
          <img src={logoAnimated} alt="" className="as-img-loader-logo" />
        </div>
      )}
    </div>
  );
}
