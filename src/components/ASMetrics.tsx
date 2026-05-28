import { useEffect, useRef, useState } from "react";
import { StatCard } from "../modules/rolling-card/ASRollingCard";
import { useContent } from "../hooks/useContent";

type MetricItem = {
  value: string;
  label: string;
  order: number;
};

type MetricsContent = {
  items: MetricItem[];
};

const DEFAULT_METRICS_CONTENT: MetricsContent = {
  items: [
    { value: "0", label: "INSTALLED", order: 1 },
    { value: "0", label: "ACTIVE CLIENTS", order: 2 },
    { value: "0", label: "CERTIFIED COMPLIANT", order: 3 },
    { value: "0", label: "PERFORMANCE WARRANTY", order: 4 },
  ],
};

export default function ASMetrics() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [visibleCards, setVisibleCards] = useState(-1);
  const content = useContent<MetricsContent>("metrics", DEFAULT_METRICS_CONTENT);

  const metrics = [...content.items]
    .filter((item) => item?.label && item?.value)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        metrics.forEach((_, index) => {
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
  }, [metrics]);

  return (
    <section ref={sectionRef} className="stats-card-section">
      {metrics.map((item, index) => (
        <div
          key={`${item.value}-${item.label}-${index}`}
          className={`stats-card-wrapper ${
            index <= visibleCards ? "is-shown" : ""
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
