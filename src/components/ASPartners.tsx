import { useEffect, useRef, useState } from "react";
import { useContent } from "../hooks/useContent";

type PartnerItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  order: number;
};

type PartnersContent = {
  title: string;
  items: PartnerItem[];
};

const DEFAULT_PARTNERS_CONTENT: PartnersContent = {
  title: "TRUSTED BY INDUSTRY LEADERS & TECHNOLOGY PARTNERS",
  items: [],
};

function PartnerLogo({ item }: { item: PartnerItem }) {
  if (item.logoUrl) {
    return (
      <img
        src={item.logoUrl}
        alt={item.name}
        className="as-partners-logo"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <span className="as-partners-name">{item.name}</span>;
}

export default function ASPartners() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  const content = useContent<PartnersContent>("partners", DEFAULT_PARTNERS_CONTENT);

  const items = [...content.items]
    .filter((item) => item?.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return null;

  // Duplicate 3× so the seamless loop holds even at large viewport widths
  const loopItems = [...items, ...items, ...items];

  return (
    <section
      ref={sectionRef}
      className={`as-partners${visible ? " is-visible" : ""}`}
    >
      <p className="as-partners-label">{content.title}</p>

      <div
        className="as-partners-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => {
          // Small delay so a quick swipe-tap doesn't feel sticky
          window.setTimeout(() => setPaused(false), 600);
        }}
        aria-label="Partner logos"
      >
        <div className={`as-partners-track${paused ? " is-paused" : ""}`}>
          {loopItems.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="as-partners-item"
              aria-hidden={i >= items.length ? "true" : undefined}
            >
              {item.websiteUrl ? (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="as-partners-link"
                  tabIndex={i >= items.length ? -1 : 0}
                  aria-label={item.name}
                >
                  <PartnerLogo item={item} />
                </a>
              ) : (
                <PartnerLogo item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
