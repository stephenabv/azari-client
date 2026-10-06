import { useState, useRef, useEffect, useCallback, type RefObject } from "react";
import { createPortal } from "react-dom";
import type { GeoProjection } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import iconSolar from "../assets/icons/icon-solar.svg";
import iconHighlight from "../assets/icons/icon-highlight.svg";
import iconPrev from "../assets/icons/icon-prev.svg";
import iconNext from "../assets/icons/icon-next.svg";
import iconWatchVideo from "../assets/icons/icon-watch-video.svg";
import { useContent } from "../hooks/useContent";
import { nearViewportStrategy } from "../media/loadStrategies";
import { DEFAULT_CLIENT_STORIES, type ClientStory } from "../content/clientStories";

type ClientJourneyContent = {
  entries: ClientStory[];
};

const DEFAULT_JOURNEY: ClientJourneyContent = {
  entries: [...DEFAULT_CLIENT_STORIES],
};

const SVG_W = 200;
const SVG_H = 370;

type PhilippinesMapData = {
  pathD: string;
  proj: GeoProjection;
};

let cachedMap: PhilippinesMapData | null = null;

/**
 * The map outline (a 49 KB GeoJSON file plus d3-geo) is fetched only when the
 * map comes near the viewport, so it stays off the home page's first load.
 */
function usePhilippinesMap(anchorRef: RefObject<Element | null>) {
  const [state, setState] = useState<PhilippinesMapData | null>(cachedMap);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (cachedMap || !anchor) return;

    let cancelled = false;
    const stop = nearViewportStrategy.observe(anchor, () => {
      Promise.all([
        fetch("/data/philippines.json").then((r) => r.json() as Promise<Feature<Geometry>>),
        import("d3-geo"),
      ])
        .then(([ph, { geoMercator, geoPath }]) => {
          const proj = geoMercator().fitExtent([[18, 18], [SVG_W - 18, SVG_H - 18]], ph);
          cachedMap = { pathD: geoPath().projection(proj)(ph) ?? "", proj };
          if (!cancelled) setState(cachedMap);
        })
        .catch((err: unknown) => console.error("Failed to load Philippines map:", err));
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, [anchorRef]);

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
        <button className="as-video-close" onClick={handleClose} aria-label="Close video">×</button>
        {isDirectVideo ? (
          <video ref={videoRef} src={url} autoPlay controls className="as-video-player" />
        ) : embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="as-video-frame"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Client testimonial video"
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
  entries: ClientStory[];
  activeIndex: number;
  onMarkerClick: (i: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const map = usePhilippinesMap(svgRef);

  return (
    <svg
      ref={svgRef}
      className="as-journey-map"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Philippines map showing client locations"
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
  const content = useContent<ClientJourneyContent>("clientJourney", DEFAULT_JOURNEY);
  const entries = content.entries?.length ? content.entries : DEFAULT_JOURNEY.entries;

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
          Our clients journey to<br />Energy Independence
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
                    <img src={iconWatchVideo} alt="Watch the video" draggable={false} />
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
            aria-label="Previous"
          >
            <img src={iconPrev} alt="" aria-hidden="true" draggable={false} />
          </button>
          <span className="as-journey-counter">{activeIndex + 1}/{entries.length}</span>
          <button
            className="as-journey-nav-btn"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === entries.length - 1}
            aria-label="Next"
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
