import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import iconPlay from "../assets/icons/icon-play.svg";
import iconGoBack from "../assets/icons/icon-go-back.svg";
import logoAnimated from "../assets/animations/logo-animated.svg";
import {
  fetchProjectById,
  type ASProjectDetailsModel,
  type ApiProject,
  type PerformanceMetric,
  type TechBreakdownItem,
  type ProjectTestimonial,
  type HeroCardSource,
} from "../services/ASContent";
import ASCallToAction from "../components/ASCallToAction";
import { BentoCard } from "../components/ASBentoCard";
import ASImgLoader from "../components/ASImgLoader";

function getVideoEmbedUrl(url: string): string | null {
  if (!url.trim()) return null;
  const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;
  return url;
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  const embedUrl = getVideoEmbedUrl(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {
    if (iframeRef.current) iframeRef.current.src = "";
    if (videoRef.current) videoRef.current.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return createPortal(
    <div className="as-video-backdrop" onClick={handleClose}>
      <div className="as-video-container" onClick={(e) => e.stopPropagation()}>
        <button className="as-video-close" onClick={handleClose} aria-label="Close video">×</button>
        {isDirectVideo ? (
          <video ref={videoRef} src={url} autoPlay playsInline className="as-video-player" />
        ) : embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="as-video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Project video"
          />
        ) : null}
      </div>
    </div>,
    document.body
  );
}

const YT_ID_PATTERNS: RegExp[] = [
  /youtube\.com\/watch\?.*v=([\w-]+)/,
  /youtu\.be\/([\w-]+)/,
  /youtube\.com\/embed\/([\w-]+)/,
];

export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  for (const re of YT_ID_PATTERNS) {
    const match = url.match(re);
    if (match) return match[1];
  }
  return null;
}

type YtThumbQuality = "maxres" | "hq";

export function getYouTubeThumbnail(
  url: string | undefined,
  quality: YtThumbQuality = "maxres",
): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const file = quality === "maxres" ? "maxresdefault.jpg" : "hqdefault.jpg";
  return `https://img.youtube.com/vi/${id}/${file}`;
}

type HeroChip = { value: string; label: string };

function resolveHeroChips(project: ApiProject): HeroChip[] {
  const cards: HeroCardSource[] = project.heroCards ?? [];

  // If the admin has configured cards, resolve them; else auto-generate.
  if (cards.length > 0) {
    return cards.slice(0, 5).flatMap((card): HeroChip[] => {
      if (card.type === 'custom') {
        if (!card.value && !card.label) return [];
        return [{ value: card.value, label: card.label }];
      }
      // system card — resolve from project fields
      const label = card.label ?? systemFieldDefaultLabel(card.field);
      const value = resolveSystemField(project, card.field);
      if (!value) return [];
      return [{ value, label }];
    });
  }

  return buildHeroChips(project);
}

function systemFieldDefaultLabel(field: string): string {
  const labels: Record<string, string> = {
    loadKw: 'Load Capacity',
    storageKwh: 'Storage Capacity',
    productionKwp: 'Production Capacity',
    savings: 'Estimated Savings',
    electricalSystem: 'Electrical System',
  };
  return labels[field as string] ?? field;
}

function resolveSystemField(project: ApiProject, field: string): string | null {
  switch (field) {
    case 'loadKw':
      return project.loadKw != null && project.loadKw > 0 ? `${project.loadKw}kW` : null;
    case 'storageKwh': {
      const val = project.storageKwh != null && project.storageKwh > 0
        ? project.storageKwh
        : (() => { const m = project.system?.match(/\(([\d.]+)\s*kWh/i); return m ? parseFloat(m[1]) : 0; })();
      return val > 0 ? `${val}kWh` : null;
    }
    case 'productionKwp':
      if (project.productionKwp != null && project.productionKwp > 0) return `${project.productionKwp}kWp`;
      { const m = project.system?.match(/^([\d.]+)\s*kWp/i); return m ? `${m[1]}kWp` : null; }
    case 'savings':
      return project.savings || null;
    case 'electricalSystem':
      if (project.electricalSystem) return project.electricalSystem;
      if (project.system) return /3-phase|three.phase/i.test(project.system) ? 'Three-Phase' : 'Single-Phase';
      return null;
    default:
      return null;
  }
}

function buildHeroChips(project: ApiProject): HeroChip[] {
  const chips: HeroChip[] = [];

  if (project.loadKw != null && project.loadKw > 0) {
    chips.push({ value: `${project.loadKw}kW`, label: 'Load Capacity' });
  }

  const storageVal = project.storageKwh != null && project.storageKwh > 0
    ? project.storageKwh
    : (() => {
      const m = project.system?.match(/\(([\d.]+)\s*kWh/i);
      return m ? parseFloat(m[1]) : 0;
    })();
  if (storageVal > 0) {
    chips.push({ value: `${storageVal}kWh`, label: 'Storage Capacity' });
  }

  if (project.productionKwp != null && project.productionKwp > 0) {
    chips.push({ value: `${project.productionKwp}kWp`, label: 'Production Capacity' });
  } else {
    const m = project.system?.match(/^([\d.]+)\s*kWp/i);
    if (m) chips.push({ value: `${m[1]}kWp`, label: 'Production Capacity' });
  }

  if (project.savings) {
    chips.push({ value: project.savings, label: 'Estimated Savings' });
  }

  if (project.electricalSystem) {
    chips.push({ value: project.electricalSystem, label: 'Electrical System' });
  } else if (project.system) {
    const isThree = /3-phase|three.phase/i.test(project.system);
    chips.push({ value: isThree ? 'Three-Phase' : 'Single-Phase', label: 'Electrical System' });
  }

  const seen = new Set<string>();
  return chips.filter(c => { if (seen.has(c.label)) return false; seen.add(c.label); return true; });
}


function HeroSection({ project }: { project: ApiProject }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();

  const chips = resolveHeroChips(project);

  const heroSrc = getYouTubeThumbnail(project.videoUrl) ?? project.imageUrl;
  const heroFallback = getYouTubeThumbnail(project.videoUrl, "hq") ?? project.imageUrl;

  const handleHeroError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";
      img.src = heroFallback;
    },
    [heroFallback],
  );

  const handleHeroLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth <= 120 && img.dataset.fallbackApplied !== "true") {
        img.dataset.fallbackApplied = "true";
        img.src = heroFallback;
      }
    },
    [heroFallback],
  );

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="as-pd-hero">
      {videoOpen && project.videoUrl && (
        <VideoModal url={project.videoUrl} onClose={() => setVideoOpen(false)} />
      )}
      <ASImgLoader
        src={heroSrc}
        alt={project.title}
        className="as-pd-hero-img"
        wrapClassName="as-img-loader-fill"
        onError={handleHeroError}
        onLoad={handleHeroLoad}
      />
      <div className="as-pd-hero-overlay" />
      <button className="as-pd-back-btn as-pd-back-btn--mobile" onClick={() => navigate(-1)} aria-label="Go back">
        <img src={iconGoBack} alt="" />
      </button>
      <div ref={bottomRef} className={`as-pd-hero-bottom${isShown ? ' is-shown' : ''}`}>
        <button className="as-pd-back-btn as-pd-back-btn--desktop" onClick={() => navigate(-1)} aria-label="Go back">
          <img src={iconGoBack} alt="" />
        </button>
        <div className="as-pd-hero-content">
          <div className="as-pd-hero-left">
            <span
              className="as-pd-category-badge"
              style={{ color: project.categoryColor || '#ffffff' }}
            >
              {project.category.toUpperCase()}
            </span>
            <h1 className="as-pd-hero-title">{project.title}</h1>
            {project.subtitle && (
              <p className="as-pd-hero-subtitle">{project.subtitle}</p>
            )}
            {chips.length > 0 && (
              <div className="as-pd-hero-stats">
                {chips.map(chip => (
                  <div key={chip.label} className="as-pd-hero-stat">
                    <span className="as-pd-hero-stat-value">{chip.value}</span>
                    <span className="as-pd-hero-stat-label">{chip.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {project.videoUrl && (
          <button
            className="as-pd-hero-play"
            onClick={() => setVideoOpen(true)}
            aria-label="Watch the video"
          >
            <img src={iconPlay} alt="" draggable={false} />
          </button>
        )}
      </div>
    </div>
  );
}

const PERF_PAGE_SIZE = 3;

function PerformanceSection({ metrics }: { metrics: PerformanceMetric[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!metrics || metrics.length === 0) return null;

  const hasMore = metrics.length > PERF_PAGE_SIZE;
  const visible = showAll ? metrics : metrics.slice(0, PERF_PAGE_SIZE);

  return (
    <section ref={sectionRef} className={`as-pd-section as-pd-performance${isShown ? ' is-shown' : ''}`}>
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Performance &amp; Resilience Summary</h2>
        <div className="as-pd-perf-grid">
          {visible.map((m, i) => (
            <div key={i} className="as-pd-perf-item">
              <div className="as-pd-perf-title">{m.title}</div>
              <div className="as-pd-perf-desc">{m.description}</div>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="as-pd-perf-show-more"
            onClick={() => setShowAll(v => !v)}
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </section>
  );
}

function isEmptyBentoCard(item: TechBreakdownItem): boolean {
  if (item.cardType === 'hero' || item.cardType === 'feature') {
    if (item.titleSource?.type === 'system') return false;
    return !item.title?.trim();
  }
  return true;
}

function resolveBentoTitle(item: TechBreakdownItem, project: ApiProject): TechBreakdownItem {
  if (item.cardType !== 'hero' && item.cardType !== 'feature') return item;
  if (item.titleSource?.type !== 'system') return item;
  const resolved = resolveSystemField(project, item.titleSource.field);
  return resolved ? { ...item, title: resolved } : item;
}

function TechnicalBreakdownSection({ items, project }: { items: TechBreakdownItem[]; project: ApiProject }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = (items ?? [])
    .filter(item => !isEmptyBentoCard(item))
    .map(item => resolveBentoTitle(item, project))
    .slice(0, 5);

  if (filtered.length === 0) return null;
  return (
    <section ref={sectionRef} className={`as-pd-section as-pd-breakdown${isShown ? ' is-shown' : ''}`}>
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Technical Breakdown</h2>
        <div className="as-pd-breakdown-bento" data-count={filtered.length}>
          {filtered.map((item, i) => (
            <BentoCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ images }: { images: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);
  const [visibleItems, setVisibleItems] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [navbarBottom, setNavbarBottom] = useState(91);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsShown(true);
        const count = Math.min(images.length, 8);
        Array.from({ length: count }).forEach((_, index) => {
          window.setTimeout(() => setVisibleItems(index), (index + 1) * 180);
        });
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [images.length]);

  useEffect(() => {
    if (!modalOpen) return;
    const navbar = document.querySelector("header.navbar-section");
    const nb = navbar ? Math.round(navbar.getBoundingClientRect().bottom) : 91;
    setNavbarBottom(nb);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 8);
  const extraImages = images.slice(8);
  const remaining = extraImages.length;

  return (
    <section ref={sectionRef} className={`as-pd-section as-pd-gallery${isShown ? ' is-shown' : ''}`}>
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Project Installation Gallery</h2>
        <div className="as-pd-gallery-grid">
          {displayImages.map((src, i) => {
            const isLast = i === displayImages.length - 1 && remaining > 0;
            return (
              <div
                key={i}
                className={`as-pd-gallery-item${isLast ? " as-pd-gallery-item--more" : ""}${i <= visibleItems ? " is-shown" : ""}`}
                onClick={isLast ? () => setModalOpen(true) : undefined}
              >
                <ASImgLoader src={src} alt={`Gallery photo ${i + 1}`} className="as-pd-gallery-img" wrapClassName="as-img-loader-block" />
                {isLast && (
                  <div className="as-pd-gallery-more">
                    <span>+{remaining}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && createPortal(
        <div
          className="as-pd-gallery-modal-backdrop"
          style={{ top: `${navbarBottom}px` }}
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="More photos"
        >
          <div
            className="as-pd-gallery-modal"
            style={{ maxHeight: `calc(100vh - ${navbarBottom}px - 32px)` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="as-pd-gallery-modal-header">
              <h3 className="as-pd-gallery-modal-title">
                More Photos
                <span className="as-pd-gallery-modal-count">{extraImages.length}</span>
              </h3>
              <button
                className="as-pd-gallery-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close gallery"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="as-pd-gallery-modal-grid">
              {extraImages.map((src, i) => (
                <div key={i} className="as-pd-gallery-modal-item">
                  <ASImgLoader
                    src={src}
                    alt={`Gallery photo ${i + 9}`}
                    className="as-pd-gallery-modal-img"
                    wrapClassName="as-img-loader-block"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

function TestimonialSection({ testimonial }: { testimonial: ProjectTestimonial }) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsShown(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`as-pd-section as-pd-testimonial-section${isShown ? ' is-shown' : ''}`}>
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">What our clients say</h2>
        <div className="as-pd-testimonial-layout">
          <div className="as-pd-testimonial-author">
            <div className="as-pd-testimonial-name-role">
              <span className="as-pd-testimonial-name">{testimonial.clientName}</span>
              <span className="as-pd-testimonial-role">{testimonial.clientRole}</span>
            </div>
          </div>
          <div className="as-pd-testimonial-quote-container">
            <div className="as-pd-testimonial-open-quote" aria-hidden="true">&ldquo;</div>
            <div className="as-pd-testimonial-quote-inner-container">
              <p className="as-pd-testimonial-quote">{testimonial.quote}</p>
            </div>
            <div className="as-pd-testimonial-close-quote" aria-hidden="true">&rdquo;</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonLoader() {
  return (
    <div className="as-pd-skeleton">
      <div className="as-pd-skeleton-hero">
        <img src={logoAnimated} alt="" className="as-pd-skeleton-hero-logo" />
      </div>
      <div className="as-pd-container">
        <div className="as-pd-skeleton-line as-pd-skeleton-line--wide" />
        <div className="as-pd-skeleton-perf-grid">
          {[0, 1, 2].map(i => (
            <div key={i} className="as-pd-skeleton-perf-item">
              <div className="as-pd-skeleton-line" style={{ width: '55%', height: 20, marginBottom: 12 }} />
              <div className="as-pd-skeleton-line" style={{ width: '90%', marginBottom: 6 }} />
              <div className="as-pd-skeleton-line" style={{ width: '75%', marginBottom: 6 }} />
              <div className="as-pd-skeleton-line" style={{ width: '60%' }} />
            </div>
          ))}
        </div>
        <div className="as-pd-skeleton-line" style={{ width: '40%', height: 28, marginTop: 60 }} />
        <div className="as-pd-skeleton-line as-pd-skeleton-line--short" />
      </div>
    </div>
  );
}

export default function ASProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ASProjectDetailsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    fetchProjectById(id).then((data) => {
      if (!data) {
        setNotFound(true);
      } else {
        setProject(data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <SkeletonLoader />;

  if (notFound || !project) {
    return (
      <div className="as-pd-not-found">
        <div className="as-pd-not-found-inner">
          <p className="as-pd-not-found-code">404</p>
          <h2 className="as-pd-not-found-title">Project Not Found</h2>
          <p className="as-pd-not-found-desc">
            This project may have been removed or the link is incorrect.
          </p>
          <button
            className="as-pd-not-found-btn"
            onClick={() => navigate("/projects")}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const metrics = (project.performanceMetrics ?? []) as PerformanceMetric[];
  const breakdown = (project.technicalBreakdown ?? []) as TechBreakdownItem[];
  const gallery = (project.galleryImages ?? []) as string[];
  const testimonial = project.testimonial as ProjectTestimonial | null | undefined;

  return (
    <div className="as-pd-page">
      <HeroSection project={project} />
      <PerformanceSection metrics={metrics} />
      <TechnicalBreakdownSection items={breakdown} project={project} />
      <GallerySection images={gallery} />
      {testimonial && <TestimonialSection testimonial={testimonial} />}
      <ASCallToAction />
    </div>
  );
}
