import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProjectById,
  type ApiProject,
  type ProjectStat,
  type PerformanceMetric,
  type TechBreakdownItem,
  type ProjectTestimonial,
} from "../services/ASContent";
import ASCallToAction from "../components/ASCallToAction";

function categoryColor(cat: string): string {
  if (cat === "Commercial") return "#a78bfa";
  if (cat === "Industrial") return "#fbbf24";
  return "#38bdf8";
}

function HeroSection({ project }: { project: ApiProject }) {
  return (
    <div className="as-pd-hero">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="as-pd-hero-img"
      />
      <div className="as-pd-hero-overlay" />
      <div className="as-pd-hero-content">
        <div className="as-pd-hero-left">
          <span
            className="as-pd-category-badge"
            style={{ color: categoryColor(project.category) }}
          >
            {project.category.toUpperCase()}
          </span>
          <h1 className="as-pd-hero-title">{project.title}</h1>
          {project.subtitle && (
            <p className="as-pd-hero-subtitle">{project.subtitle}</p>
          )}
          {project.stats && project.stats.length > 0 && (
            <div className="as-pd-hero-stats">
              {(project.stats as ProjectStat[]).map((stat, i) => (
                <div key={i} className="as-pd-hero-stat">
                  <span className="as-pd-hero-stat-value">{stat.value}</span>
                  <span className="as-pd-hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="as-pd-hero-play"
          >
            <span className="as-pd-hero-play-btn" aria-label="Play video">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="as-pd-hero-play-label">WATCH THE VIDEO</span>
          </a>
        )}
      </div>
    </div>
  );
}

function PerformanceSection({ metrics }: { metrics: PerformanceMetric[] }) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <section className="as-pd-section as-pd-performance">
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Performance &amp; Resilience Summary</h2>
        <div className="as-pd-metrics-grid">
          {metrics.map((m, i) => (
            <div key={i} className="as-pd-metric-card">
              <div className="as-pd-metric-title">{m.title}</div>
              <div className="as-pd-metric-desc">{m.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechnicalBreakdownSection({ items }: { items: TechBreakdownItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="as-pd-section as-pd-breakdown">
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Technical Breakdown</h2>
        <div className="as-pd-breakdown-grid">
          {items.map((item, i) => (
            <div
              key={i}
              className={`as-pd-breakdown-card${item.featured ? " as-pd-breakdown-card--featured" : ""}`}
            >
              {item.imageUrl && (
                <div className="as-pd-breakdown-img-wrap">
                  <img src={item.imageUrl} alt={item.title} className="as-pd-breakdown-img" />
                </div>
              )}
              <div className="as-pd-breakdown-body">
                {item.badge && (
                  <span className="as-pd-breakdown-badge">{item.badge}</span>
                )}
                <div className="as-pd-breakdown-title">{item.title}</div>
                {item.subtitle && (
                  <div className="as-pd-breakdown-subtitle">{item.subtitle}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ images }: { images: string[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [navbarBottom, setNavbarBottom] = useState(91);

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
    <section className="as-pd-section as-pd-gallery">
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">Project Installation Gallery</h2>
        <div className="as-pd-gallery-grid">
          {displayImages.map((src, i) => {
            const isLast = i === displayImages.length - 1 && remaining > 0;
            return (
              <div
                key={i}
                className={`as-pd-gallery-item${isLast ? " as-pd-gallery-item--more" : ""}`}
                onClick={isLast ? () => setModalOpen(true) : undefined}
              >
                <img src={src} alt={`Gallery photo ${i + 1}`} className="as-pd-gallery-img" />
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
                  <img
                    src={src}
                    alt={`Gallery photo ${i + 9}`}
                    className="as-pd-gallery-modal-img"
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
  return (
    <section className="as-pd-section as-pd-testimonial-section">
      <div className="as-pd-container">
        <h2 className="as-pd-section-title">What our clients say</h2>
        <div className="as-pd-testimonial-card">
          <div className="as-pd-testimonial-quote-mark">&ldquo;</div>
          <p className="as-pd-testimonial-quote">{testimonial.quote}</p>
          <div className="as-pd-testimonial-author">
            <span className="as-pd-testimonial-name">{testimonial.clientName}</span>
            <span className="as-pd-testimonial-role">{testimonial.clientRole}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonLoader() {
  return (
    <div className="as-pd-skeleton">
      <div className="as-pd-skeleton-hero" />
      <div className="as-pd-container">
        <div className="as-pd-skeleton-line as-pd-skeleton-line--wide" />
        <div className="as-pd-skeleton-line" />
        <div className="as-pd-skeleton-line as-pd-skeleton-line--short" />
      </div>
    </div>
  );
}

export default function ASProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ApiProject | null>(null);
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
      <TechnicalBreakdownSection items={breakdown} />
      <GallerySection images={gallery} />
      {testimonial && <TestimonialSection testimonial={testimonial} />}
      <ASCallToAction />
    </div>
  );
}
