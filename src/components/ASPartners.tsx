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

// Gap scales with both how many logos are shown and how wide the container actually is.
// Called from a ResizeObserver so it always reflects the real rendered width.
function computeDynamicGap(containerWidth: number, count: number): number {
  const base = count <= 3 ? 80 : count <= 6 ? 64 : count <= 9 ? 48 : 36;
  const scale =
    containerWidth >= 1400 ? 1.30 :
    containerWidth >= 1100 ? 1.10 :
    containerWidth >= 800  ? 1.00 :
    containerWidth >= 640  ? 0.78 :
    containerWidth >= 480  ? 0.58 : 0.48;
  return Math.round(base * scale);
}

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
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const content = useContent<PartnersContent>("partners", DEFAULT_PARTNERS_CONTENT);

  const items = [...content.items]
    .filter((item) => item?.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Fade-in on mount — fires before first paint so no flash of invisible content
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // ResizeObserver writes --dynamic-gap directly onto the element.
  // RAF-debounced so at most one DOM write per animation frame.
  // No React state → no re-renders on resize.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !items.length) return;

    let raf = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const gap = computeDynamicGap(entry.contentRect.width, items.length);
        el.style.setProperty("--dynamic-gap", `${gap}px`);
      });
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className={`as-partners${visible ? " is-visible" : ""}`}>
      <p className="as-partners-label">{content.title}</p>

      <div ref={trackRef} className="as-partners-track" aria-label="Partner logos">
        {items.map((item) => (
          <div key={item.id} className="as-partners-item">
            {item.websiteUrl ? (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="as-partners-link"
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
    </section>
  );
}
