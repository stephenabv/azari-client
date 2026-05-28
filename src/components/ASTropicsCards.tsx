import { useEffect, useMemo, useState } from "react";
import climateDark from "../assets/images/dark/climate_bg_dark.png";
import assetsDeployed from "../assets/images/dark/assets_deployed_dark.png";

type ASTropicsCardsProps = {
  isVisible: boolean;
};

const DEFAULT_ASSETS_DEPLOYED = "210.96kWp";
const DEFAULT_PERFORMANCE_RATING = 87;

const cards = [
  {
    type: "climate",
    title: "Climate Resilience",
    tags: ["TYPHOON-RATED RACKING", "HIGH-HEAT OPTIMIZATION"],
    image: climateDark,
  },
  {
    type: "solar",
    subtitle: "SOLAR ASSETS DEPLOYED",
    image: assetsDeployed,
  },
  {
    type: "performance",
    title: "Performance Guarantee",
    subtitle: "AVERAGE ELECTRICITY BILL REDUCTION FOR OUR CLIENTS",
    image: "/images/performance-bg.jpg",
  },
];

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

export default function ASTropicsCards({ isVisible }: ASTropicsCardsProps) {
  const assetsNumber = parseFloat(DEFAULT_ASSETS_DEPLOYED);
  const assetsUnit = DEFAULT_ASSETS_DEPLOYED.replace(/[\d.]/g, "");
  const performanceRating = DEFAULT_PERFORMANCE_RATING;

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
        style={{ backgroundImage: `url(${cards[0].image})` }}
      >
        <div className="as-card-overlay" />

        <p className="as-climate-title">{cards[0].title}</p>

        <div className="as-climate-tags">
          {cards[0].tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div
        className={`as-tropics-card as-solar-card ${isVisible ? "is-shown" : ""}`}
        style={{ backgroundImage: `url(${cards[1].image})` }}
      >
        <div className="as-card-overlay as-solar-overlay" />

        <div className="as-solar-content">
          <p className="as-solar-title">
            {rolledAssets.toFixed(2)}
            {assetsUnit}
          </p>
          <p className="as-solar-description">{cards[1].subtitle}</p>
        </div>
      </div>

      <div
        className={`as-tropics-card as-performance-card ${isVisible ? "is-shown" : ""}`}
        style={{ backgroundImage: `url(${cards[2].image})` }}
      >
        <div className="as-performance-card-container">
          <p className="as-performance-title">{cards[2].title}</p>
          <p className="as-performance-description">{cards[2].subtitle}</p>

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
