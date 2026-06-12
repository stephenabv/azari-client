import { useEffect, useState, useRef, type CSSProperties } from "react";
import type { TechBreakdownItem, HeroBentoCard, StatBentoCard, FeatureBentoCard } from "../services/ASContent";

export function MetricCircle({
  value,
  displayLabel,
  size = 110,
  color = 'var(--pd-accent)',
  trackColor = 'rgba(255,255,255,0.1)',
  textColor = '#ffffff',
  staticDisplay = false,
}: {
  value: number;
  displayLabel?: string;
  size?: number;
  color?: string;
  trackColor?: string;
  textColor?: string;
  staticDisplay?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animated, setAnimated] = useState(staticDisplay);

  useEffect(() => {
    if (staticDisplay) return;
    const el = svgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [staticDisplay]);

  const sw = 7;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = animated ? circ - (Math.min(100, Math.max(0, value)) / 100) * circ : circ;
  const c = size / 2;

  return (
    <div className="as-pd-metric-ring-wrap" style={{ width: size, height: size }}>
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
        <circle
          cx={c} cy={c} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: `${c}px ${c}px`,
            transition: animated ? 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>
      <span className="as-pd-metric-ring-value" style={{ color: textColor }}>
        {displayLabel ?? `${value}%`}
      </span>
    </div>
  );
}

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

function StatBentoCardView({ item, staticMetric = false }: { item: StatBentoCard; staticMetric?: boolean }) {
  const ringValue = Math.min(100, Math.max(0, item.statValue));
  return (
    <div className="as-pd-bento-stat">
      <MetricCircle
        value={ringValue}
        displayLabel={`${item.statValue}${item.statUnit}`}
        size={150}
        color={item.ringColor ?? '#22c55e'}
        trackColor="rgba(0,0,0,0.1)"
        textColor="#111111"
        staticDisplay={staticMetric}
      />
      <p className="as-pd-bento-stat-label">{item.statLabel}</p>
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

const CARD_REGISTRY: Record<TechBreakdownItem['cardType'], CardRenderer> = {
  hero:    HeroBentoCardView as CardRenderer,
  stat:    StatBentoCardView as CardRenderer,
  feature: FeatureBentoCardView as CardRenderer,
};

function coerceLegacy(raw: unknown): TechBreakdownItem {
  if (!raw || typeof raw !== 'object') return { cardType: 'feature', title: '' };
  const r = raw as Record<string, unknown>;
  const ct = r.cardType as string | undefined;
  if (ct === 'hero' || ct === 'stat' || ct === 'feature') return raw as TechBreakdownItem;
  if (ct === 'featured' || r.featured === true) {
    return { cardType: 'hero', title: String(r.title ?? ''), badge: r.badge as string | undefined, imageUrl: r.imageUrl as string | undefined } satisfies HeroBentoCard;
  }
  if (ct === 'metric') {
    return { cardType: 'stat', statValue: Number(r.metricValue ?? 0), statUnit: '%', statLabel: String(r.title ?? ''), ringColor: r.metricColor as string | undefined } satisfies StatBentoCard;
  }
  return { cardType: 'feature', title: String(r.title ?? ''), description: r.subtitle as string | undefined, imageUrl: r.imageUrl as string | undefined } satisfies FeatureBentoCard;
}

export function BentoCard({ item: rawItem, staticMetric = false }: { item: TechBreakdownItem; staticMetric?: boolean }) {
  const item = coerceLegacy(rawItem);
  const Card = CARD_REGISTRY[item.cardType] ?? (CARD_REGISTRY.feature as CardRenderer);
  return <Card item={item} staticMetric={staticMetric} />;
}
