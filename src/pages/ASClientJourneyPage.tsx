import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import type {
  ApiJourneyStep, ContentBlock,
  HeadingBlock, ParagraphBlock, BulletListBlock, LinkGroupBlock,
  ButtonBlock, ImageBlock, PartnerGridBlock, ContactBlock, BulletItem,
} from "../services/ASContent";
import { fetchClientJourney } from "../services/ASContent";
import ASCallToAction from "../components/ASCallToAction";
import ASImgLoader from "../components/ASImgLoader";
import iconDefault from "../assets/icons/icon-default.svg";

function subscribeBodyClass(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}
function getIsLightTheme() {
  return document.body.classList.contains('light-theme');
}

export function JourneyIcon({ iconUrl, iconUrlHighlighted, iconUrlLight, iconUrlLightHighlighted, isActive, isLight: isLightProp }: {
  iconKey?: string | null;
  iconUrl?: string | null;
  iconUrlHighlighted?: string | null;
  iconUrlLight?: string | null;
  iconUrlLightHighlighted?: string | null;
  isActive: boolean;
  isLight?: boolean;
}) {
  const isLightBody = useSyncExternalStore(subscribeBodyClass, getIsLightTheme, () => false);
  const isLight = isLightProp !== undefined ? isLightProp : isLightBody;

  let src: string | null | undefined;
  if (isActive) {
    src = (isLight ? iconUrlLightHighlighted : null)
       ?? iconUrlHighlighted
       ?? (isLight ? iconUrlLight : null)
       ?? iconUrl;
  } else {
    src = (isLight ? iconUrlLight : null) ?? iconUrl;
  }

  if (src) {
    return <img src={src} alt="" className="as-cjp-icon-img" aria-hidden="true" />;
  }
  return <img src={iconDefault} alt="" className="as-cjp-icon-img" aria-hidden="true" />;
}

function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const Tag = (`h${block.level}`) as "h1" | "h2" | "h3" | "h4";
  return <Tag className="as-cjp-block-heading">{block.text}</Tag>;
}

function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
  return (
    <p
      className="as-cjp-block-para"

      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}

function renderBulletItem(item: BulletItem, depth = 0): React.ReactNode {
  return (
    <li key={item.text} className={`as-cjp-bullet-item${depth > 0 ? " as-cjp-bullet-item--nested" : ""}`}>
      {item.boldLead && <strong className="as-cjp-bullet-lead">{item.boldLead} </strong>}
      {item.linkUrl ? (
        <a
          href={item.linkUrl}
          target={item.linkExternal !== false ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="as-cjp-inline-link"
        >
          {item.linkLabel ?? item.text}
        </a>
      ) : item.text}
      {item.children && item.children.length > 0 && (
        <ul className="as-cjp-bullet-list as-cjp-bullet-list--nested">
          {item.children.map((child) => renderBulletItem(child, depth + 1))}
        </ul>
      )}
    </li>
  );
}

function BulletListRenderer({ block }: { block: BulletListBlock }) {
  return (
    <ul className="as-cjp-bullet-list">
      {block.items.map((item) => renderBulletItem(item))}
    </ul>
  );
}

function LinkGroupRenderer({ block }: { block: LinkGroupBlock }) {
  const navigate = useNavigate();
  return (
    <div className="as-cjp-link-group">
      {block.links.map((link, i) => {
        const isButton = link.style === "button";
        const handleClick = () => {
          if (link.external) { window.open(link.url, "_blank", "noopener,noreferrer"); }
          else { navigate(link.url); }
        };
        return (
          <button
            key={i}
            className={isButton ? "as-cjp-btn as-cjp-btn--primary" : "as-cjp-inline-link as-cjp-text-link"}
            onClick={handleClick}
          >
            {link.label}
          </button>
        );
      })}
    </div>
  );
}

function ButtonRenderer({ block }: { block: ButtonBlock }) {
  const navigate = useNavigate();
  return (
    <button
      className="as-cjp-btn as-cjp-btn--primary"
      onClick={() => {
        if (block.external) { window.open(block.url, "_blank", "noopener,noreferrer"); }
        else { navigate(block.url); }
      }}
    >
      {block.label}
    </button>
  );
}

function ImageRenderer({ block }: { block: ImageBlock }) {
  return (
    <figure className="as-cjp-block-figure">
      <ASImgLoader src={block.src} alt={block.alt} className="as-cjp-block-img" wrapClassName="as-cjp-block-img-loader" loading="lazy" />
      {block.caption && <figcaption className="as-cjp-block-caption">{block.caption}</figcaption>}
    </figure>
  );
}

function PartnerGridRenderer({ block }: { block: PartnerGridBlock }) {
  return (
    <div className="as-cjp-partner-grid">
      {block.items.map((item, i) => (
        <div key={i} className="as-cjp-partner-item">
          {item.logoUrl && <img src={item.logoUrl} alt={item.name} className="as-cjp-partner-logo" />}
          <span className="as-cjp-partner-name">{item.name}</span>
          {item.downloadUrl && (
            <a
              href={item.downloadUrl}
              target={item.external ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="as-cjp-partner-dl"
              download
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

const CHANNEL_ICONS: Record<string, string> = {
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
  facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  viber: "M11.4 0C5.9 0 1 4.6 1 10.2c0 3.1 1.5 5.9 3.9 7.7V21l3.5-1.9c.9.3 1.9.4 2.9.4 5.5 0 10.4-4.6 10.4-10.2C21.8 4.6 17 0 11.4 0zm1.1 13.7l-2.5-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.4 5.7z",
};

function ContactRenderer({ block }: { block: ContactBlock }) {
  return (
    <div className="as-cjp-contact-channels">
      {block.channels.map((ch, i) => (
        <a
          key={i}
          href={ch.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`as-cjp-channel as-cjp-channel--${ch.kind}`}
          aria-label={`${ch.kind}: ${ch.value}`}
        >
          <svg className="as-cjp-channel-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={CHANNEL_ICONS[ch.kind] ?? CHANNEL_ICONS.phone} />
          </svg>
          <span className="as-cjp-channel-value">{ch.value}</span>
        </a>
      ))}
    </div>
  );
}

type AnyBlockRenderer = React.FC<{ block: ContentBlock }>;

const BLOCK_REGISTRY: Record<ContentBlock['type'], AnyBlockRenderer> = {
  heading: ({ block }) => <HeadingRenderer block={block as HeadingBlock} />,
  paragraph: ({ block }) => <ParagraphRenderer block={block as ParagraphBlock} />,
  bullet_list: ({ block }) => <BulletListRenderer block={block as BulletListBlock} />,
  link_group: ({ block }) => <LinkGroupRenderer block={block as LinkGroupBlock} />,
  button: ({ block }) => <ButtonRenderer block={block as ButtonBlock} />,
  image: ({ block }) => <ImageRenderer block={block as ImageBlock} />,
  partner_grid: ({ block }) => <PartnerGridRenderer block={block as PartnerGridBlock} />,
  contact_channels: ({ block }) => <ContactRenderer block={block as ContactBlock} />,
  divider: () => <hr className="as-cjp-divider" />,
};

function BlockRenderer({ block }: { block: ContentBlock }) {
  const Renderer = BLOCK_REGISTRY[block.type] ?? (() => null);
  return <Renderer block={block} />;
}

export function StepContent({ step }: { step: ApiJourneyStep }) {
  const sorted = [...step.blocks].sort((a, b) => a.order - b.order);
  return (
    <div className="as-cjp-panel-inner">
      {step.subheading && <h2 className="as-cjp-panel-subheading">{step.subheading}</h2>}
      <div className="as-cjp-blocks">
        {sorted.map((block, i) => <BlockRenderer key={i} block={block} />)}
      </div>
    </div>
  );
}

type ASClientJourneyPageProps = {
  /** Steps resolved by the route loader, so the page is server-rendered. */
  initialSteps?: ApiJourneyStep[];
};

export default function ASClientJourneyPage({
  initialSteps,
}: ASClientJourneyPageProps = {}) {
  const [steps, setSteps] = useState<ApiJourneyStep[]>(initialSteps ?? []);
  const [loading, setLoading] = useState((initialSteps ?? []).length === 0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [shownCount, setShownCount] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [panelTopOffset, setPanelTopOffset] = useState(0);
  const [connectorBottom, setConnectorBottom] = useState(34);
  const sectionRef = useRef<HTMLElement>(null);
  const stepsColRef = useRef<HTMLDivElement>(null);
  const mobileColRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const alignRO = useRef<ResizeObserver | null>(null);
  const connectorRO = useRef<ResizeObserver | null>(null);
  const justOpenedRef = useRef<string | null>(null);

  useEffect(() => {
    // Already server-rendered; skip the duplicate request on hydration.
    if ((initialSteps ?? []).length > 0) return;
    fetchClientJourney().then(data => {
      setSteps(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!steps.length) return;
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setShownCount(steps.length); return; }

    if (hasAnimated.current) return;

    const timeouts: number[] = [];

    const triggerAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      steps.forEach((_, i) => {
        timeouts.push(window.setTimeout(() => setShownCount(i + 1), (i + 1) * 800));
      });
    };

    // On direct load / refresh the section is already in the viewport — check
    // synchronously so we don't depend on IntersectionObserver firing.
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    let observer: IntersectionObserver | null = null;

    if (inViewport) {
      triggerAnimation();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || hasAnimated.current) return;
          triggerAnimation();
          observer!.disconnect();
          observer = null;
        },
        { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
      );
      observer.observe(el);
    }

    return () => {
      if (observer) observer.disconnect();
      timeouts.forEach(clearTimeout);
      hasAnimated.current = false;
    };
  }, [steps]);

  useEffect(() => {
    alignRO.current?.disconnect();
    alignRO.current = null;

    if (!openId) {
      setSpacerHeight(0);
      setPanelTopOffset(0);
      return;
    }

    let raf: number;
    let rafId: number;
    raf = requestAnimationFrame(() => {
      const panelEl = document.getElementById(`cjp-panel-${openId}`);
      const stepEl = document.getElementById(`cjp-step-${openId}`);
      if (!panelEl || !stepEl) return;

      const update = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rowH = stepEl.offsetHeight;

          let topOffset = 0;
          const colEl = stepsColRef.current;
          if (colEl) {
            for (const row of colEl.querySelectorAll<HTMLElement>('.as-cjp-step-row')) {
              if (row.id === `cjp-step-${openId}`) break;
              topOffset += row.offsetHeight;
            }
          }

          const panelH = panelEl.offsetHeight;
          setPanelTopOffset(topOffset);
          setSpacerHeight(Math.max(0, panelH - rowH));
        });
      };

      update();
      const ro = new ResizeObserver(update);
      ro.observe(panelEl);
      alignRO.current = ro;
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafId);
      alignRO.current?.disconnect();
      alignRO.current = null;
    };
  }, [openId]);

  useEffect(() => {
    connectorRO.current?.disconnect();
    connectorRO.current = null;
    if (!steps.length) return;

    const lastId = steps[steps.length - 1].id;

    let rafId: number;
    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const colEl = stepsColRef.current;
        const lastEl = document.getElementById(`cjp-step-${lastId}`);
        if (!colEl || !lastEl) return;
        const colRect = colEl.getBoundingClientRect();
        const lastRect = lastEl.getBoundingClientRect();
        const iconCenterFromTop = (lastRect.top - colRect.top) + 34; // 14px padding-top + 20px half icon
        setConnectorBottom(Math.max(0, colEl.offsetHeight - iconCenterFromTop));
      });
    };

    const ro = new ResizeObserver(update);
    connectorRO.current = ro;
    const raf = requestAnimationFrame(() => {
      if (stepsColRef.current) { ro.observe(stepsColRef.current); update(); }
    });

    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(rafId); ro.disconnect(); connectorRO.current = null; };
  }, [steps]);

  const toggle = (id: string) => setOpenId(prev => {
    if (prev === id) return null;
    justOpenedRef.current = id;
    return id;
  });

  useEffect(() => {
    if (!openId || justOpenedRef.current !== openId) return;
    justOpenedRef.current = null;

    const raf = requestAnimationFrame(() => {
      // Pick whichever column is currently visible (desktop hides mobile and vice-versa).
      const desktopCol = stepsColRef.current;
      const mobileCol = mobileColRef.current;
      const col = desktopCol && desktopCol.offsetHeight > 0 ? desktopCol : mobileCol;
      if (!col) return;

      // Sum row heights above the target — mirrors the panel-alignment logic.
      // This avoids reading the step's own getBoundingClientRect() which is
      // unreliable while the previous panel/spacer is mid-collapse transition.
      let offsetFromColTop = 0;
      for (const row of col.querySelectorAll<HTMLElement>('.as-cjp-step-row')) {
        if (row.id === `cjp-step-${openId}`) break;
        offsetFromColTop += row.offsetHeight;
      }

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 75;
      const colTop = col.getBoundingClientRect().top + window.scrollY;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: colTop + offsetFromColTop - navH, behavior: reduced ? 'auto' : 'smooth' });
    });

    return () => cancelAnimationFrame(raf);
  }, [openId]);

  const connectorPct = steps.length ? (shownCount / steps.length) * 100 : 0;

  const renderStepRow = (step: ApiJourneyStep, i: number, isActive: boolean, isShown: boolean) => {
    const idx = String(i + 1).padStart(2, '0');
    const accent = step.accentColor ?? '#fc615a';
    return (
      <button
        key={step.id}
        className={`as-cjp-step-row${isShown ? ' is-shown' : ''}${isActive ? ' is-active' : ''}`}
        style={isActive ? { '--step-accent': accent } as React.CSSProperties : undefined}
        onClick={() => isShown && toggle(step.id)}
        aria-expanded={isActive}
        aria-controls={`cjp-panel-${step.id}`}
        id={`cjp-step-${step.id}`}
        disabled={!isShown}
      >
        <div className="as-cjp-icon-chip">
          <JourneyIcon iconKey={step.iconKey} iconUrl={step.iconUrl} iconUrlHighlighted={step.iconUrlHighlighted} iconUrlLight={step.iconUrlLight} iconUrlLightHighlighted={step.iconUrlLightHighlighted} isActive={isActive} />
        </div>
        <span className="as-cjp-step-index">{idx}</span>
        <span className="as-cjp-step-title">{step.title}</span>
        <span className="as-cjp-toggle" aria-hidden="true">{isActive ? '−' : '+'}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <section className="as-cjp as-cjp--loading">
        <div className="as-cjp-container">
          <div className="as-cjp-skeleton-header" />
          {[...Array(7)].map((_, i) => <div key={i} className="as-cjp-skeleton-row" />)}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="as-cjp">
      <div className="as-cjp-container">
        <header className="as-cjp-header">
          <h1 className="as-cjp-title">Our Client Journey</h1>
          <p className="as-cjp-subtitle">
            A streamlined step-by-step process designed to guide you from initial consultation
            to long-term energy independence.
          </p>
        </header>

        { }
        <div className="as-cjp-desktop">
          <div className="as-cjp-steps-col" ref={stepsColRef}>
            <div className="as-cjp-connector" style={{ bottom: connectorBottom }}>
              <div className="as-cjp-connector-track" />
              <div
                className="as-cjp-connector-bar"
                style={{ height: `${connectorPct}%` }}
              />
            </div>

            {steps.map((step, i) => (
              <div key={step.id} className="as-cjp-step-wrap">
                {renderStepRow(step, i, openId === step.id, i < shownCount)}
                <div
                  className="as-cjp-row-spacer"
                  style={{ height: openId === step.id ? spacerHeight : 0 }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

          <div className="as-cjp-panel-col" style={{ marginTop: panelTopOffset }}>
            {steps.map(step => (
              <div
                key={step.id}
                id={`cjp-panel-${step.id}`}
                className={`as-cjp-panel${openId === step.id ? ' is-active' : ''}`}
                role="region"
                aria-labelledby={`cjp-step-${step.id}`}
              >
                <StepContent step={step} />
              </div>
            ))}
          </div>
        </div>

        { }
        <div className="as-cjp-mobile" ref={mobileColRef}>
          {steps.map((step, i) => {
            const isActive = openId === step.id;
            const isShown = i < shownCount;
            return (
              <div key={step.id} className={`as-cjp-mobile-item${isShown ? ' is-shown' : ''}`}>
                {renderStepRow(step, i, isActive, isShown)}
                <div
                  id={`cjp-panel-mob-${step.id}`}
                  className={`as-cjp-mobile-panel${isActive ? ' is-open' : ''}`}
                  role="region"
                  aria-labelledby={`cjp-step-${step.id}`}
                >
                  { }
                  <div className="as-cjp-mobile-panel-inner">
                    <StepContent step={step} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ASCallToAction />
    </section>
  );
}
