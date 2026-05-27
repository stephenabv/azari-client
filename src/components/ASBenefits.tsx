import { useEffect, useRef, useState } from "react";
import benefitVideoOverlay from "../assets/videos/solar_light.mp4";
import iconDurability from "../assets/icons/icon-durability.svg";
import iconBulb from "../assets/icons/icon-bulb.svg";
import iconLeaf from "../assets/icons/icon-leaf.svg";
import iconPeace from "../assets/icons/icon-peace.svg";
import { useContent } from "../hooks/useContent";

type BenefitItem = {
  title: string;
  description: string;
  order: number;
};

type BenefitsContent = {
  items: BenefitItem[];
};

const DEFAULT_BENEFITS_CONTENT: BenefitsContent = {
  items: [
    {
      title: "Long-Term Durability",
      description: "25-YEAR WARRANTY",
      order: 1,
    },
    {
      title: "Lower Monthly Bills",
      description: "CUT YOUR ENERGY COSTS",
      order: 2,
    },
    {
      title: "Monitoring",
      description: "TRACK YOUR ENERGY & SAVINGS",
      order: 3,
    },
    {
      title: "Peace of Mind",
      description: "WORRY-FREE ENERGY SINCE DAY ONE",
      order: 4,
    },
  ],
};

const BENEFIT_VISUALS = [
  {
    icon: iconDurability,
    className: "benefit-one",
  },
  {
    icon: iconBulb,
    className: "benefit-two",
  },
  {
    icon: iconLeaf,
    className: "benefit-three",
  },
  {
    icon: iconPeace,
    className: "benefit-four",
  },
];

export default function ASBenefitsBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [visibleItems, setVisibleItems] = useState(-1);
  const [isVideoShown, setIsVideoShown] = useState(false);
  const content = useContent<BenefitsContent>("benefits", DEFAULT_BENEFITS_CONTENT);

  const benefitsData = [...content.items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      ...item,
      icon: BENEFIT_VISUALS[index]?.icon ?? iconDurability,
      className: BENEFIT_VISUALS[index]?.className ?? "benefit-one",
    }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        setIsVideoShown(true);

        benefitsData.forEach((_, index) => {
          window.setTimeout(() => {
            setVisibleItems(index);
          }, 1800 + (index + 1) * 350);
        });

        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`ASBenefitsBanner${isVideoShown ? " is-video-shown" : ""}`}>
      <video
        className={`as-benefits-video ${isVideoShown ? "is-video-shown" : ""}`}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={benefitVideoOverlay} type="video/mp4" />
      </video>

      <div className={`as-benefits-overlay${isVideoShown ? " is-shown" : ""}`} />

      <div className="as-benefits-content">
        {benefitsData.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`as-benefit-item ${item.className} ${index <= visibleItems ? "is-shown" : ""
              }`}
          >
            <div className="as-benefit-icon">
              <img src={item.icon} alt={item.title} />
            </div>

            <div className="as-benefit-text">
              <p className="as-benefit-header">{item.title}</p>
              <p className="as-benefit-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}