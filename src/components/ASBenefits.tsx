import { useEffect, useRef, useState } from "react";
import benefitVideoOverlay from "../assets/videos/solar_light.mp4";
import iconDurability from "../assets/icons/icon-durability.svg";
import iconBulb from "../assets/icons/icon-bulb.svg";
import iconLeaf from "../assets/icons/icon-leaf.svg";
import iconPeace from "../assets/icons/icon-peace.svg";

const benefitsData = [
  {
    icon: iconDurability,
    title: "Long-Term Durability",
    description: "25-YEAR WARRANTY",
    className: "benefit-one",
  },
  {
    icon: iconBulb,
    title: "Lower Monthly Bills",
    description: "CUT YOUR ENERGY COSTS",
    className: "benefit-two",
  },
  {
    icon: iconLeaf,
    title: "Monitoring",
    description: "TRACK YOUR ENERGY & SAVINGS",
    className: "benefit-three",
  },
  {
    icon: iconPeace,
    title: "Peace of Mind",
    description: "WORRY-FREE ENERGY SINCE DAY ONE",
    className: "benefit-four",
  },
];

export default function ASBenefitsBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const [visibleItems, setVisibleItems] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        benefitsData.forEach((_, index) => {
          window.setTimeout(() => {
            setVisibleItems(index);
          }, (index + 1) * 350);
        });

        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="ASBenefitsBanner">
      <video className="as-benefits-video" autoPlay muted loop playsInline>
        <source src={benefitVideoOverlay} type="video/mp4" />
      </video>

      <div className="as-benefits-overlay" />

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