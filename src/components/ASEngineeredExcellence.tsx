import { useEffect, useRef, useState } from "react";

const excellenceItems = [
  {
    number: "01",
    title: "Zero-Bill Future",
    description:
      "Eliminate your dependency on fluctuating grid prices. Our net-metering optimized systems turn your roof into a revenue-generating asset that pays you back.",
  },
  {
    number: "02",
    title: "Global Tier-1 Standards",
    description:
      "We exclusively deploy Tier-1 components like SMA inverters and mounting structures tested for typhoons up to 280kph. Built to last 25+ years.",
  },
  {
    number: "03",
    title: "Full Compliance",
    description:
      "Navigating local bureaucracy is our headache, not yours. We handle all permits, ERC compliance, and utility interconnection paperwork end-to-end.",
  },
  {
    number: "04",
    title: "Smart Monitoring",
    description:
      "Real-time data visualization of your energy harvest and consumption. Control your home's power flow from anywhere in the world.",
  },
];

export default function ASEngineeredExcellence() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const [showLeft, setShowLeft] = useState(false);
  const [visibleCards, setVisibleCards] = useState(-1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;
        setShowLeft(true);

        excellenceItems.forEach((_, index) => {
          window.setTimeout(() => {
            setVisibleCards(index);
          }, (index + 1) * 250);
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
    <section ref={sectionRef} className="as-engineered">
      <div className={`as-engineered-left ${showLeft ? "is-shown" : ""}`}>
        <h2 className="as-engineered-title">
          Engineered for <br />
          Excellence.
        </h2>

        <p className="as-engineered-description">
          We don't just install panels; we integrate intelligent energy systems
          designed for the unique challenges of the Philippine grid
          infrastructure.
        </p>
      </div>

      <div className="as-engineered-grid">
        {excellenceItems.map((item, index) => (
          <div
            className={`as-engineered-card ${index <= visibleCards ? "is-shown" : ""
              }`}
            key={item.number}
          >
            <div className="as-engineered-head">
              <span className="as-engineered-number">{item.number}</span>
              <p className="as-engineered-card-title">{item.title}</p>
            </div>

            <div className="as-engineered-body">
              <div className="as-engineered-line" />
              <p className="as-engineered-card-description">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}