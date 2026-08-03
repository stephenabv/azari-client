import { type CSSProperties } from "react";
import type { TechBreakdownItem, HeroBentoCard, FeatureBentoCard } from "../services/ASContent";

function HeroBentoCardView({ item, staticMetric: _sm }: { item: HeroBentoCard; staticMetric?: boolean }) {
  return (
    <div
      className="as-pd-bento-hero"
      style={{ '--bento-hero-accent': item.accent ?? '#c84020' } as CSSProperties}
    >
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="as-pd-bento-hero-img" />}
      {item.badge && <span className="as-pd-bento-hero-badge">{item.badge}</span>}
      <div className="as-pd-bento-hero-content">
        <h3 className="as-pd-bento-title">{item.title}</h3>
      </div>
      {item.tag && <span className="as-pd-bento-pill">{item.tag}</span>}
    </div>
  );
}

function FeatureBentoCardView({ item, staticMetric: _sm }: { item: FeatureBentoCard; staticMetric?: boolean }) {
  return (
    <div className="as-pd-bento-feature">
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="as-pd-bento-feature-img" />}
      <div className="as-pd-bento-feature-content">
        <h3 className="as-pd-bento-title">{item.title}</h3>
        {item.description && <p className="as-pd-bento-subtitle">{item.description}</p>}
      </div>
      {item.tag && <span className="as-pd-bento-pill">{item.tag}</span>}
    </div>
  );
}

type CardRenderer = React.FC<{ item: TechBreakdownItem; staticMetric?: boolean }>;

const CARD_REGISTRY: Partial<Record<string, CardRenderer>> = {
  hero:    HeroBentoCardView as CardRenderer,
  feature: FeatureBentoCardView as CardRenderer,
};

function coerceLegacy(raw: unknown): TechBreakdownItem {
  if (!raw || typeof raw !== 'object') return { cardType: 'feature', title: '' };
  const r = raw as Record<string, unknown>;
  const ct = r.cardType as string | undefined;
  if (ct === 'hero')    return raw as HeroBentoCard;
  if (ct === 'feature') return raw as FeatureBentoCard;
  // Legacy stat cards → convert to feature showing the label as title
  if (ct === 'stat') {
    return { cardType: 'feature', title: String(r.statLabel ?? r.title ?? ''), description: r.statValue != null ? `${r.statValue}${r.statUnit ?? ''}` : undefined } satisfies FeatureBentoCard;
  }
  if (ct === 'featured' || r.featured === true) {
    return { cardType: 'hero', title: String(r.title ?? ''), badge: r.badge as string | undefined, imageUrl: r.imageUrl as string | undefined } satisfies HeroBentoCard;
  }
  if (ct === 'metric') {
    return { cardType: 'feature', title: String(r.title ?? ''), description: r.metricValue != null ? `${r.metricValue}%` : undefined } satisfies FeatureBentoCard;
  }
  return { cardType: 'feature', title: String(r.title ?? ''), description: r.subtitle as string | undefined, imageUrl: r.imageUrl as string | undefined } satisfies FeatureBentoCard;
}

export function BentoCard({ item: rawItem, staticMetric = false }: { item: TechBreakdownItem; staticMetric?: boolean }) {
  const item = coerceLegacy(rawItem);
  const Card = CARD_REGISTRY[item.cardType] ?? (CARD_REGISTRY.feature as CardRenderer);
  return <Card item={item} staticMetric={staticMetric} />;
}

