import { useEffect, useMemo, useState } from "react";
import climateDark from "../assets/images/dark/climate_bg_dark.webp";
import assetsDeployed from "../assets/images/dark/assets_deployed_dark.webp";
import { useT } from "../i18n";

type ASTropicsCardsProps = {
  isVisible: boolean;
  assetsDeployed: string;
  performanceRating: number;
};

const CARD_IMAGES = {
  climate: climateDark,
  solar: assetsDeployed,
  performance: "/images/performance-bg.jpg",
} as const;

function useCountUp(target: number, isActive: boolean, duration = 1500, decimals = 0): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const start = performance.now();
    let rafId: number;
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setValue(target);
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, target, duration, decimals]);
  return value;
}

export default function ASTropicsCards({ isVisible, assetsDeployed, performanceRating }: ASTropicsCardsProps) {
  const t = useT();
  const climateTags = [t("system.tropics.typhoonRacking"), t("system.tropics.heatOptimization")];
  const assetsNumber = parseFloat(assetsDeployed);
  const assetsUnit = assetsDeployed.replace(/[\d.]/g, "");

  const rolledAssets = useCountUp(assetsNumber, isVisible, 1600, 2);
  const rolledPerformance = useCountUp(performanceRating, isVisible, 1400, 0);

  const totalBars = 12;

  const activeBars = useMemo(() => {
    const normalizedRating = Math.min(Math.max(performanceRating, 0), 100);
    return Math.max(0, Math.ceil((normalizedRating / 100) * totalBars) - 2);
  }, [performanceRating]);

  const maxBarsHeight = 140;
  const barGap = 4;
  const barHeight = (maxBarsHeight - (totalBars - 1) * barGap) / totalBars;

  return (
    <div className="as-tropics-cards">
      <div
        className={`as-tropics-card as-climate-card ${isVisible ? "is-shown" : ""}`}
        style={{ backgroundImage: `url(${CARD_IMAGES.climate})` }}
      >
        <div className="as-card-overlay" />

        <p className="as-climate-title">{t("system.tropics.climateTitle")}</p>

        <div className="as-climate-tags">
          {climateTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div
        className={`as-tropics-card as-solar-card ${isVisible ? "is-shown" : ""}`}
        style={{ backgroundImage: `url(${CARD_IMAGES.solar})` }}
      >
        <div className="as-card-overlay as-solar-overlay" />

        <div className="as-solar-content">
          <p className="as-solar-title">
            {rolledAssets.toFixed(2)}
            {assetsUnit}
          </p>
          <p className="as-solar-description">{t("system.tropics.assetsDeployed")}</p>
        </div>
      </div>

      <div
        className={`as-tropics-card as-performance-card ${isVisible ? "is-shown" : ""}`}
        style={{ backgroundImage: `url(${CARD_IMAGES.performance})` }}
      >
        <div className="as-performance-card-container">
          <p className="as-performance-title">{t("system.tropics.performanceTitle")}</p>
          <p className="as-performance-description">{t("system.tropics.performanceSubtitle")}</p>

          <div className="as-performance-content">
            <div
              className={`as-performance-bars ${isVisible ? "is-animated" : ""}`}
              style={
                {
                  "--bar-height": `${barHeight}px`,
                  "--bar-gap": `${barGap}px`,
                } as React.CSSProperties
              }
            >
              {Array.from({ length: totalBars }).map((_, index) => {
                const isActive = index >= totalBars - activeBars;
                return (
                  <span
                    key={index}
                    className={isActive ? "active" : "inactive"}
                    style={
                      {
                        "--bar-delay": isActive
                          ? `${(totalBars - 1 - index) * 0.07}s`
                          : "0s",
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>

            <p className="as-performance-percentage">
              {Math.round(rolledPerformance)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
