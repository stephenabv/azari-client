import { useMemo } from "react";
import climateDark from "../assets/images/dark/climate_bg_dark.png";
import assetsDeployed from "../assets/images/dark/assets_deployed_dark.png";

type ASTropicsCardsProps = {
  visibleCards: number;
};

const DEFAULT_ASSETS_DEPLOYED = "0";
const DEFAULT_PERFORMANCE_RATING = 0;

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

export default function ASTropicsCards({ visibleCards }: ASTropicsCardsProps) {
  const assetsTitle = DEFAULT_ASSETS_DEPLOYED;
  const performanceRating = DEFAULT_PERFORMANCE_RATING;

  const totalBars = 12;

  const activeBars = useMemo(() => {
    const normalizedRating = Math.min(Math.max(performanceRating, 0), 100);
    return Math.max(
      0,
      Math.ceil((normalizedRating / 100) * totalBars) - 2
    );
  }, [performanceRating]);

  const maxBarsHeight = 140;
  const barGap = 4;
  const barHeight = (maxBarsHeight - (totalBars - 1) * barGap) / totalBars;

  return (
    <div className="as-tropics-cards">
      <div
        className={`as-tropics-card as-climate-card ${
          visibleCards >= 0 ? "is-shown" : ""
        }`}
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
        className={`as-tropics-card as-solar-card ${
          visibleCards >= 1 ? "is-shown" : ""
        }`}
        style={{ backgroundImage: `url(${cards[1].image})` }}
      >
        <div className="as-card-overlay as-solar-overlay" />

        <div className="as-solar-content">
          <p className="as-solar-title">{assetsTitle}</p>
          <p className="as-solar-description">{cards[1].subtitle}</p>
        </div>
      </div>

      <div
        className={`as-tropics-card as-performance-card ${
          visibleCards >= 2 ? "is-shown" : ""
        }`}
        style={{ backgroundImage: `url(${cards[2].image})` }}
      >
        <div className="as-performance-card-container">
          <p className="as-performance-title">{cards[2].title}</p>
          <p className="as-performance-description">{cards[2].subtitle}</p>

          <div className="as-performance-content">
            <div
              className={`as-performance-bars ${
                visibleCards >= 2 ? "is-animated" : ""
              }`}
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
                        "--bar-index": index,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>

            <p className="as-performance-percentage">
              {performanceRating}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}