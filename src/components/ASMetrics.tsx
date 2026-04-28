import { useEffect, useRef, useState } from "react";
import { StatCard } from "../modules/rolling-card/ASRollingCard";

const statCardsData = [
  {
    value: "18.51MW+",
    label: "INSTALLED",
  },
  {
    value: "15,000",
    label: "ACTIVE CLIENTS",
  },
  {
    value: "DOE & PEC",
    label: "CERTIFIED COMPLIANT",
  },
  {
    value: "5-YEAR",
    label: "PERFORMANCE WARRANTY",
  },
];

export default function ASMetrics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [visibleCards, setVisibleCards] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        statCardsData.forEach((_, index) => {
          window.setTimeout(() => {
            setVisibleCards(index);
          }, (index + 1) * 220);
        });

        observer.disconnect();
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="stats-card-section">
      {statCardsData.map((item, index) => (
        <div
          key={`${item.value}-${item.label}-${index}`}
          className={`stats-card-wrapper ${index <= visibleCards ? "is-shown" : ""
            }`}
        >
          {index <= visibleCards && (
            <StatCard value={item.value} label={item.label} duration={1800} />
          )}
        </div>
      ))}
    </section>
  );
}