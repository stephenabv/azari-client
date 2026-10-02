import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import iconSolar from "../assets/icons/icon-solar.svg";
import iconHighlight from "../assets/icons/icon-highlight.svg";
import iconPrev from "../assets/icons/icon-prev.svg";
import iconNext from "../assets/icons/icon-next.svg";
import iconWatchVideo from "../assets/icons/icon-watch-video.svg";
import { useContent } from "../hooks/useContent";
import { useT, type MessageKey } from "../i18n";

type Translate = ReturnType<typeof useT>;

type JourneyEntry = {
  id: string;
  name: string;
  location: string;
  testimonial: string;
  videoUrl: string;
  coords: [number, number];
};

type ClientJourneyContent = {
  entries: JourneyEntry[];
};

type DefaultEntry = Omit<JourneyEntry, "testimonial"> & { testimonialKey: MessageKey };

/**
 * Placeholder stories shown until (or instead of, if the request fails) the
 * admin-managed "clientJourney" content arrives. Names and places are proper
 * nouns; only the quotes are localized.
 */
const DEFAULT_ENTRIES: readonly DefaultEntry[] = [
  { id: "1", name: "Santos Family", location: "Quezon City, Metro Manila", testimonialKey: "pages.clientJourney.testimonials.santos", videoUrl: "", coords: [121.05, 14.68] },
  { id: "2", name: "Cruz Commercial", location: "Cebu City, Cebu", testimonialKey: "pages.clientJourney.testimonials.cruz", videoUrl: "", coords: [123.90, 10.32] },
  { id: "3", name: "Reyes Residence", location: "Davao City, Davao del Sur", testimonialKey: "pages.clientJourney.testimonials.reyes", videoUrl: "", coords: [125.61, 7.07] },
  { id: "4", name: "De Leon Residence", location: "Angeles City, Pampanga", testimonialKey: "pages.clientJourney.testimonials.deLeon", videoUrl: "", coords: [120.59, 15.15] },
  { id: "5", name: "Garcia Business", location: "Iloilo City, Iloilo", testimonialKey: "pages.clientJourney.testimonials.garcia", videoUrl: "", coords: [122.57, 10.72] },
  { id: "6", name: "Torres Family", location: "Batangas City, Batangas", testimonialKey: "pages.clientJourney.testimonials.torres", videoUrl: "", coords: [121.05, 13.76] },
  { id: "7", name: "Chua Enterprise", location: "Cagayan de Oro, Misamis Oriental", testimonialKey: "pages.clientJourney.testimonials.chua", videoUrl: "", coords: [124.63, 8.48] },
];

function buildDefaultJourney(t: Translate): ClientJourneyContent {
  return {
    entries: DEFAULT_ENTRIES.map(({ testimonialKey, ...entry }) => ({ ...entry, testimonial: t(testimonialKey) })),
  };
}

const SVG_W = 200;
const SVG_H = 370;

let _cachedPathD: string | null = null;

let _cachedProj: any = null;

function usePhilippinesMap() {
  const [state, setState] = useState<{
    pathD: string;

    proj: any;
  } | null>(
    _cachedPathD && _cachedProj
      ? { pathD: _cachedPathD, proj: _cachedProj }
      : null
  );

  useEffect(() => {
    if (_cachedPathD && _cachedProj) return;

    fetch("/data/philippines.json")
      .then(r => r.json())
      .then((ph: Feature<Geometry>) => {
        const proj = geoMercator().fitExtent(
          [[18, 18], [SVG_W - 18, SVG_H - 18]],
          ph
        );
        const pathGen = geoPath().projection(proj);
        const pathD = pathGen(ph) ?? "";

        _cachedPathD = pathD;
        _cachedProj = proj;
        setState({ pathD, proj });
      })
      .catch(err => console.error("Failed to load Philippines map:", err));
  }, []);

  return state;
}

function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
  if (ytWatch) return `https://img.youtube.com/vi/${ytWatch[1]}/hqdefault.jpg`;
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://img.youtube.com/vi/${ytShort[1]}/hqdefault.jpg`;
  return null;
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url.trim()) return null;
  const ytWatch = url.match(/youtube\.com\/watch\?.*v=([\w-]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;
  const ytShort = url.match(/youtu\.be\/([\w-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;
  return url;
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const t = useT();
  const isDirectVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  const embedUrl = getVideoEmbedUrl(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);

  const handleClose = useCallback(() => {

    if (iframeRef.current) iframeRef.current.src = "";
    if (videoRef.current)  videoRef.current.pause();
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
        <button className="as-video-close" onClick={handleClose} aria-label={t("pages.clientJourney.closeVideo")}>×</button>
        {isDirectVideo ? (
          <video ref={videoRef} src={url} autoPlay controls className="as-video-player" />
        ) : embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="as-video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={t("pages.clientJourney.videoTitle")}
          />
        ) : null}
      </div>
    </div>,
    document.body
  );
}

function PhilippinesMap({
  entries,
  activeIndex,
  onMarkerClick,
}: {
  entries: JourneyEntry[];
  activeIndex: number;
  onMarkerClick: (i: number) => void;
}) {
  const map = usePhilippinesMap();
  const t = useT();

  return (
    <svg
      className="as-journey-map"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={t("pages.clientJourney.mapLabel")}
      focusable="false"
    >
      <defs>
        <pattern id="ph-dot-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" style={{ fill: "var(--map-grout)" }} />
          <rect x="0.75" y="0.75" width="6.5" height="6.5" rx="0.5" style={{ fill: "var(--map-tile)" }} />
        </pattern>
      </defs>

      {map && (
        <path d={map.pathD} fill="url(#ph-dot-grid)" stroke="none" />
      )}

      {map &&
        entries.map((entry, i) => {
          const point = map.proj(entry.coords);
          if (!point) return null;
          const [x, y] = point;
          const active = i === activeIndex;

          return (
            <g
              key={entry.id}
              transform={`translate(${x},${y})`}
              className={`as-ph-marker${active ? " is-active" : ""}`}
              onClick={() => onMarkerClick(i)}
              role="button"
              tabIndex={-1}
              aria-label={`${entry.name} – ${entry.location}`}
            >
              {active && (
                <image
                  href={iconHighlight}
                  x="-9" y="-9" width="18" height="18"
                  className="as-ph-marker-ring"
                  pointerEvents="none"
                />
              )}
              <image
                href={iconSolar}
                x="-5" y="-7" width="10" height="12"
                pointerEvents="none"
              />
            </g>
          );
        })}
    </svg>
  );
}

export default function ASClientJourney() {
  const t = useT();
  const defaultJourney = useMemo(() => buildDefaultJourney(t), [t]);
  const content = useContent<ClientJourneyContent>("clientJourney", defaultJourney);
  const entries = content.entries?.length ? content.entries : defaultJourney.entries;

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(420);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const firstSlideRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const CARD_GAP = 20;

  useEffect(() => {
    setActiveIndex(0);
  }, [entries.length]);

  useEffect(() => {
    const el = firstSlideRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSlideWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        setIsVisible(true);
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, entries.length - 1)));
  }, [entries.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx < 0 ? activeIndex + 1 : activeIndex - 1);
  }, [activeIndex, goTo]);

  return (
    <section
      ref={sectionRef}
      id="client-journey"
      className={`ASClientJourney${isVisible ? " is-visible" : ""}`}
    >
      {videoUrl && (
        <VideoModal url={videoUrl} onClose={() => setVideoUrl(null)} />
      )}

      <div className="as-journey-left">
        <h2 className="as-journey-title">
          {t("pages.clientJourney.titleLine1")}<br />{t("pages.clientJourney.titleLine2")}
        </h2>

        <div
          className="as-journey-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="as-journey-track"
            style={{ transform: `translateX(-${activeIndex * (slideWidth + CARD_GAP)}px)` }}
          >
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                ref={i === 0 ? firstSlideRef : undefined}
                className="as-journey-slide"
              >
                <div className="as-journey-card-image">
                  <div
                    className="as-journey-img-placeholder"
                    style={
                      getYouTubeThumbnail(entry.videoUrl)
                        ? { backgroundImage: `url(${getYouTubeThumbnail(entry.videoUrl)})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : undefined
                    }
                  />
                  <button
                    className="as-journey-watch-btn"
                    onClick={() => { if (entry.videoUrl) setVideoUrl(entry.videoUrl); }}
                    style={entry.videoUrl ? undefined : { opacity: 0.4, cursor: "default" }}
                  >
                    <img src={iconWatchVideo} alt={t("pages.clientJourney.watchVideo")} draggable={false} />
                  </button>
                </div>

                <div className="as-journey-info">
                  <div className="as-journey-name-row">
                    <strong className="as-journey-name">{entry.name}</strong>
                    <span className="as-journey-location">{entry.location}</span>
                  </div>
                  <p className="as-journey-testimonial">{entry.testimonial}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="as-journey-nav">
          <button
            className="as-journey-nav-btn"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label={t("pages.clientJourney.previous")}
          >
            <img src={iconPrev} alt="" aria-hidden="true" draggable={false} />
          </button>
          <span className="as-journey-counter">{activeIndex + 1}/{entries.length}</span>
          <button
            className="as-journey-nav-btn"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === entries.length - 1}
            aria-label={t("pages.clientJourney.next")}
          >
            <img src={iconNext} alt="" aria-hidden="true" draggable={false} />
          </button>
        </div>
      </div>

      <div className="as-journey-right">
        <PhilippinesMap
          entries={entries}
          activeIndex={activeIndex}
          onMarkerClick={goTo}
        />
      </div>
    </section>
  );
}
