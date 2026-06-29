import { useEffect, useState } from "react";
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

function trackDensity(count: number): string {
  if (count <= 3) return ' density-few';
  if (count <= 6) return ' density-medium';
  if (count <= 9) return ' density-many';
  return '';
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

  const content = useContent<PartnersContent>("partners", DEFAULT_PARTNERS_CONTENT);

  const items = [...content.items]
    .filter((item) => item?.name)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!items.length) return null;

  return (
    <section className={`as-partners${visible ? " is-visible" : ""}`}>
      <p className="as-partners-label">{content.title}</p>

      <div className={`as-partners-track${trackDensity(items.length)}`} aria-label="Partner logos">
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
